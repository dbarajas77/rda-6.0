import { motion } from "framer-motion";
import UserNav from "./user-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-white/80 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">HOA Reserve Study</h1>
          <UserNav />
        </div>
      </motion.header>
      <main>{children}</main>
    </div>
  );
}