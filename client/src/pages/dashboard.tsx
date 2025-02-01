
import { motion } from "framer-motion";
import QuickAccess from "@/components/dashboard/quick-access";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: 'url("/Banner-Image.jpg")' }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 mx-[100px] py-[100px]"
      >
        {/* Main Card Container */}
        <div className="rounded-xl overflow-hidden relative">
          {/* Container Background with Blur */}
          <div className="absolute inset-0 bg-white/58 backdrop-blur-md" />

          <div className="relative p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-8">Quick Access</h1>
            <QuickAccess />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
