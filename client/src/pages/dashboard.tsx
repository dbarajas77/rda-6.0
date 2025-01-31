import { motion } from "framer-motion";
import QuickAccess from "@/components/dashboard/quick-access";
import AIAssistant from "@/components/dashboard/ai-assistant";
import AnalysisSection from "@/components/dashboard/analysis-section";
import ScenarioSection from "@/components/dashboard/scenario-section";

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-[#f8fafc]">
      {/* Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'url("hoa house.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-4 space-y-6"
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