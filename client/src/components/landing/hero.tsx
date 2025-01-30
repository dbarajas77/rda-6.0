import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import CommunityCarousel from "./community-carousel";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-start overflow-hidden bg-gradient-to-b from-background to-secondary/5">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
              Smart Reserve Study Management
            </h1>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 mx-auto mt-6">
              AI-powered insights for your HOA's financial future. Make informed decisions with our intelligent reserve study assistant.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full"
          >
            <CommunityCarousel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-x-4"
          >
            <Link href="/auth">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}