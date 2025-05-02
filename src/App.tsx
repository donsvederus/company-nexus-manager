
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientProvider } from "@/context/ClientContext";
import { ServiceProvider } from "@/context/ServiceContext";

import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import ClientList from "@/pages/ClientList";
import AddClient from "@/pages/AddClient";
import EditClient from "@/pages/EditClient";
import ClientDetails from "@/pages/ClientDetails";
import ClientServices from "@/pages/ClientServices";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ClientProvider>
        <ServiceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/clients" element={<Layout><ClientList /></Layout>} />
              <Route path="/clients/new" element={<Layout><AddClient /></Layout>} />
              <Route path="/clients/:id" element={<Layout><ClientDetails /></Layout>} />
              <Route path="/clients/:id/edit" element={<Layout><EditClient /></Layout>} />
              <Route path="/clients/:id/services" element={<Layout><ClientServices /></Layout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ServiceProvider>
      </ClientProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
