import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Component } from "@/hooks/useComponents"
import { Skeleton } from "@/components/ui/skeleton"
import { useComponents } from "@/hooks/useComponents"
import { useNavigate } from "wouter"

interface ComponentCardProps {
  component: Component
}

export function ComponentCard({ component }: ComponentCardProps) {
  const navigate = useNavigate()[1]

  return (
    <Card 
      className="overflow-hidden w-[275px] h-[275px] cursor-pointer transition-transform hover:scale-105"
      onClick={() => navigate("/database")}
    >
      <div className="h-[160px] overflow-hidden">
        {component.image_url && (
          <img 
            src={component.image_url} 
            alt={component.component_name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg truncate">{component.component_name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground truncate">
          Asset ID: {component.asset_id}
        </p>
        <p className="text-sm text-muted-foreground truncate">
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="w-[275px] h-[275px] overflow-hidden">
            <div className="h-[160px]">
              <Skeleton className="w-full h-full" />
            </div>
            <CardHeader className="p-4">
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
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
      <div className="p-6 text-center text-red-500">
        Error loading components: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {components?.map((component) => (
        <ComponentCard key={component.asset_id} component={component} />
      ))}
    </div>
  )
}