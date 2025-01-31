import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Upload, Plus, MessageCircle } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  title: string;
  category: 'general' | 'maintenance' | 'issue';
  createdAt: string;
  notes?: string[];
}

// Mock data with notes
const mockPhotos: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    title: "Community Pool",
    category: 'general',
    createdAt: "2024-01-15",
    notes: ["New tiles installed", "Water treatment system upgraded"]
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    title: "Playground Equipment",
    category: 'maintenance',
    createdAt: "2024-01-20",
    notes: ["All equipment in good condition", "Minor rust on swing set - scheduled for treatment"]
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1600607687644-4e2a09cf159d",
    title: "Drainage Issue",
    category: 'issue',
    createdAt: "2024-01-25",
    notes: ["Standing water near building A", "Requires immediate attention"]
  }
];

export default function CommunityPhotos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newNote, setNewNote] = useState("");
  const [showEnlargedView, setShowEnlargedView] = useState(false);

  // Mock query for photos
  const { data: photos = mockPhotos, isLoading } = useQuery<Photo[]>({
    queryKey: ['community-photos'],
    queryFn: async () => mockPhotos
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    console.log('Uploading photo:', file.name);
    setShowUploadDialog(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedPhoto) return;

    // Mock adding note
    const updatedPhotos = photos.map(photo => {
      if (photo.id === selectedPhoto.id) {
        return {
          ...photo,
          notes: [...(photo.notes || []), newNote]
        };
      }
      return photo;
    });

    setNewNote("");
    // In a real app, you would update this through an API
    console.log('Updated photos:', updatedPhotos);
  };

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-[100px]">
      <Card className="shadow-lg backdrop-blur-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Community Photos</h1>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Photo
            </Button>
          </div>

          {/* Search and Upload */}
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card 
                  className={`p-3 cursor-pointer transition-colors hover:bg-muted/50`}
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setShowEnlargedView(true);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1">
                        <MessageCircle className={`h-5 w-5 ${photo.notes?.length ? 'text-green-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2 mt-3">
                    <h3 className="font-medium truncate text-sm">{photo.title}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{photo.category}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogDescription>
              Add a new photo to document community areas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <Input placeholder="Enter photo title" />
            <select className="w-full p-2 rounded-md border">
              <option value="general">General</option>
              <option value="maintenance">Maintenance</option>
              <option value="issue">Issue</option>
            </select>
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

      {/* Enlarged View Dialog */}
      <Dialog open={showEnlargedView} onOpenChange={setShowEnlargedView}>
        <DialogContent className="max-w-2xl">
          {selectedPhoto && (
            <div className="space-y-6">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedPhoto.title}</h2>
                <p className="text-sm text-muted-foreground capitalize">{selectedPhoto.category}</p>
              </div>

              {/* Notes Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Notes</h3>
                <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2">
                  {selectedPhoto.notes?.map((note, index) => (
                    <div key={index} className="bg-muted p-3 rounded-md text-sm">
                      {note}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                  />
                  <Button onClick={handleAddNote}>Add Note</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}