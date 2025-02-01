import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
  component_name?: string; // Added to handle potential missing property
  asset_id?: string; // Added to handle potential missing property
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
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newComponent, setNewComponent] = useState<Partial<Component>>({});
  const [, setLocation] = useLocation();
  const { data: components = [], isLoading } = useComponents();

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.component_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.asset_id?.toString().includes(searchQuery);
    const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

      <div className="fixed inset-[100px] z-20">
        <Card className="shadow-2xl bg-white/58 backdrop-blur-md h-full relative">
          <div className="absolute inset-0 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
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

            <div className="flex items-center mb-6">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 h-12 text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-blue-400 rounded-xl shadow-lg transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'} 
                onClick={() => setSelectedCategory('all')}
                className="rounded-full"
              >
                All
              </Button>
              <Button
                variant={selectedCategory === 'roofing' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('roofing')}
                className="rounded-full bg-red-100 hover:bg-red-200 text-red-800 border-red-200"
              >
                Roofing
              </Button>
              <Button
                variant={selectedCategory === 'amenities' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('amenities')}
                className="rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200"
              >
                Amenities
              </Button>
              <Button
                variant={selectedCategory === 'building' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('building')}
                className="rounded-full bg-green-100 hover:bg-green-200 text-green-800 border-green-200"
              >
                Building
              </Button>
              <Button
                variant={selectedCategory === 'landscape' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('landscape')}
                className="rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200"
              >
                Landscape
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-4 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
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
              {filteredComponents.map((component) => (
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
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full w-fit
                        ${component.category === 'roofing' ? 'bg-red-100 text-red-800' :
                          component.category === 'amenities' ? 'bg-blue-100 text-blue-800' :
                          component.category === 'building' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {component.category}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm mx-auto h-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">Add New Component</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowDialog(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-col space-y-4 p-4">
            <div className="flex flex-col space-y-3">
              {[1, 2].map((index) => (
                <div 
                  key={index} 
                  className="h-32 border-2 border-dashed rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer relative group"
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