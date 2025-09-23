import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import LoginPage from './Login/Components/LoginPage';
import LobbyPage from './Lobby/Components/LobbyPage';
import SalaPage from './Sala/Components/SalaPage'; // ← export default
import SetupPage from './Setup/Components/SetupPage'; // ← nueva página
import GamePage from './GamePage/GamePage'; // ← nueva página
/* ----- Rutas ----- */
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// /
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <LoginPage />,   // wrapper seguro
});

// /lobby
const lobbyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lobby',
  component: () => <LobbyPage />,   // wrapper seguro
});

// /sala/$codigo  ← NUEVA
const salaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sala/$codigo',
  component: () => <SalaPage />,    // wrapper seguro (evita “.call is not a function”)
});

const setupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/battleship/$codigo/setup',
  component: () => <SetupPage />,  // wrapper seguro
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/battleship/$codigo/play',
  component: () => <GamePage />,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  lobbyRoute,
  salaRoute,  
  setupRoute, 
  gameRoute,                      // ← agrégala aquí
]);

export const router = createRouter({ routeTree });

// Provider
export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
