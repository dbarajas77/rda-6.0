import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Upload, Plus, MessageCircle, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

interface Photo {
  id: string;
  url: string;
  title: string;
  category: 'general' | 'maintenance' | 'issue' | 'landscape' | 'amenities';
  createdAt: string;
  notes?: string[];
}

const mockPhotos: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    title: "Community Pool",
    category: 'amenities',
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
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
    title: "Main Entrance",
    category: 'landscape',
    createdAt: "2024-01-28",
    notes: ["Spring flowers planted", "New lighting installed"]
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    title: "Clubhouse Exterior",
    category: 'general',
    createdAt: "2024-01-30",
    notes: ["Fresh paint completed", "New signage installed"]
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    title: "Tennis Courts",
    category: 'amenities',
    createdAt: "2024-02-01",
    notes: ["Resurfacing complete", "New nets installed"]
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1576941089067-2de3c901e126",
    title: "Walking Trail",
    category: 'landscape',
    createdAt: "2024-02-02",
    notes: ["Trail markers updated", "New benches installed"]
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    title: "Landscaping Update",
    category: 'maintenance',
    createdAt: "2024-02-03"
  }
];

export default function CommunityPhotos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newNote, setNewNote] = useState("");
  const [showEnlargedView, setShowEnlargedView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [, setLocation] = useLocation();

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
    console.log('Updated photos:', updatedPhotos);
  };

  const filteredPhotos = photos.filter(photo =>
    (selectedCategory === "all" || photo.category === selectedCategory) &&
    photo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cover bg-center relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3")',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 bg-white/58 backdrop-blur-[2px] z-10" />
      <div className="relative z-20 p-[100px]">
        <Card className="shadow-2xl bg-white/58 backdrop-blur-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Community Photos</h1>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setLocation('/dashboard')}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={() => setShowUploadDialog(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Photo
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search photos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 shadow-lg focus:shadow-xl transition-shadow duration-300"
                  />
                </div>
              </div>

              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="w-full justify-start shadow-md">
                  <TabsTrigger value="all">All Photos</TabsTrigger>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  <TabsTrigger value="issue">Issues</TabsTrigger>
                  <TabsTrigger value="landscape">Landscape</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                </TabsList>
              </Tabs>
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
                    className={`p-3 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1
                      ${photo.category === 'issue' ? 'hover:border-red-400' :
                        photo.category === 'maintenance' ? 'hover:border-yellow-400' :
                        'hover:border-blue-400'}`}
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
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-lg">
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
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="bg-gradient-to-br from-white to-blue-50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-700">Upload Photo</DialogTitle>
            <DialogDescription className="text-blue-600">
              Add a new photo to document community areas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors shadow-md hover:shadow-xl">
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                <p className="text-sm text-blue-700">Click to upload or drag and drop</p>
                <p className="text-xs text-blue-500 mt-1">PNG, JPG up to 10MB</p>
              </label>
            </div>
            <Input 
              placeholder="Enter photo title"
              className="border-blue-200 focus:border-blue-400 shadow-md focus:shadow-xl"
            />
            <select className="w-full p-2 rounded-md border border-blue-200 focus:border-blue-400 shadow-md focus:shadow-xl">
              <option value="general">General</option>
              <option value="maintenance">Maintenance</option>
              <option value="issue">Issue</option>
              <option value="landscape">Landscape</option>
              <option value="amenities">Amenities</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => setShowUploadDialog(false)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
            >
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEnlargedView} onOpenChange={setShowEnlargedView}>
        <DialogContent className="max-w-2xl">
          {selectedPhoto && (
            <div className="space-y-6">
              <div className="aspect-video relative rounded-lg overflow-hidden shadow-xl">
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

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Notes</h3>
                <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2">
                  {selectedPhoto.notes?.map((note, index) => (
                    <div key={index} className="bg-muted p-3 rounded-md text-sm shadow-sm">
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
                    className="shadow-md focus:shadow-xl"
                  />
                  <Button onClick={handleAddNote} className="shadow-lg hover:shadow-xl">Add Note</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}