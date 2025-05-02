
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClientProvider } from "@/context/ClientContext";
import { ServiceProvider } from "@/context/ServiceContext";
import { AuthProvider } from "@/context/AuthContext";

import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ClientList from "@/pages/ClientList";
import AddClient from "@/pages/AddClient";
import EditClient from "@/pages/EditClient";
import ClientDetails from "@/pages/ClientDetails";
import ClientServices from "@/pages/ClientServices";
import ServiceList from "@/pages/ServiceList";
import AddService from "@/pages/AddService";
import ServiceEditor from "@/pages/ServiceEditor";
import Reports from "@/pages/Reports";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ClientProvider>
          <ServiceProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout><Dashboard /></Layout>} />
                <Route path="/clients" element={<Layout><ClientList /></Layout>} />
                <Route path="/clients/new" element={<Layout><AddClient /></Layout>} />
                <Route path="/clients/:id" element={<Layout><ClientDetails /></Layout>} />
                <Route path="/clients/:id/edit" element={<Layout><EditClient /></Layout>} />
                <Route path="/clients/:id/services" element={<Layout><ClientServices /></Layout>} />
                <Route path="/services" element={<Layout><ServiceList /></Layout>} />
                <Route path="/services/new" element={<Layout><AddService /></Layout>} />
                <Route path="/services/:id/edit" element={<Layout><ServiceEditor /></Layout>} />
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout><Reports /></Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ServiceProvider>
        </ClientProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
