import NavBar from "@/components/landing/nav-bar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Pricing from "@/components/landing/pricing";
import Contact from "@/components/landing/contact";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative">
      {/* Main gradient background */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#0A2463] via-[#3E92CC] to-[#0A2463] opacity-90" />

      {/* Animated gradient overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
          <div className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-to-br from-secondary/10 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-1/2 right-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-0">
        <NavBar />
        <div className="pt-16">
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
      </div>
    </div>
  );
}