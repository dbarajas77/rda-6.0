import { motion } from "framer-motion";
import QuickAccess from "@/components/dashboard/quick-access";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-cover bg-center relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3")',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* White overlay with blur */}
      <div className="fixed inset-0 bg-white/58 backdrop-blur-[2px] z-10" />

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