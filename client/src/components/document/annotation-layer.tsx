import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Plus, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Annotation {
  id: number;
  content: string;
  position: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  type: 'highlight' | 'comment' | 'drawing';
  metadata?: any;
  userId: number;
  createdAt: string;
  replies?: AnnotationReply[];
  user?: {
    username: string;
    fullName?: string;
  };
}

interface AnnotationReply {
  id: number;
  content: string;
  userId: number;
  createdAt: string;
  user?: {
    username: string;
    fullName?: string;
  };
}

interface Props {
  documentId: number;
}

export default function AnnotationLayer({ documentId }: Props) {
  const [newAnnotation, setNewAnnotation] = useState<Partial<Annotation> | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch annotations
  const { data: annotations = [], isLoading } = useQuery<Annotation[]>({
    queryKey: ['annotations', documentId],
    queryFn: async () => {
      const response = await fetch(`/api/documents/${documentId}/annotations`);
      if (!response.ok) throw new Error('Failed to fetch annotations');
      return response.json();
    }
  });

  // Add annotation mutation
  const addAnnotation = useMutation({
    mutationFn: async (annotation: Partial<Annotation>) => {
      const response = await fetch(`/api/documents/${documentId}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annotation)
      });
      if (!response.ok) throw new Error('Failed to create annotation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['annotations', documentId]);
      toast({
        title: "Annotation added",
        description: "Your annotation has been added successfully."
      });
    }
  });

  // Add reply mutation
  const addReply = useMutation({
    mutationFn: async ({ annotationId, content }: { annotationId: number; content: string }) => {
      const response = await fetch(`/api/annotations/${annotationId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (!response.ok) throw new Error('Failed to add reply');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['annotations', documentId]);
      setReplyContent("");
      toast({
        title: "Reply added",
        description: "Your reply has been added successfully."
      });
    }
  });

  // Delete annotation mutation
  const deleteAnnotation = useMutation({
    mutationFn: async (annotationId: number) => {
      const response = await fetch(`/api/annotations/${annotationId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete annotation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['annotations', documentId]);
      toast({
        title: "Annotation deleted",
        description: "The annotation has been removed."
      });
    }
  });

  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewAnnotation({
      position: { x, y },
      type: 'comment'
    });
  };

  return (
    <div className="relative h-full" onClick={handleDocumentClick}>
      {/* Existing annotations */}
      {annotations.map((annotation) => (
        <Popover key={annotation.id}>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute w-6 h-6 p-0 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
              style={{
                left: `${annotation.position.x}%`,
                top: `${annotation.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <span className="text-xs">{annotation.user?.username?.[0]?.toUpperCase()}</span>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{annotation.user?.fullName || annotation.user?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(annotation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-6 h-6"
                  onClick={() => deleteAnnotation.mutate(annotation.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm">{annotation.content}</p>

              {/* Replies */}
              {annotation.replies && annotation.replies.length > 0 && (
                <ScrollArea className="h-40">
                  <div className="space-y-4">
                    {annotation.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <Avatar className="w-6 h-6">
                          <span className="text-xs">{reply.user?.username?.[0]?.toUpperCase()}</span>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{reply.user?.fullName || reply.user?.username}</p>
                          <p className="text-sm">{reply.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {/* Add reply */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && replyContent) {
                      addReply.mutate({ annotationId: annotation.id, content: replyContent });
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={() => {
                    if (replyContent) {
                      addReply.mutate({ annotationId: annotation.id, content: replyContent });
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ))}

      {/* New annotation */}
      {newAnnotation && (
        <Popover open={true} onOpenChange={() => setNewAnnotation(null)}>
          <PopoverContent
            className="w-80"
            style={{
              position: 'absolute',
              left: `${newAnnotation.position?.x}%`,
              top: `${newAnnotation.position?.y}%`,
            }}
          >
            <div className="space-y-4">
              <Input
                placeholder="Add your annotation..."
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    addAnnotation.mutate({
                      ...newAnnotation,
                      content: e.currentTarget.value
                    });
                    setNewAnnotation(null);
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewAnnotation(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const input = document.querySelector('input') as HTMLInputElement;
                    if (input.value) {
                      addAnnotation.mutate({
                        ...newAnnotation,
                        content: input.value
                      });
                      setNewAnnotation(null);
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
