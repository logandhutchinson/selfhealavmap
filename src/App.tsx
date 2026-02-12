import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AppLayout } from "@/components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MismatchFeed from "./pages/MismatchFeed";
import PatchDetail from "./pages/PatchDetail";
import Distribution from "./pages/Distribution";
import KillSwitch from "./pages/KillSwitch";
import Thresholds from "./pages/Thresholds";
import Observability from "./pages/Observability";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { role } = useApp();
  if (!role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginRedirect />} />
            <Route element={<AuthGate><AppLayout /></AuthGate>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/feed" element={<MismatchFeed />} />
              <Route path="/patch/:patchId" element={<PatchDetail />} />
              <Route path="/distribution" element={<Distribution />} />
              <Route path="/kill-switch" element={<KillSwitch />} />
              <Route path="/thresholds" element={<Thresholds />} />
              <Route path="/observability" element={<Observability />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

function LoginRedirect() {
  const { role } = useApp();
  if (role) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

export default App;
