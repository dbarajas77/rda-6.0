import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Component } from "@/hooks/useComponents"
import { Skeleton } from "@/components/ui/skeleton"
import { useComponents } from "@/hooks/useComponents"

interface ComponentCardProps {
  component: Component
}

export function ComponentCard({ component }: ComponentCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        {component.image_url ? (
          <img 
            src={component.image_url} 
            alt={component.component_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video">
              <Skeleton className="w-full h-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading components: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {components?.map((component) => (
        <ComponentCard key={component.asset_id} component={component} />
      ))}
    </div>
  )
}