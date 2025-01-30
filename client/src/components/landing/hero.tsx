import { motion } from "framer-motion";
import CommunityCarousel from "./community-carousel";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center -mt-16 overflow-hidden bg-gradient-to-b from-background to-secondary/5">
      <div className="flex flex-col items-center justify-center gap-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="text-center max-w-4xl mx-auto px-4 relative"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-foreground relative pb-4">
            <span className="animate-shimmer bg-[linear-gradient(110deg,#0A2463,45%,#3E92CC,55%,#0A2463)] bg-[length:200%_100%] inline-block text-transparent bg-clip-text leading-tight">
              Smart Reserve Study Management
            </span>
          </h1>
          <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 mx-auto mt-8">
            AI-powered insights for your HOA's financial future. Make informed decisions with our intelligent reserve study assistant.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full overflow-hidden"
        >
          <CommunityCarousel />
        </motion.div>
      </div>
    </div>
  );
}