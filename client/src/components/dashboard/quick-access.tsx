import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, FileText, Camera, ClipboardList, Building2, Files, Save, Database } from "lucide-react";
import { useLocation } from "wouter";

const quickAccessItems = [
  {
    title: "Analysis Section",
    icon: BarChart,
    description: "AI-powered analysis of your reserve study data",
    route: "/analysis",
    bgColor: "bg-blue-50"
  },
  {
    title: "Graphs",
    icon: FileText,
    description: "Visual representation of financial data",
    route: "/graphs",
    bgColor: "bg-purple-50"
  },
  {
    title: "Components",
    icon: Building2,
    description: "Detailed component analysis and tracking",
    route: "/components",
    bgColor: "bg-green-50"
  },
  {
    title: "Projects",
    icon: ClipboardList,
    description: "Timeline of upcoming replacements",
    route: "/projects",
    bgColor: "bg-yellow-50"
  },
  {
    title: "Community Photos",
    icon: Camera,
    description: "Photo documentation of community assets",
    route: "/photos",
    bgColor: "bg-pink-50"
  },
  {
    title: "HOA Documents",
    icon: Files,
    description: "Track and manage HOA documents and records",
    route: "/documents",
    bgColor: "bg-orange-50"
  },
  {
    title: "Saved Scenarios",
    icon: Save,
    description: "View and compare different funding scenarios",
    route: "/scenarios",
    bgColor: "bg-indigo-50"
  },
  {
    title: "Database",
    icon: Database,
    description: "Access and manage your community database",
    route: "/database",
    bgColor: "bg-cyan-50"
  }
];

export default function QuickAccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickAccessItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => setLocation(item.route)}
        >
          <Card className={`hover:shadow-lg transition-all cursor-pointer ${item.bgColor} border-none`}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-white/80">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-base">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}