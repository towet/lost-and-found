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
  console.log('Fetching items...');
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching items:', error);
    throw new Error(error.message);
  }

  console.log('Items fetched:', data);
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

export const searchItems = async (query: string): Promise<Item[]> => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const deleteItem = async (itemId: string): Promise<void> => {
  console.log('Deleting item with ID:', itemId);
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId)
    .single(); 

  if (error) {
    console.error('Error deleting item:', error);
    throw new Error(error.message);
  }

  console.log('Item deleted successfully');
};

export const markAsRetrieved = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId);

  if (error) {
    throw new Error(error.message);
  }
};
