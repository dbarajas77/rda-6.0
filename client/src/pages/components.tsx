import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import { useLocation } from "wouter";

interface Component {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description?: string;
}

export default function Components() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  // Fetch components
  const { data: components = [], isLoading } = useQuery<Component[]>({
    queryKey: ['components'],
    queryFn: async () => {
      const response = await fetch('/api/components');
      if (!response.ok) throw new Error('Failed to fetch components');
      return response.json();
    }
  });

  // Filter components based on search
  const filteredComponents = components.filter((component) => {
    return component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           component.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-cover bg-center relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3")',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* White overlay with blur */}
      <div className="fixed inset-0 bg-white/58 backdrop-blur-[2px] z-10" />

      {/* Content */}
      <div className="relative z-20 p-[100px]">
        <Card className="shadow-2xl bg-white/58 backdrop-blur-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Components</h1>
              <Button
                onClick={() => setLocation('/components/new')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Component
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 shadow-lg focus:shadow-xl transition-shadow duration-300"
                />
              </div>
              <Button variant="outline" className="shadow-lg hover:shadow-xl">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredComponents.map((component, index) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Card 
                    className="h-full bg-white/90 hover:shadow-lg transition-all duration-300 
                              cursor-pointer border-gray-200 overflow-hidden"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={component.imageUrl}
                        alt={component.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm truncate">{component.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {component.category}
                        </p>
                      </div>
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