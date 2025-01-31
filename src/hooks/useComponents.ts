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
      const { data: components, error } = await supabase
        .from('database')
        .select('asset_id, component_name, category')

      if (error) throw error

      // Get public URLs for all images
      const componentsWithImages = components?.map((component) => {
        const { data: imageUrl } = supabase
          .storage
          .from('database_images')
          .getPublicUrl(`${component.asset_id}.jpg`)

        return {
          ...component,
          image_url: imageUrl?.publicUrl
        }
      }) || []

      return componentsWithImages
    }
  })
}