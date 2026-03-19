import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import queryClient from "./lib/queryClient";
import Adopter from "./pages/admin/adopter";
import Login from "./pages/login";
import { getAuth } from "./utils/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/admin/users";
import Animal from "./pages/admin/animal";
import Terms from "./pages/admin/terms";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              getAuth()
                ? <Navigate to="/admin/animais" replace />
                : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/admin/animais"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Animal />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/adotantes"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Adopter />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/termos"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Terms />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute requiredRole={"Administrador"}>
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
