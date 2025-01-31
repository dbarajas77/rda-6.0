import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, FileText, Camera, ClipboardList, Building2, Files, Database, PieChart, Calculator, FileBarChart } from "lucide-react";
import { useLocation } from "wouter";

const quickAccessItems = [
  {
    title: "Database",
    icon: Database,
    description: "Manage and explore HOA database",
    route: "/database",
    color: "text-red-600",
    bgColor: "bg-red-50/40",
    borderColor: "border-red-200",
    shadowColor: "shadow-red-200/50"
  },
  {
    title: "Financial Analysis",
    icon: BarChart,
    description: "AI-powered analysis of your reserve study data",
    route: "/analysis",
    color: "text-blue-600",
    bgColor: "bg-blue-50/40",
    borderColor: "border-blue-200",
    shadowColor: "shadow-blue-200/50"
  },
  {
    title: "Scenarios",
    icon: Calculator,
    description: "Compare different funding scenarios",
    route: "/scenarios",
    color: "text-purple-600",
    bgColor: "bg-purple-50/40",
    borderColor: "border-purple-200",
    shadowColor: "shadow-purple-200/50"
  },
  {
    title: "Report Generation",
    icon: FileBarChart,
    description: "Generate comprehensive reports",
    route: "/reports",
    color: "text-green-600",
    bgColor: "bg-green-50/40",
    borderColor: "border-green-200",
    shadowColor: "shadow-green-200/50"
  },
  {
    title: "Components",
    icon: Building2,
    description: "Detailed component analysis and tracking",
    route: "/components",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50/40",
    borderColor: "border-yellow-200",
    shadowColor: "shadow-yellow-200/50"
  },
  {
    title: "Projects",
    icon: ClipboardList,
    description: "Timeline of upcoming replacements",
    route: "/projects",
    color: "text-pink-600",
    bgColor: "bg-pink-50/40",
    borderColor: "border-pink-200",
    shadowColor: "shadow-pink-200/50"
  },
  {
    title: "Community Photos",
    icon: Camera,
    description: "Photo documentation of community assets",
    route: "/photos",
    color: "text-orange-600",
    bgColor: "bg-orange-50/40",
    borderColor: "border-orange-200",
    shadowColor: "shadow-orange-200/50"
  },
  {
    title: "Documents",
    icon: Files,
    description: "Track and manage HOA documents",
    route: "/documents",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50/40",
    borderColor: "border-indigo-200",
    shadowColor: "shadow-indigo-200/50"
  },
  {
    title: "Data Overview",
    icon: PieChart,
    description: "Access and manage community data",
    route: "/data",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50/40",
    borderColor: "border-cyan-200",
    shadowColor: "shadow-cyan-200/50"
  }
];

export default function QuickAccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {quickAccessItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.03,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setLocation(item.route)}
        >
          <Card 
            className={`h-full ${item.bgColor} hover:${item.shadowColor} transition-all duration-300 
                       cursor-pointer ${item.borderColor} shadow-lg hover:shadow-xl
                       backdrop-blur-sm hover:bg-white/50`}
          >
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