import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReportGenerator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Report Generated",
        description: "Your HOA reserve study report has been generated successfully.",
      });
      // In the future, we can handle downloading or viewing the report here
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate report",
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Report Generation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a comprehensive HOA reserve study report including financial analysis,
            recommendations, and projected maintenance schedules.
          </p>
          <Button
            onClick={() => generateReport.mutate()}
            disabled={generateReport.isPending}
            className="w-full"
          >
            {generateReport.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
