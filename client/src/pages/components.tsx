import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
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
  status: 'active' | 'maintenance' | 'replaced';
}

const mockComponents: Component[] = [
  {
    id: "COMP-001",
    name: "Swimming Pool Equipment",
    category: "amenities",
    description: "Main pool filtration and heating system",
    lastUpdated: "2024-01-15",
    status: 'active'
  },
  {
    id: "COMP-002",
    name: "Clubhouse HVAC",
    category: "building",
    description: "Central air conditioning system",
    lastUpdated: "2024-01-20",
    status: 'maintenance'
  },
  {
    id: "COMP-003",
    name: "Tennis Court Surface",
    category: "amenities",
    description: "Professional grade court surface",
    lastUpdated: "2024-01-25",
    status: 'active'
  },
  {
    id: "COMP-004",
    name: "Perimeter Fencing",
    category: "security",
    description: "Wrought iron security fencing",
    lastUpdated: "2024-01-30",
    status: 'active'
  },
  {
    id: "COMP-005",
    name: "Roof System",
    category: "building",
    description: "Main building roof structure",
    lastUpdated: "2024-02-01",
    status: 'maintenance'
  }
];

export default function Components() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: components = [], isLoading } = useQuery<Component[]>({
    queryKey: ['components'],
    queryFn: async () => {
      const response = await fetch('/api/components');
      if (!response.ok) throw new Error('Failed to fetch components');
      return response.json();
    }
  });

  const addMutation = useMutation({
    mutationFn: async (component: Partial<Component>) => {
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(component)
      });
      if (!response.ok) throw new Error('Failed to add component');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
      setShowDialog(false);
    }
  });

  const categories = ["Roofing", "Painting", "HVAC", "Plumbing", "Electrical", "All"];

  const handleSubmit = () => {
    addMutation.mutate(newComponent);
  };
  const [newComponent, setNewComponent] = useState<Partial<Component>>({});

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
              <h1 className="text-3xl font-bold text-gray-800 bg-white/50 px-4 py-2 rounded-lg shadow-sm">Components Library</h1>
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

            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {mockComponents.map((component) => (
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
                        <img
                          src={`https://source.unsplash.com/featured/800x600/?${component.category}`}
                          alt={component.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                          component.status === 'active' ? 'bg-green-500/90 text-white' :
                          component.status === 'maintenance' ? 'bg-yellow-500/90 text-white' :
                          'bg-red-500/90 text-white'
                        }`}>
                          {component.status}
                        </div>
                      </div>
                      <CardContent className="p-4 bg-white/80 backdrop-blur-sm">
                        <h3 className="font-medium text-lg mb-2 line-clamp-1">{component.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{component.description}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>ID: {component.id}</span>
                          <span>Updated: {new Date(component.lastUpdated).toLocaleDateString()}</span>
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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Component</DialogTitle>
            <DialogDescription>Enter the details for the new component</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
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
                {categories.filter(c => c !== 'All').map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input 
              type="date"
              placeholder="Placed in Service"
              value={newComponent.placedInService || ''}
              onChange={(e) => setNewComponent({...newComponent, placedInService: e.target.value})}
            />
            <Input 
              type="number"
              placeholder="Useful Life"
              value={newComponent.usefulLife || ''}
              onChange={(e) => setNewComponent({...newComponent, usefulLife: Number(e.target.value)})}
            />

            <Textarea
              placeholder="Comments"
              value={newComponent.comments || ''}
              onChange={(e) => setNewComponent({...newComponent, comments: e.target.value})}
              className="col-span-2"
            />
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