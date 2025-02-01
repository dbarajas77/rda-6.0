
import { motion } from "framer-motion";
import { UserNav } from "@/components/shared/user-nav";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cover bg-center relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url("/community-bg.jpg")',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 bg-white/58 backdrop-blur-[2px] z-10" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-20 p-6 md:p-[100px]"
      >
        {children}
      </motion.div>
      
      <UserNav className="fixed top-4 right-4 z-50" />
    </div>
  );
}
