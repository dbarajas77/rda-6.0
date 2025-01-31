
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Component {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

export default function DatabaseManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const queryClient = useQueryClient();

  // Fetch components
  const { data: components = [], isLoading } = useQuery<Component[]>({
    queryKey: ['components'],
    queryFn: async () => {
      const response = await fetch('/api/components');
      if (!response.ok) throw new Error('Failed to fetch components');
      return response.json();
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/components/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete component');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
    }
  });

  // Add component mutation
  const addMutation = useMutation({
    mutationFn: async (newComponent: Partial<Component>) => {
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComponent),
      });
      if (!response.ok) throw new Error('Failed to add component');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
    }
  });

  const categories = ["Building Components", "Interior Furn/Clubhouse", "All"];

  // Filter components based on search and category
  const filteredComponents = components.filter((component) => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative">
      <div className="fixed inset-0 bg-white/58 backdrop-blur-[2px] z-10" />

      <div className="relative z-20 p-6 md:p-[100px]">
        <Card className="shadow-2xl bg-white/58 backdrop-blur-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Component Library</h1>
              <div className="flex gap-3">
                <Button
                  onClick={() => addMutation.mutate({
                    name: "New Component",
                    category: "Building Components",
                    imageUrl: "/default-component.jpg"
                  })}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Component
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
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

            {/* Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredComponents.map((component) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(component.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="aspect-square relative">
                      <img
                        src={component.imageUrl}
                        alt={component.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium text-lg mb-1">{component.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">ID: {component.id}</p>
                      <p className="text-sm text-muted-foreground">{component.category}</p>
                    </CardContent>
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
