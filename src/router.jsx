import React from 'react';
import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import LoginPage from './pages/LoginPage';


/* ----- Rutas ----- */
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Ruta pública: /login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});


const routeTree = rootRoute.addChildren([
  loginRoute,
]);

export const router = createRouter({ routeTree });

// Provider de Router
export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
