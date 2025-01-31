import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getOptimizedUnsplashUrl, preloadImages } from "@/lib/image-utils";

interface Component {
  id: string;
  name: string;
  category: string;
  group: string;
  placedInService: string;
  usefulLife: number;
  quantity: number;
  unitCost: number;
  currentCost: number;
  accumReserves: number;
  percentRepl: number;
  mntlyContrib: number;
  oneTimeReplacement: boolean;
  comments: string;
  remarks: string;
}

export default function Components() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [newComponent, setNewComponent] = useState<Partial<Component>>({});
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
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

  useEffect(() => {
    if (components.length > 0) {
      const imageUrls = components.map(component => 
        getOptimizedUnsplashUrl(component.category, 400, 400)
      );

      preloadImages(imageUrls)
        .then(() => setIsImagesLoaded(true))
        .catch(console.error);
    }
  }, [components]);

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

  return (
    <div className="min-h-screen bg-cover bg-center relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa")',
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
              {components.map((component) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isImagesLoaded ? 1 : 0, y: isImagesLoaded ? 0 : 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="h-[320px] group relative overflow-hidden"
                    variant="glass"
                    hover={true}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={getOptimizedUnsplashUrl(component.category, 400, 400)}
                        alt={component.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <CardContent className="p-4 bg-white/80 backdrop-blur-sm">
                      <h3 className="font-medium text-lg mb-2 line-clamp-1">{component.name}</h3>
                      <p className="text-sm text-muted-foreground">Category: {component.category}</p>
                      <p className="text-sm text-muted-foreground">ID: {component.id}</p>
                    </CardContent>
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