
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Introduction from "./pages/Introduction";
import SymptomLog from "./pages/SymptomLog";
import StoolLog from "./pages/StoolLog";
import Medications from "./pages/Medications";
import Analytics from "./pages/Analytics";
import MedicalReport from "./pages/MedicalReport";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/symptoms" element={<SymptomLog />} />
          <Route path="/stool-log" element={<StoolLog />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/medical-report" element={<MedicalReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
