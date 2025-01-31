import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export interface Component {
  asset_id: number
  component_name: string
  category: string
  image_url?: string
}

export function useComponents() {
  return useQuery({
    queryKey: ['components'],
    queryFn: async (): Promise<Component[]> => {
      // Fetch components data from the 'database' table
      const { data: components, error: componentsError } = await supabase
        .from('database')
        .select('asset_id, component_name, category')
        .order('asset_id')

      if (componentsError) {
        throw new Error(`Error fetching components: ${componentsError.message}`)
      }

      // Get public URLs for all images
      const componentsWithImages = await Promise.all(
        components.map(async (component) => {
          const { data: imageUrl } = supabase
            .storage
            .from('database_images')
            .getPublicUrl(`${component.asset_id}.jpg`)

          return {
            ...component,
            image_url: imageUrl?.publicUrl
          }
        })
      )

      return componentsWithImages
    }
  })
}