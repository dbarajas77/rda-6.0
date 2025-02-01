import { supabase } from '@/lib/supabaseClient';

export interface FieldNote {
  id?: number;
  asset_id: string;
  component_name: string;
  condition_id: 'new' | 'good' | 'poor' | 'critical';
  placed_in_service: string;
  notes: string;
  photo1_path?: string;
  photo2_path?: string;
  photo3_path?: string;
  created_at?: string;
}

export async function saveFieldNote(data: FieldNote, photos: string[]) {
  try {
    // Upload photos first
    const photoUrls = await Promise.all(
      photos.map(async (photo, index) => {
        if (!photo) return null;
        
        // Convert base64 to blob
        const base64Data = photo.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        const fileName = `${data.asset_id}_${Date.now()}_${index + 1}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('field_image')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase
          .storage
          .from('field_image')
          .getPublicUrl(fileName);

        return publicUrl;
      })
    );

    // Insert into field_notes table
    const { data: insertedData, error: insertError } = await supabase
      .from('field_notes')
      .insert({
        asset_id: data.asset_id,
        component_name: data.component_name,
        condition_id: data.condition_id,
        placed_in_service: data.placed_in_service,
        notes: data.notes,
        photo1_path: photoUrls[0] || null,
        photo2_path: photoUrls[1] || null,
        photo3_path: photoUrls[2] || null
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return insertedData;

  } catch (error) {
    console.error('Error saving field note:', error);
    throw error;
  }
}
