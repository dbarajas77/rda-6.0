
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Component {
  id: string;
  name: string;
  category: string;
  usefulLife: number;
  placedInService: string;
  quantity: number;
  currentCost: number;
  accumReserves: number;
  group?: string;
  adjustment?: number;
  unitCost?: number;
  percentRepl?: number;
  mntlyContrib?: number;
  oneTimeReplacement?: boolean;
  comments?: string;
  remarks?: string;
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
    {
      id: "LIB-002",
      name: "Asphalt Shingle Roof",
      category: "roofing",
      usefulLife: 25,
      placedInService: "2024-01-15",
      quantity: 1,
      currentCost: 45000,
      accumReserves: 10000
    },
    {
      id: "LIB-003",
      name: "Tennis Court Surface",
      category: "amenities",
      usefulLife: 15,
      placedInService: "2024-02-01",
      quantity: 2,
      currentCost: 25000,
      accumReserves: 8000
    },
    {
      id: "LIB-004",
      name: "Exterior Paint",
      category: "building",
      usefulLife: 10,
      placedInService: "2024-01-20",
      quantity: 1,
      currentCost: 35000,
      accumReserves: 15000
    },
    {
      id: "LIB-005",
      name: "Irrigation System",
      category: "landscape",
      usefulLife: 12,
      placedInService: "2024-02-10",
      quantity: 1,
      currentCost: 18000,
      accumReserves: 6000
    },
    {
      id: "LIB-006",
      name: "Clubhouse HVAC",
      category: "building",
      usefulLife: 15,
      placedInService: "2024-01-25",
      quantity: 2,
      currentCost: 22000,
      accumReserves: 7500
    },
    {
      id: "LIB-007",
      name: "Perimeter Fencing",
      category: "building",
      usefulLife: 20,
      placedInService: "2024-02-05",
      quantity: 1,
      currentCost: 28000,
      accumReserves: 9000
    }
  ];

  const getRandomImage = (category: string) => {
    const categories: Record<string, string> = {
      amenities: "swimming+pool+equipment",
      roofing: "house+roof",
      building: "building+exterior",
      landscape: "landscape+design"
    };
    return `https://source.unsplash.com/featured/800x600/?${categories[category] || category}`;
  };

  const getRandomImage = (category: string) => {
    const categories = {
      amenities: "swimming+pool+equipment",
      roofing: "roof",
      building: "building+exterior",
      landscape: "landscape+architecture"
    };
    return `https://source.unsplash.com/random/400x300/?${categories[category as keyof typeof categories] || category}`;
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {mockComponents.map((component) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-[4/3]">
                      <img 
                        src={getRandomImage(component.category)}
                        alt={component.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-600">
                        {component.id}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-1">{component.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{component.category}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-5xl">
          <DialogHeader className="border-b pb-4">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">Asphalt Shingle Roof</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowDialog(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-12 gap-6 py-4">
            {/* Left Column - Image Uploads */}
            <div className="col-span-4 space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload image {index}</p>
                </div>
              ))}
            </div>

            {/* Right Column - Form Fields */}
            <div className="col-span-8 space-y-6">
              {/* First Row */}
              <div className="grid grid-cols-3 gap-4">
                <Input 
                  placeholder="Asset ID"
                  value="LIB-001"
                  onChange={(e) => setNewComponent({...newComponent, id: e.target.value})}
                />
                <Input 
                  placeholder="Group/Facility"
                  onChange={(e) => setNewComponent({...newComponent, group: e.target.value})}
                />
                <Select 
                  value={newComponent.category}
                  onValueChange={(value) => setNewComponent({...newComponent, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roofing">Roofing</SelectItem>
                    <SelectItem value="amenities">Amenities</SelectItem>
                    <SelectItem value="building">Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-3 gap-4">
                <Input 
                  type="date"
                  value="2025-01-04"
                  onChange={(e) => setNewComponent({...newComponent, placedInService: e.target.value})}
                />
                <Input 
                  type="number"
                  placeholder="Useful Life"
                  value="25"
                  onChange={(e) => setNewComponent({...newComponent, usefulLife: Number(e.target.value)})}
                />
                <Input 
                  type="number"
                  placeholder="Adjustment"
                  value="0"
                  onChange={(e) => setNewComponent({...newComponent, adjustment: Number(e.target.value)})}
                />
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-3 gap-4">
                <Input 
                  type="number"
                  placeholder="Quantity/Unit"
                  value="0"
                  onChange={(e) => setNewComponent({...newComponent, quantity: Number(e.target.value)})}
                />
                <Input 
                  type="number"
                  placeholder="Unit Cost"
                  value="0"
                  onChange={(e) => setNewComponent({...newComponent, unitCost: Number(e.target.value)})}
                />
                <Input 
                  type="number"
                  placeholder="Percent Repl"
                  value="100"
                  onChange={(e) => setNewComponent({...newComponent, percentRepl: Number(e.target.value)})}
                />
              </div>

              {/* Fourth Row */}
              <div className="grid grid-cols-3 gap-4">
                <Input 
                  type="number"
                  placeholder="Current Cost"
                  value="0"
                  onChange={(e) => setNewComponent({...newComponent, currentCost: Number(e.target.value)})}
                />
                <Input 
                  type="number"
                  placeholder="Accum Reserves"
                  value="0"
                  onChange={(e) => setNewComponent({...newComponent, accumReserves: Number(e.target.value)})}
                />
                <Input 
                  type="number"
                  placeholder="Mntly Contrbtn"
                  value="0"
                  onChange={(e) => setNewComponent({...newComponent, mntlyContrib: Number(e.target.value)})}
                />
              </div>

              {/* Additional Fields */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="oneTime"
                    checked={newComponent.oneTimeReplacement}
                    onCheckedChange={(checked) => setNewComponent({...newComponent, oneTimeReplacement: !!checked})}
                  />
                  <label htmlFor="oneTime" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    One Time Replacement
                  </label>
                </div>
                
                <Textarea
                  placeholder="Comments"
                  value={newComponent.comments || ''}
                  onChange={(e) => setNewComponent({...newComponent, comments: e.target.value})}
                  className="min-h-[80px]"
                />
                
                <Textarea
                  placeholder="Remarks"
                  value={newComponent.remarks || ''}
                  onChange={(e) => setNewComponent({...newComponent, remarks: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowDialog(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
