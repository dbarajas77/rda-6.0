import { motion } from "framer-motion";
import UserNav from "./user-nav";
import { useUser } from "@/hooks/use-user";
import AIAssistant from "./ai-assistant";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b bg-white/80 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">HOA Reserve Study</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-full">
              <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-semibold">
                {user?.fullName
                  ? user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : user?.username[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium">
                {user?.fullName || user?.username}
              </span>
            </div>
            <UserNav />
          </div>
        </div>
      </motion.header>
      <main>{children}</main>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}