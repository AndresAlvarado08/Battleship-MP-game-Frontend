import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import LoginPage from './Login/Components/LoginPage';
import LobbyPage from './Lobby/Components/LobbyPage';

/* ----- Rutas ----- */
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Ruta pública: /login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

const lobbyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lobby',
  component: LobbyPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  lobbyRoute
]);

export const router = createRouter({ routeTree });

// Provider de Router
export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
