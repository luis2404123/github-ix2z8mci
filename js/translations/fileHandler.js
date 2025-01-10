import { supabase } from '../config/supabase.js';

export async function handleFileUpload(file, userId) {
  try {
    // Create folder structure: documents/userId/timestamp-filename
    const timestamp = Date.now();
    const filePath = `${userId}/${timestamp}-${file.name}`;
    
    // Upload file to documents bucket
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicUrl,
      name: file.name,
      error: null
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      path: null,
      url: null,
      name: null,
      error: error.message || 'Error uploading file'
    };
  }
}

export async function createDocumentRecord(userId, fileName, filePath) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        name: fileName,
        file_url: filePath
      })
      .select()
      .single();

    if (error) {
      console.error('Document record error:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating document record:', error);
    return { 
      data: null, 
      error: error.message || 'Error creating document record'
    };
  }
}