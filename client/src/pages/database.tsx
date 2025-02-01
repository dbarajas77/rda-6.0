import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { useComponents } from "@/hooks/useComponents";

interface Component {
  id: string;
  name: string;
  category: string;
  useful_life: number;
  current_cost: number;
  image_url?: string;
  component_name?: string;
  asset_id?: string;
}

interface ComponentForm {
  condition: 'new' | 'average' | 'poor' | 'critical';
  placedInService: string;
  notes: string;
  customName: string;
}

export default function DatabaseManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const { data: components = [], isLoading } = useComponents();
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [formData, setFormData] = useState<ComponentForm>({
    condition: 'average',
    placedInService: '',
    notes: '',
    customName: ''
  });

  // Check if we came from the components page
  const isFromComponents = location.includes('from=components');

  const handleComponentClick = (component: Component) => {
    if (isFromComponents) {
      setSelectedComponent(component);
      setShowComponentForm(true);
    }
  };

  const handleAddToReport = () => {
    if (selectedComponent) {
      // Navigate back to components page with all the component data
      const queryParams = new URLSearchParams({
        selected: selectedComponent.asset_id || '',
        condition: formData.condition,
        placedInService: formData.placedInService,
        notes: formData.notes,
        customName: formData.customName || selectedComponent.name
      });
      setLocation(`/components?${queryParams.toString()}`);
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-800 bg-white/50 px-4 py-2 rounded-lg shadow-sm">
                {isFromComponents ? 'Select Component' : 'Component Library'}
              </h1>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-4 overflow-y-auto flex-grow">
              {!isFromComponents && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="group relative overflow-hidden w-[275px] h-[275px] cursor-pointer"
                    variant="glass"
                    hover={true}
                  >
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                      <Plus className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg mb-2">Add Component</h3>
                      <p className="text-sm text-muted-foreground">
                        Click to add a new component
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )}

              {filteredComponents.map((component) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className={`group relative overflow-hidden w-[275px] h-[275px] ${isFromComponents ? 'cursor-pointer' : ''}`}
                    variant="glass"
                    hover={true}
                    onClick={() => handleComponentClick(component)}
                  >
                    <div className="h-[160px] relative">
                      <img 
                        src={component.image_url || `https://source.unsplash.com/featured/800x600/?${component.category}`}
                        alt={component.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-600">
                        {component.asset_id}
                      </div>
                    </div>
                    <div className="h-[115px] p-4 bg-white/80 backdrop-blur-sm">
                      <h3 className="font-medium text-lg mb-2 line-clamp-1">{component.component_name}</h3>
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

      {/* Component Form Dialog */}
      <Dialog open={showComponentForm} onOpenChange={setShowComponentForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Component Details</DialogTitle>
            <DialogDescription>
              Add additional information about this component before adding it to your report.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Custom Name (Optional)</label>
              <Input
                placeholder="Enter a custom name for this component"
                value={formData.customName}
                onChange={(e) => setFormData({...formData, customName: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Condition</label>
              <Select
                value={formData.condition}
                onValueChange={(value: ComponentForm['condition']) => 
                  setFormData({...formData, condition: value})}
              >
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
            </div>

            <div>
              <label className="text-sm font-medium">Placed in Service</label>
              <Input
                type="date"
                value={formData.placedInService}
                onChange={(e) => setFormData({...formData, placedInService: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                placeholder="Add any additional notes about this component..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowComponentForm(false);
              setSelectedComponent(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddToReport}>Add to Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}