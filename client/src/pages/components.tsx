import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";
import { Component } from "@/hooks/useComponents";

interface ReportComponent extends Component {
  condition: 'new' | 'good' | 'poor' | 'critical';
  placedInService: string;
  notes?: string;
  photos?: string[];
}

export default function Components() {
  const [reportComponents, setReportComponents] = useState<ReportComponent[]>([]);
  const [, setLocation] = useLocation();
  const [location] = useLocation();

  // Handle component selection from database page
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const selectedComponentId = params.get('selected');

    if (selectedComponentId) {
      // Create a new component from the URL parameters
      const newComponent: ReportComponent = {
        asset_id: parseInt(selectedComponentId),
        component_name: params.get('customName') || '',
        category: '',
        condition: (params.get('condition') as ReportComponent['condition']) || 'good',
        placedInService: params.get('placedInService') || new Date().toISOString(),
        notes: params.get('notes') || '',
        photos: params.get('photos') ? JSON.parse(params.get('photos')!) : []
      };

      setReportComponents(prev => [...prev, newComponent]);
      setLocation('/components', { replace: true });
    }
  }, [location, setLocation]);

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
                  key={component.asset_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-[375px] overflow-hidden">
                    {component.photos && component.photos[0] && (
                      <div className="h-[160px] relative">
                        <img
                          src={component.photos[0]}
                          alt={component.component_name}
                          className="w-full h-full object-cover"
                        />
                        {component.photos.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            +{component.photos.length - 1}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4 h-[215px] flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">{component.component_name}</h3>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          ID: {component.asset_id}
                        </span>
                      </div>
                      <div className="space-y-2 mt-2">
                        <p className="text-sm text-muted-foreground">
                          Condition: <span className={`font-medium ${
                            component.condition === 'critical' ? 'text-red-600' :
                            component.condition === 'poor' ? 'text-orange-600' :
                            component.condition === 'good' ? 'text-green-600' :
                            'text-blue-600'
                          }`}>{component.condition}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          In Service: <span className="font-medium">
                            {new Date(component.placedInService).toLocaleDateString()}
                          </span>
                        </p>
                        {component.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            Notes: <span className="font-medium">{component.notes}</span>
                          </p>
                        )}
                      </div>
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