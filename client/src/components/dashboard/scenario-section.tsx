import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Scenario } from "@db/schema";

export default function ScenarioSection() {
  const { data: scenarios = [], isLoading } = useQuery<Scenario[]>({
    queryKey: ["/api/scenarios"],
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-[400px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Saved Scenarios</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Scenario
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading...</div>
            ) : scenarios.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No scenarios saved yet
              </div>
            ) : (
              scenarios.map((scenario) => (
                <Card key={scenario.id} className="hover:bg-secondary/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{scenario.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {scenario.description}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(scenario.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
