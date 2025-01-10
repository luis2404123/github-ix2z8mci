import { supabase } from '../config/supabase.js';

export function setupFileUploadPreview() {
  const fileInput = document.getElementById('document');
  const previewContainer = document.getElementById('file-preview');
  
  if (!fileInput || !previewContainer) return;

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    previewContainer.innerHTML = `
      <div class="file-info">
        <span class="material-symbols-outlined">description</span>
        <span>${file.name}</span>
        <small>(${(file.size / 1024).toFixed(2)} KB)</small>
      </div>
    `;
  });
}

export async function handleFileUpload(file, userId) {
  try {
    // Create folder path: documents/userId/timestamp-filename
    const filePath = `${userId}/${Date.now()}-${file.name}`;
    
    // Upload file to documents bucket
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

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