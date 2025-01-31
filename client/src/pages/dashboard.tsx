import { motion } from "framer-motion";
import QuickAccess from "@/components/dashboard/quick-access";
import AIAssistant from "@/components/dashboard/ai-assistant";
import AnalysisSection from "@/components/dashboard/analysis-section";
import ScenarioSection from "@/components/dashboard/scenario-section";
import ReportGenerator from "@/components/dashboard/report-generator";

export default function Dashboard() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/hoa house.webp")',
          filter: 'brightness(0.9) blur(1px)'
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/20" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto py-8 px-4"
      >
        {/* Main Card Container */}
        <div className="rounded-xl backdrop-blur-md bg-white/30 shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-8">Quick Access</h1>
            <QuickAccess />

            {/* Featured Tools Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Financial Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="h-[400px] backdrop-blur-sm bg-blue-50/40 rounded-xl border border-blue-200 shadow-lg hover:shadow-blue-200/50 transition-all duration-300"
              >
                <AnalysisSection />
              </motion.div>

              {/* Scenarios */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="h-[400px] backdrop-blur-sm bg-purple-50/40 rounded-xl border border-purple-200 shadow-lg hover:shadow-purple-200/50 transition-all duration-300"
              >
                <ScenarioSection />
              </motion.div>

              {/* Report Generator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="h-[400px] backdrop-blur-sm bg-green-50/40 rounded-xl border border-green-200 shadow-lg hover:shadow-green-200/50 transition-all duration-300"
              >
                <ReportGenerator />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}