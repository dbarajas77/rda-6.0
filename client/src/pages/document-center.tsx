import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Upload, Filter, Search, 
  FileIcon, Book, CheckSquare, Users, 
  File, Receipt, Download, Printer 
} from "lucide-react";

// Document category definitions with colors
const categories = [
  { id: 'bylaws', label: 'Bylaws', icon: FileIcon, color: 'text-blue-500' },
  { id: 'minutes', label: 'Minutes', icon: Book, color: 'text-green-500' },
  { id: 'financial', label: 'Financial', icon: Receipt, color: 'text-purple-500' },
  { id: 'forms', label: 'Forms', icon: FileText, color: 'text-orange-500' }
];

interface Document {
  id: string;
  name: string;
  description?: string;
  category: string;
  createdAt: string;
  size: string;
  url?: string;
}

export default function DocumentCenter() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Fetch documents
  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await fetch('/api/documents');
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    }
  });

  // Filter documents based on category and search
  const filteredDocuments = documents.filter((doc: Document) => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', selectedCategory);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      window.location.reload();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const downloadDocument = async (docId: string) => {
    try {
      const response = await fetch(`/api/documents/${docId}/download`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedDocument?.name || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handlePrint = () => {
    if (selectedDocument?.url) {
      const printWindow = window.open(selectedDocument.url, '_blank');
      printWindow?.print();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Left Panel - Document List */}
        <div className="w-[400px] border-r p-6 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Document Management</h1>
          </div>

          {/* Search and Upload */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => document.getElementById('fileUpload')?.click()}>
              <Upload className="w-4 h-4" />
              <input
                id="fileUpload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Document Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Documents List */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {filteredDocuments.map((doc: Document) => {
                  const category = categories.find(c => c.id === doc.category);
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group"
                    >
                      <Card 
                        className={`p-3 cursor-pointer transition-colors ${
                          selectedDocument?.id === doc.id ? 'bg-muted' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-muted ${category?.color || 'text-foreground'}`}>
                            {category?.icon && <category.icon className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate text-sm">{doc.name}</h3>
                            <div className="mt-1 flex items-center text-xs text-muted-foreground">
                              <span className="truncate">{new Date(doc.createdAt).toLocaleDateString()}</span>
                              <span className="mx-2">•</span>
                              <span>{doc.size}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Tabs>
        </div>

        {/* Right Panel - Document Preview */}
        <div className="flex-1 p-6">
          {selectedDocument ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{selectedDocument.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Last modified {new Date(selectedDocument.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button onClick={() => selectedDocument && downloadDocument(selectedDocument.id)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Document Preview */}
              <div className="flex-1 rounded-lg border bg-card">
                {selectedDocument.url ? (
                  <iframe
                    src={selectedDocument.url}
                    className="w-full h-full rounded-lg"
                    title={selectedDocument.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Preview not available
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a document to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}