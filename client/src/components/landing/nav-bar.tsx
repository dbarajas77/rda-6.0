import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NavBar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary cursor-pointer">
              HOA Reserve Study
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="#features">
              <span className="text-sm font-medium hover:text-primary cursor-pointer">Features</span>
            </Link>
            <Link href="#pricing">
              <span className="text-sm font-medium hover:text-primary cursor-pointer">Pricing</span>
            </Link>
            <Link href="#contact">
              <span className="text-sm font-medium hover:text-primary cursor-pointer">Contact</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" className="hidden md:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
