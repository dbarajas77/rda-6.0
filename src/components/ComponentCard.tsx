import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Component } from "@/hooks/useComponents"

interface ComponentCardProps {
  component: Component
}

export function ComponentCard({ component }: ComponentCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={component.image_url} 
          alt={component.component_name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{component.component_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Asset ID: {component.asset_id}
        </p>
        <p className="text-sm text-muted-foreground">
          Category: {component.category}
        </p>
      </CardContent>
    </Card>
  )
}

export function ComponentGrid() {
  const { data: components, isLoading, error } = useComponents()

  if (isLoading) {
    return <div>Loading components...</div>
  }

  if (error) {
    return <div>Error loading components: {error.message}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {components?.map((component) => (
        <ComponentCard key={component.asset_id} component={component} />
      ))}
    </div>
  )
}
