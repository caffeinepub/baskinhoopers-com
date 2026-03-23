import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AdminPanel from "./components/AdminPanel";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import CancelPage from "./pages/CancelPage";
import HomePage from "./pages/HomePage";
import OrdersPage from "./pages/OrdersPage";
import SuccessPage from "./pages/SuccessPage";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});
const successRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/success",
  component: SuccessPage,
});
const cancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cancel",
  component: CancelPage,
});
const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  adminRoute,
  successRoute,
  cancelRoute,
  ordersRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="bottom-right" />
        </CartProvider>
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
