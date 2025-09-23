import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "@tanstack/react-router";
import ParticlesBackground from "../../Components/UI/BackgroundParticles";
import RadarBackground from "../../Components/UI/RadarBackground";
import "../../Components/Style/Login-Lobby-Style.css";

type Orientation = "H" | "V";
type Cell = { r: number; c: number };

type ShipSpec = {
  id: string;
  size: number; // 2 (pequeño) o 3 (grande)
  label: string;
};

type Placement = {
  shipId: string;
  cells: Cell[];
  orientation: Orientation;
};

const GRID = 5;
const SHIPS: ShipSpec[] = [
  { id: "S1", size: 2, label: "Pequeño 1×2" },
  { id: "S2", size: 2, label: "Pequeño 1×2" },
  { id: "L1", size: 3, label: "Grande  1×3" },
];

export default function SetupPage() {
  const { codigo } = useParams({ from: "/battleship/$codigo/setup" }) as { codigo: string };

  const [orientation, setOrientation] = useState<Orientation>("H");
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [hoverCell, setHoverCell] = useState<Cell | null>(null);

  // barcos disponibles (no colocados)
  const remaining = useMemo(() => {
    const placedIds = new Set(placements.map((p) => p.shipId));
    return SHIPS.filter((s) => !placedIds.has(s.id));
  }, [placements]);

  const occupiedKey = useMemo(() => {
    const map = new Set<string>();
    placements.forEach((p) => p.cells.forEach((cell) => map.add(`${cell.r},${cell.c}`)));
    return map;
  }, [placements]);

  const getShipSpec = (shipId: string | null) => SHIPS.find((s) => s.id === shipId) || null;

  const computeCells = useCallback((start: Cell, size: number, o: Orientation): Cell[] => {
    const cells: Cell[] = [];
    for (let i = 0; i < size; i++) {
      const r = start.r + (o === "V" ? i : 0);
      const c = start.c + (o === "H" ? i : 0);
      cells.push({ r, c });
    }
    return cells;
  }, []);

  const inBounds = (cells: Cell[]) =>
    cells.every((cell) => cell.r >= 0 && cell.r < GRID && cell.c >= 0 && cell.c < GRID);

  const overlaps = (cells: Cell[]) =>
    cells.some((cell) => occupiedKey.has(`${cell.r},${cell.c}`));

  const canPlace = (shipId: string, start: Cell, o: Orientation) => {
    const spec = getShipSpec(shipId);
    if (!spec) return false;
    const cells = computeCells(start, spec.size, o);
    if (!inBounds(cells)) return false;
    // permitir reposicionamiento del mismo barco si estaba colocado (lo "quita" antes de validar solapado)
    const own = placements.find((p) => p.shipId === shipId)?.cells ?? [];
    const ownSet = new Set(own.map((x) => `${x.r},${x.c}`));
    return cells.every((cell) => ownSet.has(`${cell.r},${cell.c}`) || !occupiedKey.has(`${cell.r},${cell.c}`));
  };

  const placeShip = (shipId: string, start: Cell, o: Orientation) => {
    const spec = getShipSpec(shipId);
    if (!spec) return;
    const cells = computeCells(start, spec.size, o);
    if (!inBounds(cells) || overlaps(cells.filter((c) => !placements.find(p => p.shipId === shipId)?.cells.some(pc => pc.r===c.r && pc.c===c.c)))) {
      return; // inválido
    }
    setPlacements((prev) => {
      // quita ubicación previa del mismo barco (si existía)
      const filtered = prev.filter((p) => p.shipId !== shipId);
      return [...filtered, { shipId, cells, orientation: o }];
    });
    setSelectedShipId(null);
  };

  // click-to-place
  const handleCellClick = (r: number, c: number, e: React.MouseEvent) => {
    // Ctrl+Click sobre un barco para quitarlo
    if (e.ctrlKey || e.metaKey) {
      const key = `${r},${c}`;
      const found = placements.find((p) => p.cells.some((cell) => `${cell.r},${cell.c}` === key));
      if (found) {
        setPlacements((prev) => prev.filter((p) => p.shipId !== found.shipId));
      }
      return;
    }
    if (!selectedShipId) return;
    if (canPlace(selectedShipId, { r, c }, orientation)) {
      placeShip(selectedShipId, { r, c }, orientation);
    }
  };

  // hover para previsualización
  const handleMouseEnter = (r: number, c: number) => setHoverCell({ r, c });
  const handleMouseLeave = () => setHoverCell(null);

  // Drag & Drop desde paleta
  const onDragStart = (e: React.DragEvent, shipId: string) => {
    e.dataTransfer.setData("text/shipId", shipId);
    e.dataTransfer.setData("text/orientation", orientation);
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (e: React.DragEvent, r: number, c: number) => {
    const shipId = e.dataTransfer.getData("text/shipId");
    const o = (e.dataTransfer.getData("text/orientation") as Orientation) || "H";
    if (shipId && canPlace(shipId, { r, c }, o)) {
      placeShip(shipId, { r, c }, o);
    }
  };

  // Tecla R para rotar
  useEffect(() => {
    const h = (ev: KeyboardEvent) => {
      if (ev.key.toLowerCase() === "r") setOrientation((o) => (o === "H" ? "V" : "H"));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const previewCells: Cell[] = useMemo(() => {
    if (!selectedShipId || !hoverCell) return [];
    const spec = getShipSpec(selectedShipId);
    if (!spec) return [];
    return computeCells(hoverCell, spec.size, orientation);
  }, [selectedShipId, hoverCell, orientation, computeCells]);

  const previewValid = useMemo(() => {
    if (!selectedShipId || !hoverCell) return false;
    return canPlace(selectedShipId, hoverCell, orientation);
  }, [selectedShipId, hoverCell, orientation, canPlace]);

  const reset = () => {
    setPlacements([]);
    setSelectedShipId(null);
  };

  const allPlaced = placements.length === SHIPS.length;

  const handleReady = async () => {
    // Aquí puedes llamar a tu backend para persistir el setup del jugador:
    // await apiAuth.post(`/battleship/${codigo}/setup`, { placements })
    // Por ahora solo mostramos por consola.
    console.log("SETUP listo", { sala: codigo, placements });
    alert("¡Setup guardado! (demo)\nReemplaza el alert por una llamada a tu backend.");
  };

  return (
    <div className="lobby">
      <ParticlesBackground />
      <div className="radar-wrap"><RadarBackground /></div>

      <div className="panel" style={{ maxWidth: 980 }}>
        <div className="header" style={{ position: "relative" }}>
          <h1>COLOCAR BARCOS — SALA {codigo?.toUpperCase()}</h1>
          <p>Arrastra o selecciona un barco y colócalo en tu tablero 5×5. (R para rotar)</p>
          <div style={{ position: "absolute", right: 0, top: 0, display: "flex", gap: 8 }}>
            <button className="btn sm secondary" onClick={() => setOrientation((o) => (o === "H" ? "V" : "H"))}>
              Orientación: {orientation === "H" ? "Horizontal" : "Vertical"}
            </button>
            <button className="btn sm" onClick={reset}>Reset</button>
            <button className="btn sm primary" onClick={handleReady} disabled={!allPlaced}>
              {allPlaced ? "Listo" : "Coloca todos los barcos"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
          {/* Paleta de barcos */}
          <div className="card" style={{ minHeight: 260 }}>
            <h3 style={{ marginTop: 0 }}>Tus barcos</h3>

            {/* A colocar */}
            <div className="sub">Disponibles</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              {remaining.length === 0 && <span className="muted">— No quedan barcos —</span>}
              {remaining.map((s) => (
                <div
                  key={s.id}
                  className="ship"
                  draggable
                  onDragStart={(e) => onDragStart(e, s.id)}
                  onClick={() => setSelectedShipId((curr) => (curr === s.id ? null : s.id))}
                  style={{
                    border: selectedShipId === s.id ? "1px solid #60a5fa" : "1px solid rgba(255,255,255,.25)",
                    padding: 8,
                    cursor: "grab",
                    userSelect: "none",
                    background: "rgba(23,37,84,.35)",
                  }}
                  title="Arrastra o haz click para seleccionar"
                >
                  <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>{s.label} — ID {s.id}</div>
                  {/* preview del barco según orientación actual */}
                  <div style={{ display: "grid", gap: 4, gridAutoFlow: orientation === "H" ? "column" : "row" }}>
                    {Array.from({ length: s.size }).map((_, i) => (
                      <div key={i} style={{ width: 22, height: 22, background: "rgba(96,165,250,.9)", borderRadius: 3 }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Colocados */}
            <div className="sub" style={{ marginTop: 16 }}>Colocados</div>
            <ul style={{ marginTop: 6, lineHeight: 1.7, paddingLeft: 16 }}>
              {placements.map((p) => {
                const spec = SHIPS.find((s) => s.id === p.shipId)!;
                return (
                  <li key={p.shipId}>
                    {spec.label} ({p.shipId}) — {p.orientation === "H" ? "H" : "V"}{" "}
                    <button
                      className="btn xs"
                      onClick={() => setPlacements((prev) => prev.filter((x) => x.shipId !== p.shipId))}
                      style={{ marginLeft: 8 }}
                      title="Quitar"
                    >
                      Quitar
                    </button>
                  </li>
                );
              })}
              {placements.length === 0 && <span className="muted">— Ninguno —</span>}
            </ul>
          </div>

          {/* Tablero */}
          <div className="card" style={{ overflowX: "auto" }}>
            <h3 style={{ marginTop: 0 }}>Tu tablero (5×5)</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID}, 44px)`,
                gridTemplateRows: `repeat(${GRID}, 44px)`,
                gap: 6,
                touchAction: "manipulation",
              }}
            >
              {Array.from({ length: GRID * GRID }).map((_, idx) => {
                const r = Math.floor(idx / GRID);
                const c = idx % GRID;
                const key = `${r},${c}`;
                const isOccupied = occupiedKey.has(key);

                // preview hover
                const isInPreview =
                  selectedShipId && hoverCell
                    ? previewCells.some((pc) => pc.r === r && pc.c === c)
                    : false;

                const previewColor =
                  isInPreview && (previewValid ? "rgba(34,197,94,.55)" : "rgba(239,68,68,.55)");

                return (
                  <div
                    key={key}
                    onClick={(e) => handleCellClick(r, c, e)}
                    onMouseEnter={() => handleMouseEnter(r, c)}
                    onMouseLeave={handleMouseLeave}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, r, c)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 6,
                      background: isOccupied ? "rgba(96,165,250,.9)" : "rgba(255,255,255,.08)",
                      outline: isInPreview ? `2px solid ${previewColor}` : "1px solid rgba(255,255,255,.18)",
                      boxShadow: isOccupied ? "inset 0 0 0 2px rgba(255,255,255,.06)" : "none",
                      position: "relative",
                      cursor: selectedShipId ? "crosshair" : "pointer",
                    }}
                    title={isOccupied ? "Ctrl+Click para quitar" : selectedShipId ? "Click para colocar" : undefined}
                  />
                );
              })}
            </div>

            <div className="muted" style={{ marginTop: 10 }}>
              Consejo: usa <kbd>R</kbd> para rotar. <kbd>Ctrl</kbd>+Click sobre un barco para quitarlo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
