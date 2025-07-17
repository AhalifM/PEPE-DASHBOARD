
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import ChatOrders from "./pages/ChatOrders";
import Invoicing from "./pages/Invoicing";
import Transactions from "./pages/Transactions";
import CRM from "./pages/CRM";
import Credit from "./pages/Credit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/chat-orders" element={<ChatOrders />} />
          <Route path="/invoicing" element={<Invoicing />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/credit" element={<Credit />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
