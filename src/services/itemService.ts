import { supabase } from '../lib/supabase';
import { Item } from '../types/item';

export const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('item-images')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error('Error uploading image');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('item-images')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const createItem = async (
  item: Omit<Item, 'id' | 'created_at'>,
  image?: File
): Promise<Item> => {
  let imageUrl = '';
  
  if (image) {
    imageUrl = await uploadImage(image);
  }

  const { data, error } = await supabase
    .from('items')
    .insert([
      {
        ...item,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getItems = async (): Promise<Item[]> => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const getItemsByType = async (type: 'lost' | 'found'): Promise<Item[]> => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};
