import { motion } from "framer-motion";
import QuickAccess from "@/components/dashboard/quick-access";
import AIAssistant from "@/components/dashboard/ai-assistant";
import AnalysisSection from "@/components/dashboard/analysis-section";
import ScenarioSection from "@/components/dashboard/scenario-section";
import Layout from "@/components/shared/layout";

export default function Dashboard() {
  return (
    <div className="relative min-h-screen">
      {/* Background with gradient fallback */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-background to-secondary/5">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: 'url("/Banner-Image.jpg")',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-0 container mx-auto p-4 space-y-6"
      >
        <QuickAccess />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalysisSection />
          <ScenarioSection />
        </div>

        <AIAssistant />
      </motion.div>
    </div>
  );
}