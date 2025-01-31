import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Upload, Filter, Search, 
  FileIcon, Book, CheckSquare, Users, 
  File, Receipt, Download 
} from "lucide-react";

// Document category definitions
const categories = [
  { id: 'insurance', label: 'Insurance', icon: CheckSquare },
  { id: 'bylaws', label: 'HOA Bylaws', icon: Book },
  { id: 'reports', label: 'Generated Reports', icon: FileText },
  { id: 'meetings', label: 'Meeting Minutes', icon: Users },
  { id: 'contracts', label: 'Vendor Contracts', icon: File },
  { id: 'invoices', label: 'Invoices', icon: Receipt }
];

interface Document {
  id: string;
  name: string;
  description?: string;
  category: string;
  createdAt: string;
  size: string;
}

export default function DocumentCenter() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);

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

      // Refetch documents after successful upload
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
      a.download = previewDocument?.name || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background with blue gradient */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#0A2463] via-[#3E92CC] to-[#0A2463] opacity-90" />

      {/* Animated gradient overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
          <div className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-to-br from-secondary/10 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-1/2 right-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-[100px] py-[100px]">
        <Card className="p-6 backdrop-blur-md bg-white/30">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Document Center</h1>
            <Button onClick={() => document.getElementById('fileUpload')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
              <input
                id="fileUpload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Document Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Documents Grid */}
            <TabsContent value={selectedCategory} className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc: Document) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Card 
                      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setPreviewDocument(doc)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{doc.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{doc.description}</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewDocument?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="aspect-[16/9] rounded-lg border bg-muted">
              {/* Document preview iframe or component will go here */}
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Document Preview
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPreviewDocument(null)}>
                Close
              </Button>
              <Button onClick={() => previewDocument && downloadDocument(previewDocument.id)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}