import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type DatabaseComponent = {
  id: number;
  assetId: number;
  componentName: string;
  groupFacility: string;
  category: string;
  imageUrl: string;
  usefulLife: number;
  lifeRange: string;
  effectiveDate: string;
  resource: string;
  quantity: number;
  unit: string;
  salvage: number;
  unitCost: number;
  standard1: string | null;
  standard2: string | null;
  standard3: string | null;
  standard4: string | null;
  standard5: string | null;
  replacementPercentage: number;
  comments: string;
  remarks: string;
};

export default function DatabasePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<DatabaseComponent | null>(null);

  const { data: components = [], isLoading } = useQuery<DatabaseComponent[]>({
    queryKey: ['/api/database-components'],
    queryFn: async () => {
      const response = await fetch('/api/database-components');
      if (!response.ok) throw new Error('Failed to fetch components');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newComponent: Partial<DatabaseComponent>) => {
      const response = await fetch('/api/database-components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComponent),
      });
      if (!response.ok) throw new Error('Failed to create component');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/database-components'] });
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Component created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (component: DatabaseComponent) => {
      const response = await fetch(`/api/database-components/${component.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(component),
      });
      if (!response.ok) throw new Error('Failed to update component');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/database-components'] });
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Component updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/database-components/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete component');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/database-components'] });
      toast({
        title: "Success",
        description: "Component deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Database Components</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Component</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedComponent ? 'Edit Component' : 'Add New Component'}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const componentData = {
                  assetId: parseInt(formData.get('assetId') as string),
                  componentName: formData.get('componentName') as string,
                  groupFacility: formData.get('groupFacility') as string,
                  category: formData.get('category') as string,
                  // Add other fields as needed
                };
                
                if (selectedComponent) {
                  updateMutation.mutate({ ...selectedComponent, ...componentData });
                } else {
                  createMutation.mutate(componentData);
                }
              }}
              className="space-y-4"
            >
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="assetId">Asset ID</Label>
                  <Input
                    id="assetId"
                    name="assetId"
                    type="number"
                    defaultValue={selectedComponent?.assetId}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="componentName">Component Name</Label>
                  <Input
                    id="componentName"
                    name="componentName"
                    defaultValue={selectedComponent?.componentName}
                    required
                  />
                </div>
                {/* Add other form fields */}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedComponent ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset ID</TableHead>
              <TableHead>Component Name</TableHead>
              <TableHead>Group/Facility</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.map((component) => (
              <TableRow key={component.id}>
                <TableCell>{component.assetId}</TableCell>
                <TableCell>{component.componentName}</TableCell>
                <TableCell>{component.groupFacility}</TableCell>
                <TableCell>{component.category}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedComponent(component);
                        setIsOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this component?')) {
                          deleteMutation.mutate(component.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
