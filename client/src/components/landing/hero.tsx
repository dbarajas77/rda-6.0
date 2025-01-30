import { motion } from "framer-motion";
import CommunityCarousel from "./community-carousel";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-b from-background to-secondary/5">
      <div className="w-full px-4 md:px-6 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-foreground">
            Smart Reserve Study Management
          </h1>
          <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 mx-auto mt-6">
            AI-powered insights for your HOA's financial future. Make informed decisions with our intelligent reserve study assistant.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full overflow-hidden"
      >
        <CommunityCarousel />
      </motion.div>
    </div>
  );
}