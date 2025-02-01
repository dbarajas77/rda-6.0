import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";

interface Component {
  id: string;
  name: string;
  category: string;
  description?: string;
  lastUpdated: string;
  condition: 'critical' | 'poor' | 'average' | 'new';
  placedInService: string;
  photos?: string[];
  siteNotes?: string;
  currentCost: number;
}

export default function Components() {
  const [reportComponents, setReportComponents] = useState<Component[]>([]);
  const [, setLocation] = useLocation();
  const [location] = useLocation();

  // Handle component selection from database page
  const params = new URLSearchParams(location.split('?')[1]);
  const selectedComponentId = params.get('selected');

  // If a component was selected from database, add it to report
  useEffect(() => {
    if (selectedComponentId) {
      // Here you would typically fetch the component details using the ID
      // and add it to reportComponents
      console.log('Selected component:', selectedComponentId);
    }
  }, [selectedComponentId]);

  return (
    <div className="min-h-screen bg-cover bg-center relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3")',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 bg-white/58 backdrop-blur-[2px] z-10" />

      <div className="relative z-20 p-6 md:p-[100px]">
        <Card className="shadow-2xl bg-white/58 backdrop-blur-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 bg-white/50 px-4 py-2 rounded-lg shadow-sm">Report Components</h1>
              <Button
                onClick={() => setLocation('/dashboard')}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
              >
                Dashboard
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Add Component Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="group relative overflow-hidden h-[275px] cursor-pointer"
                  variant="glass"
                  hover={true}
                  onClick={() => setLocation('/database?from=components')}
                >
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <Plus className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">Add Component</h3>
                    <p className="text-sm text-muted-foreground">
                      Click to select a component from the database
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* Display selected components */}
              {reportComponents.map((component) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-[275px]">
                    {/* Component details */}
                    <div className="p-4">
                      <h3 className="font-medium text-lg">{component.name}</h3>
                      <p className="text-sm text-muted-foreground">{component.description}</p>
                      <p className="text-sm text-muted-foreground">Condition: {component.condition}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}