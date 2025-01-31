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
        className="mx-[100px] py-[100px]"
      >
        {/* Main Card Container */}
        <div className="rounded-xl overflow-hidden relative">
          {/* Container Background with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 via-slate-900/10 to-slate-800/10 backdrop-blur-md" />

          <div className="relative p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-8">Quick Access</h1>
            <QuickAccess />

            {/* Featured Tools Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Financial Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="h-[300px] backdrop-blur-sm bg-blue-50/40 rounded-xl border border-blue-200 shadow-lg hover:shadow-blue-200/50 transition-all duration-300"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="p-3 rounded-full bg-white/90 text-blue-600 self-start">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mt-4 mb-3">Financial Analysis</h3>
                  <p className="text-gray-600 flex-grow">
                    Advanced AI-powered financial analysis tools to help you make informed decisions about your HOA's reserve funds.
                  </p>
                </div>
              </motion.div>

              {/* Scenarios */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="h-[300px] backdrop-blur-sm bg-purple-50/40 rounded-xl border border-purple-200 shadow-lg hover:shadow-purple-200/50 transition-all duration-300"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="p-3 rounded-full bg-white/90 text-purple-600 self-start">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mt-4 mb-3">Funding Scenarios</h3>
                  <p className="text-gray-600 flex-grow">
                    Create and compare different funding scenarios to find the optimal strategy for your community's future.
                  </p>
                </div>
              </motion.div>

              {/* Report Generator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="h-[300px] backdrop-blur-sm bg-green-50/40 rounded-xl border border-green-200 shadow-lg hover:shadow-green-200/50 transition-all duration-300"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="p-3 rounded-full bg-white/90 text-green-600 self-start">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mt-4 mb-3">Report Generator</h3>
                  <p className="text-gray-600 flex-grow">
                    Generate comprehensive, professional reports for your HOA reserve study with just a few clicks.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}