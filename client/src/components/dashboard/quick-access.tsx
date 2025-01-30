import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart, Camera, Clock } from "lucide-react";

const quickAccessItems = [
  {
    title: "Documents",
    icon: FileText,
    count: "24",
    description: "Recent files",
  },
  {
    title: "Reports",
    icon: BarChart,
    count: "12",
    description: "Generated reports",
  },
  {
    title: "Photos",
    icon: Camera,
    count: "156",
    description: "Property images",
  },
  {
    title: "History",
    icon: Clock,
    count: "32",
    description: "Recent activities",
  },
];

export default function QuickAccess() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickAccessItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count}</div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
