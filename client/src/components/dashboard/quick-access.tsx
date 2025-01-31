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
    color: "text-blue-600"
  },
  {
    title: "Graphs",
    icon: FileText,
    description: "Visual representation of financial data",
    route: "/graphs",
    color: "text-purple-600"
  },
  {
    title: "Components",
    icon: Building2,
    description: "Detailed component analysis and tracking",
    route: "/components",
    color: "text-green-600"
  },
  {
    title: "Projects",
    icon: ClipboardList,
    description: "Timeline of upcoming replacements",
    route: "/projects",
    color: "text-yellow-600"
  },
  {
    title: "Community Photos",
    icon: Camera,
    description: "Photo documentation of community assets",
    route: "/photos",
    color: "text-pink-600"
  },
  {
    title: "HOA Documents",
    icon: Files,
    description: "Track and manage HOA documents and records",
    route: "/documents",
    color: "text-orange-600"
  },
  {
    title: "Saved Scenarios",
    icon: Save,
    description: "View and compare different funding scenarios",
    route: "/scenarios",
    color: "text-indigo-600"
  },
  {
    title: "Database",
    icon: Database,
    description: "Access and manage your community database",
    route: "/database",
    color: "text-cyan-600"
  }
];

export default function QuickAccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {quickAccessItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setLocation(item.route)}
        >
          <Card className="h-full backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-300 cursor-pointer border border-white/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-3 rounded-full bg-white/90 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">{item.title}</h3>
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