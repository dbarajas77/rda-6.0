import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Camera, X } from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  lastUpdated: string;
  condition: 'critical' | 'poor' | 'average' | 'new';
  placedInService: string;
  photos?: string[];
  siteNotes?: string;
}

const mockDatabaseComponents = [
  {
    id: "DB-001",
    name: "Swimming Pool Equipment",
    category: "amenities",
    description: "Main pool filtration and heating system",
    lastUpdated: "2024-01-15",
    condition: 'average',
    placedInService: "2020-05-10"
  },
  {
    id: "DB-002",
    name: "Clubhouse HVAC",
    category: "building",
    description: "Central air conditioning system",
    lastUpdated: "2024-01-20",
    condition: 'poor',
    placedInService: "2018-11-15"
  }
];

export default function Components() {
  const [selectedDBComponent, setSelectedDBComponent] = useState<Component | null>(null);
  const [showDatabaseDialog, setShowDatabaseDialog] = useState(false);
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [newPhotos, setNewPhotos] = useState<string[]>([]);
  const [customName, setCustomName] = useState("");
  const [condition, setCondition] = useState<Component['condition']>('average');
  const [placedInService, setPlacedInService] = useState("");
  const [notes, setNotes] = useState("");
  const [, setLocation] = useLocation();

  const { data: reportComponents = [], isLoading } = useQuery<Component[]>({
    queryKey: ['report-components'],
    queryFn: async () => {
      // This would fetch the components added to the current report
      return [];
    }
  });

  const handlePhotoCapture = () => {
    // In a real implementation, this would use the device camera
    console.log("Capturing photo...");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

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

            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {/* Add Component Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="group relative overflow-hidden h-[360px] cursor-pointer"
                    variant="glass"
                    hover={true}
                    onClick={() => setShowDatabaseDialog(true)}
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

                {/* Existing Report Components */}
                {reportComponents.map((component) => (
                  <motion.div
                    key={component.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      className="group relative overflow-hidden h-[360px]"
                      variant="glass"
                      hover={true}
                    >
                      <div className="aspect-[4/3] w-full relative">
                        {component.photos?.[0] ? (
                          <img
                            src={component.photos[0]}
                            alt={component.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Camera className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                          component.condition === 'new' ? 'bg-green-500/90 text-white' :
                          component.condition === 'average' ? 'bg-yellow-500/90 text-white' :
                          component.condition === 'poor' ? 'bg-orange-500/90 text-white' :
                          'bg-red-500/90 text-white'
                        }`}>
                          {component.condition}
                        </div>
                      </div>
                      <CardContent className="p-4 bg-white/80 backdrop-blur-sm">
                        <h3 className="font-medium text-lg mb-2 line-clamp-1">{component.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{component.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Placed in service: {new Date(component.placedInService).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Database Component Selection Dialog */}
      <Dialog open={showDatabaseDialog} onOpenChange={setShowDatabaseDialog}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">Select Component from Database</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowDatabaseDialog(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
            {mockDatabaseComponents.map((component) => (
              <Card
                key={component.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  setSelectedDBComponent(component);
                  setShowDatabaseDialog(false);
                  setShowComponentForm(true);
                }}
              >
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{component.name}</h3>
                  <p className="text-sm text-muted-foreground">{component.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Component Form Dialog */}
      <Dialog open={showComponentForm} onOpenChange={setShowComponentForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">Add Component to Report</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowComponentForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Photo Upload Section */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="relative aspect-square"
                >
                  {newPhotos[index - 1] ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={newPhotos[index - 1]}
                        alt={`Photo ${index}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setNewPhotos(prev => prev.filter((_, i) => i !== index - 1))}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500/90 text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        className="hidden"
                        id={`photo-${index}`}
                      />
                      <label
                        htmlFor={`photo-${index}`}
                        className="w-full h-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <Camera className="w-8 h-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Take Photo {index}</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Component Details Form */}
            <div className="space-y-4">
              <Input
                placeholder="Custom Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full"
              />

              <Select value={condition} onValueChange={(value: Component['condition']) => setCondition(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={placedInService}
                onChange={(e) => setPlacedInService(e.target.value)}
                className="w-full"
              />

              <Textarea
                placeholder="Add notes about the component's condition, measurements, or other relevant details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComponentForm(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Here we would save the component to the report with all the collected data
              const newComponent = {
                ...selectedDBComponent!,
                name: customName || selectedDBComponent!.name,
                condition,
                placedInService,
                siteNotes: notes,
                photos: newPhotos,
                lastUpdated: new Date().toISOString()
              };
              // Add to report components
              console.log('New component:', newComponent);
              setShowComponentForm(false);
            }}>
              Add to Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}