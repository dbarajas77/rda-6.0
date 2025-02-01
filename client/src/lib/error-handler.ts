
import { toast } from "@/hooks/use-toast";

export function handleError(error: unknown, fallbackMessage = "An error occurred") {
  const message = error instanceof Error ? error.message : fallbackMessage;
  
  toast({
    variant: "destructive",
    title: "Error",
    description: message
  });
  
  console.error("Error:", error);
}
