
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BusinessProvider } from "@/contexts/BusinessContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Invoicing from "./pages/Invoicing";
import Transactions from "./pages/Transactions";
import CrmPepe from "./pages/CrmPepe";
import CreditPepe from "./pages/CreditPepe";
import Settings from "./pages/Settings";
import DataGenerator from "./pages/DataGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BusinessProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/invoicing" element={<Invoicing />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/crm-pepe" element={<CrmPepe />} />
            <Route path="/credit-pepe" element={<CreditPepe />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/data-generator" element={<DataGenerator />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BusinessProvider>
  </QueryClientProvider>
);

export default App;
