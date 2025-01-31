import { motion } from "framer-motion";
import QuickAccess from "@/components/dashboard/quick-access";

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
          </div>
        </div>
      </motion.div>
    </div>
  );
}