import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useComponents } from "@/hooks/useComponents";

interface Component {
  id: string;
  name: string;
  category: string;
  useful_life: number;
  current_cost: number;
  image_url?: string;
}

const getRandomImage = (category: string) => {
  const categories: Record<string, string> = {
    amenities: "community+pool",
    roofing: "modern+roof",
    building: "modern+building+facade",
    landscape: "garden+landscape"
  };
  const defaultQuery = "building+exterior";
  const searchQuery = categories[category] || defaultQuery;
  return `https://source.unsplash.com/featured/800x600/?${searchQuery}`;
};

export default function DatabaseManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [newComponent, setNewComponent] = useState<Partial<Component>>({});
  const [, setLocation] = useLocation();
  const { data: components = [], isLoading } = useComponents();

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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {/* Add Component Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="group relative overflow-hidden w-[275px] h-[275px] cursor-pointer"
                  variant="glass"
                  hover={true}
                  onClick={() => setShowDialog(true)}
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

              {/* Component Cards */}
              {components.map((component) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="group relative overflow-hidden w-[275px] h-[275px]"
                    variant="glass"
                    hover={true}
                  >
                    <div className="h-3/4 relative">
                      <img 
                        src={component.image_url || getRandomImage(component.category)}
                        alt={component.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-600">
                        {component.asset_id}
                      </div>
                    </div>
                    <div className="h-1/4 p-2 bg-white/80 backdrop-blur-sm flex flex-col">
                      <h3 className="font-medium text-sm mb-1 line-clamp-1">{component.component_name}</h3>
                      <p className="text-xs text-gray-600 capitalize">{component.category}</p>
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
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">Add New Component</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowDialog(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-col space-y-6 p-4">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((index) => (
                <div 
                  key={index} 
                  className="aspect-square border-2 border-dashed rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer relative group"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Upload Image {index}</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Component Name</label>
                <Input 
                  placeholder="Enter component name"
                  value={newComponent.name || ''}
                  onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
                  className="border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <Textarea 
                  placeholder="Enter component description"
                  value={newComponent.description || ''}
                  onChange={(e) => setNewComponent({...newComponent, description: e.target.value})}
                  className="min-h-[100px] border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

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
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>

              <Input 
                type="number"
                placeholder="Useful Life (years)"
                value={newComponent.useful_life || ''}
                onChange={(e) => setNewComponent({...newComponent, useful_life: Number(e.target.value)})}
              />

              <Input 
                type="number"
                placeholder="Current Cost"
                value={newComponent.current_cost || ''}
                onChange={(e) => setNewComponent({...newComponent, current_cost: Number(e.target.value)})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowDialog(false)}>Save Component</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}