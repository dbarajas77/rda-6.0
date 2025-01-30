import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, FileText, Brain, Building2 } from "lucide-react";

const features = [
  {
    title: "Smart Analysis",
    description: "AI-powered insights for accurate reserve fund planning",
    icon: ChartBar,
  },
  {
    title: "Document Management",
    description: "Centralized storage for all HOA documentation",
    icon: FileText,
  },
  {
    title: "AI Assistant",
    description: "24/7 virtual assistant for instant guidance",
    icon: Brain,
  },
  {
    title: "Property Tracking",
    description: "Comprehensive asset monitoring and maintenance",
    icon: Building2,
  },
];

export default function Features() {
  return (
    <section className="relative py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Everything you need to manage your HOA reserve studies effectively
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all hover:scale-105 bg-white/95 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}