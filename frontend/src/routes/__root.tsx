import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, createRootRouteWithContext, useRouter, useRouterState
} from "@tanstack/react-router";
import { useEffect } from "react";

import "../styles.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-brand">404</h1>
        <p className="mt-4 text-muted-foreground">This page doesn't exist.</p>
        <a href="/" className="inline-block mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">Go home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
        >Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { isAuthenticated, isLoading, user } = useAuth();

  // Route Protection Config
  const adminOnlyRoutes = ["/analytics", "/reports", "/team", "/settings"];

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && path !== "/login" && path !== "/register") {
        router.navigate({ to: "/login" });
      } else if (isAuthenticated && user) {
        // Enforce RBAC: BDA users cannot access admin-only routes
        if (user.role !== "Admin" && user.role !== "admin" && adminOnlyRoutes.includes(path)) {
          router.navigate({ to: "/" });
        }
      }
    }
  }, [isAuthenticated, isLoading, path, router, user]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const isAuthPage = path === "/login" || path === "/register";

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthPage ? (
        <Outlet />
      ) : isAuthenticated ? (
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar />
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
