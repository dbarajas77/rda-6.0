import NavBar from "@/components/landing/nav-bar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Pricing from "@/components/landing/pricing";
import Contact from "@/components/landing/contact";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2463] via-background to-[#3E92CC] bg-fixed">
      <NavBar />
      <div className="pt-16"> {/* Add padding for fixed navbar */}
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </div>

      {/* Background gradient blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}