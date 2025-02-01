import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import {
  FileText, Upload, Filter, Search,
  FileIcon, Book, CheckSquare, Users,
  File, Receipt, Download, X, Share2
} from "lucide-react";
import AnnotationLayer from "@/components/document/annotation-layer";

// Document category definitions with colors
const categories = [
  { id: 'bylaws', label: 'Bylaws', icon: FileIcon, color: 'text-blue-500' },
  { id: 'minutes', label: 'Minutes', icon: Book, color: 'text-green-500' },
  { id: 'financial', label: 'Financial', icon: Receipt, color: 'text-purple-500' },
  { id: 'forms', label: 'Forms', icon: FileText, color: 'text-orange-500' }
];

interface Permission {
  userId: string;
  email: string;
  access: 'view' | 'edit' | 'admin';
}

interface Document {
  id: string;
  name: string;
  description?: string;
  category: string;
  createdAt: string;
  size: string;
  url?: string;
  ownerId: string;
  permissions: Permission[];
}

export default function DocumentCenter() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareAccess, setShareAccess] = useState<"view" | "edit" | "admin">("view");
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [, setLocation] = useLocation();

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

  const handleShare = async () => {
    if (!selectedDocument || !shareEmail) return;
    try {
      console.log('Sharing document', selectedDocument.id, 'with', shareEmail, 'access:', shareAccess);
      setShowShareDialog(false);
      setShareEmail("");
      setShareAccess("view");
    } catch (error) {
      console.error('Share error:', error);
    }
  };

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

  const downloadSelectedDocuments = async () => {
    try {
      for (const docId of selectedDocuments) {
        const doc = documents.find(d => d.id === docId);
        if (doc?.url) {
          const response = await fetch(`/api/documents/${docId}/download`);
          if (!response.ok) throw new Error('Download failed');
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = doc.name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const toggleDocumentSelection = (docId: string) => {
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(docId)) {
      newSelection.delete(docId);
    } else {
      newSelection.add(docId);
    }
    setSelectedDocuments(newSelection);
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3")',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 bg-white/58 backdrop-blur-[2px] z-10" />
      <div className="relative z-20 p-[100px]">
        <Card className="shadow-2xl bg-white/58 backdrop-blur-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Document Management</h1>
              <div className="flex gap-3">
                <Button
                  onClick={() => setLocation('/dashboard')}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Dashboard
                </Button>
                {selectedDocuments.size > 0 && (
                  <Button
                    onClick={downloadSelectedDocuments}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Selected ({selectedDocuments.size})
                  </Button>
                )}
              </div>
            </div>

            {/* Search and Upload */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 shadow-lg focus:shadow-xl transition-shadow duration-300"
                />
              </div>
              <Button onClick={() => document.getElementById('fileUpload')?.click()} className="shadow-lg hover:shadow-xl">
                <Upload className="w-4 h-4 mr-2" />
                Add Document
                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </Button>
              <Button variant="outline" className="shadow-lg hover:shadow-xl">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Document Categories */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="mb-6 shadow-md">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDocuments.map((doc: Document) => {
                  const category = categories.find(c => c.id === doc.category);
                  const cardColors = {
                    bylaws: {
                      color: "text-blue-600",
                      bgColor: "bg-blue-50/40",
                      borderColor: "border-blue-200",
                      shadowColor: "shadow-blue-200/50"
                    },
                    minutes: {
                      color: "text-green-600",
                      bgColor: "bg-green-50/40",
                      borderColor: "border-green-200",
                      shadowColor: "shadow-green-200/50"
                    },
                    financial: {
                      color: "text-purple-600",
                      bgColor: "bg-purple-50/40",
                      borderColor: "border-purple-200",
                      shadowColor: "shadow-purple-200/50"
                    },
                    forms: {
                      color: "text-orange-600",
                      bgColor: "bg-orange-50/40",
                      borderColor: "border-orange-200",
                      shadowColor: "shadow-orange-200/50"
                    }
                  };
                  const colors = cardColors[doc.category as keyof typeof cardColors] || cardColors.bylaws;

                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: parseInt(doc.id) * 0.1 }}
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative"
                    >
                      <Card
                        className={`h-full cursor-pointer transition-all duration-300
                          ${colors.bgColor} hover:${colors.shadowColor}
                          ${colors.borderColor} shadow-lg hover:shadow-xl
                          backdrop-blur-sm hover:bg-white/50
                          ${selectedDocuments.has(doc.id) ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => {
                          setSelectedDocument(doc);
                          setShowPreview(true);
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          className="absolute top-4 right-4 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDocumentSelection(doc.id);
                          }}
                        >
                          <Checkbox
                            checked={selectedDocuments.has(doc.id)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        </div>

                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`p-3 rounded-full bg-white/90 ${colors.color}`}>
                              {category?.icon && <category.icon className="h-6 w-6" />}
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-medium text-lg">{doc.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {doc.description || category?.label}
                              </p>
                              <div className="flex items-center justify-center text-xs text-muted-foreground space-x-2">
                                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{doc.size}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </Tabs>
          </div>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl min-h-[80vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
          </DialogHeader>
          <div className="relative flex-1 h-[calc(80vh-4rem)] overflow-hidden">
            {selectedDocument?.url ? (
              <div className="relative h-full">
                <iframe
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/documents/${selectedDocument.url}`}
                  className="absolute inset-0 w-full h-full"
                  title={selectedDocument.name}
                  style={{ border: 'none' }}
                />
                <AnnotationLayer documentId={parseInt(selectedDocument.id)} />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Preview not available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-gradient-to-br from-white to-blue-50">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Share "{selectedDocument?.name}" with others
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="shadow-md focus:shadow-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Access Level</label>
              <select
                className="w-full p-2 rounded-md border shadow-md focus:shadow-xl"
                value={shareAccess}
                onChange={(e) => setShareAccess(e.target.value as "view" | "edit" | "admin")}
              >
                <option value="view">View</option>
                <option value="edit">Edit</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowShareDialog(false)} className="shadow-lg hover:shadow-xl">
              Cancel
            </Button>
            <Button onClick={handleShare} className="shadow-lg hover:shadow-xl">
              Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}