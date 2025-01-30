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
    <section className="py-24 bg-secondary/5">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to manage your HOA reserve studies effectively
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
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
