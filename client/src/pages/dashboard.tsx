import { motion } from "framer-motion";
import QuickAccess from "@/components/dashboard/quick-access";

export default function Dashboard() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 -z-20 bg-gradient-to-br from-[#0A2463] via-[#3E92CC] to-[#0A2463] opacity-90" />

      {/* Animated gradient overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
          <div className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-to-br from-secondary/10 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-1/2 right-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

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
          </div>
        </div>
      </motion.div>
    </div>
  );
}