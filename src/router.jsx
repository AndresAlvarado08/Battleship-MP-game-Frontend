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

const routeTree = rootRoute.addChildren([
  loginRoute,
  lobbyRoute,
  salaRoute,                         // ← agrégala aquí
]);

export const router = createRouter({ routeTree });

// Provider
export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
