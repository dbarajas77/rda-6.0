import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$49",
    description: "Perfect for small HOAs",
    features: [
      "Basic reserve study tools",
      "Document storage",
      "Email support",
      "1 user account",
    ],
  },
  {
    name: "Professional",
    price: "$99",
    description: "For growing communities",
    features: [
      "Advanced AI analysis",
      "Unlimited documents",
      "Priority support",
      "5 user accounts",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Custom AI models",
      "Advanced integrations",
      "24/7 support",
      "Unlimited users",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient blobs */}
      <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 via-background to-primary/5" />
      <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container relative px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that best fits your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all hover:scale-105 bg-background/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}