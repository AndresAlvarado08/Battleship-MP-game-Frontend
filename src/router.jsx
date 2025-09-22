import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import LobbyPage from './Lobby/Pages/LobbyPage';
import LoginPage from './Login/Pages/LoginPage';

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
