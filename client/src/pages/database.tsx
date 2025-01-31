import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";

interface Component {
  id: string;
  name: string;
  category: string;
  usefulLife: number;
  placedInService: string;
  quantity: number;
  currentCost: number;
  accumReserves: number;
  remarks?: string;
  oneTimeReplacement: boolean;
}

export default function DatabaseManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [newComponent, setNewComponent] = useState<Partial<Component>>({});
  const [, setLocation] = useLocation();

  const mockComponents: Component[] = [
    {
      id: "LIB-001",
      name: "Pool Equipment",
      category: "amenities",
      usefulLife: 20,
      placedInService: "2024-01-01",
      quantity: 1,
      currentCost: 15000,
      accumReserves: 5000,
      oneTimeReplacement: false
    },
    // Add more mock components as needed
  ];

  const handleSubmit = () => {
    console.log('New component:', newComponent);
    setShowDialog(false);
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
              <h1 className="text-3xl font-bold text-gray-800 bg-white/50 px-4 py-2 rounded-lg shadow-sm">Component Library</h1>
              <div className="flex gap-3">
                <Button
                  onClick={() => setLocation('/dashboard')}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => setShowDialog(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Component
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockComponents.map((component) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-600">
                      {component.id}
                    </div>
                    <div className="p-4 pt-8">
                      <h3 className="font-medium text-lg mb-2">{component.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Category: {component.category}</p>
                        <p>Useful Life: {component.usefulLife} years</p>
                        <p>Current Cost: ${component.currentCost}</p>
                        <p>Accumulated Reserves: ${component.accumReserves}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Component</DialogTitle>
            <DialogDescription>Enter the details for the new component</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Asset ID"
              value={newComponent.id || ''}
              onChange={(e) => setNewComponent({...newComponent, id: e.target.value})}
            />
            <Input 
              placeholder="Component Name"
              value={newComponent.name || ''}
              onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
            />
            <Select 
              value={newComponent.category}
              onValueChange={(value) => setNewComponent({...newComponent, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roofing">Roofing</SelectItem>
                <SelectItem value="amenities">Amenities</SelectItem>
                <SelectItem value="building">Building</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              type="number"
              placeholder="Useful Life (years)"
              value={newComponent.usefulLife || ''}
              onChange={(e) => setNewComponent({...newComponent, usefulLife: Number(e.target.value)})}
            />
            <Input 
              type="date"
              placeholder="Placed in Service"
              value={newComponent.placedInService || ''}
              onChange={(e) => setNewComponent({...newComponent, placedInService: e.target.value})}
            />
            <Input 
              type="number"
              placeholder="Current Cost"
              value={newComponent.currentCost || ''}
              onChange={(e) => setNewComponent({...newComponent, currentCost: Number(e.target.value)})}
            />
            <Input 
              type="number"
              placeholder="Accumulated Reserves"
              value={newComponent.accumReserves || ''}
              onChange={(e) => setNewComponent({...newComponent, accumReserves: Number(e.target.value)})}
            />
            <div className="col-span-2">
              <Textarea
                placeholder="Remarks"
                value={newComponent.remarks || ''}
                onChange={(e) => setNewComponent({...newComponent, remarks: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Component</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}