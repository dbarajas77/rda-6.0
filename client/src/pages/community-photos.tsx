import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Upload, Plus } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  createdAt: string;
  category: 'general' | 'maintenance' | 'issue';
  notes?: string[];
}

const mockPhotos: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    title: "Community Pool",
    description: "Recent renovation of the community pool area",
    createdAt: "2024-01-15",
    category: 'general',
    notes: ["New tiles installed", "Water treatment system upgraded"]
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    title: "Playground Equipment",
    description: "Monthly safety inspection",
    createdAt: "2024-01-20",
    category: 'maintenance',
    notes: ["All equipment in good condition", "Minor rust on swing set - scheduled for treatment"]
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1600607687644-4e2a09cf159d",
    title: "Drainage Issue",
    description: "Water accumulation after recent rain",
    createdAt: "2024-01-25",
    category: 'issue',
    notes: ["Standing water near building A", "Requires immediate attention"]
  }
];

export default function CommunityPhotos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newNote, setNewNote] = useState("");

  // Mock query for photos
  const { data: photos = mockPhotos, isLoading } = useQuery<Photo[]>({
    queryKey: ['community-photos'],
    queryFn: async () => {
      // In real implementation, fetch from API
      return mockPhotos;
    }
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock upload logic
    console.log('Uploading photo:', file.name);
    setShowUploadDialog(false);
  };

  const handleAddNote = (photoId: string) => {
    if (!newNote.trim()) return;
    // Mock adding note
    console.log('Adding note to photo:', photoId, newNote);
    setNewNote("");
  };

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Community Photos</h1>
          <Button onClick={() => setShowUploadDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Photo
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg">{photo.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{photo.description}</p>
                  <div className="mt-2 space-y-1">
                    {photo.notes?.map((note, index) => (
                      <div key={index} className="text-sm bg-muted p-2 rounded-md">
                        {note}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Input
                      placeholder="Add a note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNote(photo.id)}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Photo</DialogTitle>
              <DialogDescription>
                Add a new photo to document community areas or maintenance issues
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="Enter photo title" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Enter photo description" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select className="w-full p-2 rounded-md border">
                  <option value="general">General</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="issue">Issue</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowUploadDialog(false)}>
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
