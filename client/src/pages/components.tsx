
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Component {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description?: string;
}

export default function Components() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [newComponent, setNewComponent] = useState<Partial<Component>>({});
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: components = mockComponents, isLoading } = useQuery<Component[]>({
    queryKey: ['components'],
    queryFn: async () => {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockComponents;
    }
  });

  const addMutation = useMutation({
    mutationFn: async (component: Partial<Component>) => {
      // API endpoint placeholder
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...component, id: String(Date.now()) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
      setShowDialog(false);
      setNewComponent({});
    }
  });

  const categories = ["Amenities", "Sports", "Building", "All"];

  const filteredComponents = components.filter((component) => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || component.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-cover bg-center relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa")' }}
      />
      <div className="fixed inset-0 bg-white/58 backdrop-blur-[2px] z-10" />

      <div className="relative z-20 p-6 md:p-[100px]">
        <Card className="shadow-2xl bg-white/58 backdrop-blur-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/dashboard')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <h1 className="text-2xl font-semibold">Component Library</h1>
              </div>
              <Button
                onClick={() => setShowDialog(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Component
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredComponents.map((component) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="h-[320px] group relative overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square relative">
                      <img
                        src={component.imageUrl}
                        alt={component.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium text-lg mb-1">{component.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {component.id}</p>
                      <p className="text-sm text-muted-foreground capitalize">{component.category}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Component</DialogTitle>
            <DialogDescription>Enter the details for the new component</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newComponent.name || ''}
                onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={newComponent.imageUrl || ''}
                onChange={(e) => setNewComponent({...newComponent, imageUrl: e.target.value})}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newComponent.description || ''}
                onChange={(e) => setNewComponent({...newComponent, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => addMutation.mutate(newComponent)}
              disabled={!newComponent.name || !newComponent.category}
            >
              Add Component
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const mockComponents: Component[] = [
  {
    id: "1",
    name: "Pool Equipment",
    category: "amenities",
    imageUrl: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd",
    description: "Main pool filtration system"
  },
  {
    id: "2", 
    name: "Tennis Court",
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8",
    description: "Community tennis facilities"
  },
  {
    id: "3",
    name: "Clubhouse Roof",
    category: "building",
    imageUrl: "https://images.unsplash.com/photo-1605146769289-440113cc3d00",
    description: "Main building roofing"
  },
  {
    id: "4",
    name: "Playground Equipment",
    category: "amenities",
    imageUrl: "https://images.unsplash.com/photo-1579704613784-9e71966e8595",
    description: "Children's play area"
  }
];
