import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Database } from "lucide-react";
import { useLocation } from "wouter";

interface TableInfo {
  id: string;
  name: string;
  description: string;
  recordCount: number;
  lastModified: string;
}

export default function DatabaseManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  // Fetch database tables info
  const { data: tables = [], isLoading } = useQuery<TableInfo[]>({
    queryKey: ['tables'],
    queryFn: async () => {
      const response = await fetch('/api/database/tables');
      if (!response.ok) throw new Error('Failed to fetch tables');
      return response.json();
    }
  });

  // Filter tables based on search
  const filteredTables = tables.filter((table) => {
    return table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           table.description.toLowerCase().includes(searchQuery.toLowerCase());
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
        <Card variant="dashboard">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Database Management</h1>
              <Button
                onClick={() => setLocation('/dashboard')}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Dashboard
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 shadow-lg focus:shadow-xl transition-shadow duration-300"
                />
              </div>
              <Button variant="outline" className="shadow-lg hover:shadow-xl">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTables.map((table, index) => (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    variant="glass"
                    hover
                    onClick={() => setLocation('/components')}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-3 rounded-full bg-white/90 text-blue-600">
                          <Database className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium text-lg">{table.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {table.description}
                          </p>
                          <div className="flex items-center justify-center text-xs text-muted-foreground space-x-2">
                            <span>{table.recordCount} records</span>
                            <span>•</span>
                            <span>Last modified: {new Date(table.lastModified).toLocaleDateString()}</span>
                          </div>
                        </div>
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