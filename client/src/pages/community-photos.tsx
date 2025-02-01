import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Upload, Plus, MessageCircle, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabaseClient";

interface Photo {
  id: string;
  url: string;
  title: string;
  category: 'general' | 'maintenance' | 'issue' | 'landscape' | 'amenities';
  created_at: string;
  notes?: string[];
}

export default function CommunityPhotos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newNote, setNewNote] = useState("");
  const [showEnlargedView, setShowEnlargedView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [, setLocation] = useLocation();

  const { data: photos = [], isLoading } = useQuery<Photo[]>({
    queryKey: ['community-photos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase
        .storage
        .from('community_photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase
        .storage
        .from('community_photos')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('community_photos')
        .insert({
          url: publicUrl,
          title: file.name,
          category: selectedCategory as Photo['category']
        });

      if (dbError) throw dbError;

      setShowUploadDialog(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedPhoto) return;

    try {
      const { error } = await supabase
        .from('photo_notes')
        .insert({
          photo_id: selectedPhoto.id,
          content: newNote
        });

      if (error) throw error;

      setNewNote("");
    } catch (error) {
      console.error('Error adding note:', error);
    }
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
      <div className="relative z-20 p-6 md:p-[100px]">
        <Card className="shadow-2xl bg-white/58 backdrop-blur-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 bg-white/50 px-4 py-2 rounded-lg shadow-sm">Community Photos</h1>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setLocation('/dashboard')}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Dashboard
                </Button>
                {process.env.NODE_ENV === 'development' && (
                  <Button 
                    onClick={() => {
                      const newPhoto = {
                        id: String(Date.now()),
                        url: "https://picsum.photos/800/600",
                        title: `Test Photo ${photos.length + 1}`,
                        category: ['general', 'maintenance', 'issue', 'landscape', 'amenities'][Math.floor(Math.random() * 5)] as any,
                        created_at: new Date().toISOString(),
                        notes: [`Test note ${Math.random()}`]
                      };
                      //setPhotos([...photos, newPhoto]); This line was removed
                    }}
                    variant="outline"
                  >
                    Add Test Photo
                  </Button>
                )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <Card 
                    className="group relative overflow-hidden h-[360px]"
                    variant="glass"
                    hover={true}
                    onClick={() => {
                      setSelectedPhoto(photo);
                      setShowEnlargedView(true);
                    }}
                  >
                    <div className="aspect-[4/3] w-full relative overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-lg">
                        <MessageCircle className={`h-5 w-5 ${photo.notes?.length ? 'text-green-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                    <div className="p-4 bg-white/80 backdrop-blur-sm">
                      <h3 className="font-medium text-lg mb-2 line-clamp-1">{photo.title}</h3>
                      <p className="text-sm text-muted-foreground capitalize mb-2">{photo.category}</p>
                      <div className="text-xs text-muted-foreground">
                        Added: {new Date(photo.created_at).toLocaleDateString()}
                      </div>
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
            <select 
              className="w-full p-2 rounded-md border border-blue-200 focus:border-blue-400 shadow-md focus:shadow-xl"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
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