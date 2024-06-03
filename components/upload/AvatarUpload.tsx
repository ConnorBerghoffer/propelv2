// components/ImageUploader.tsx
import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { supabase } from '@/utils/supabase/client';

const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;


const AvatarUpload = () => {
  const [imageUrl, setImageUrl] = useState<string>('');

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            console.error('Cloudinary upload error:', data);
            throw new Error(`Cloudinary upload failed: ${data.error.message}`);
        }

        return data.secure_url;
    } catch (error) {
        console.error('Failed to upload image to Cloudinary:', error);
        throw error;
    }
};


  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileUrl = await uploadToCloudinary(files[0]);
    console.log(fileUrl)

  };

  return (
    <div className="flex items-center justify-center p-6 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer"
      onMouseDown={() => document.getElementById('fileInput')?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleUpload(e.dataTransfer.files);
      }}>
      {imageUrl ? (
        <CldImage src={imageUrl.replace(/^.*\/([^\/]*)$/, '$1')} width="500" height="500" crop={{ type: 'auto', source: true }} alt={''} />
      ) : (
        'Drop or Click to Upload Image'
      )}
      <input type="file" id="fileInput" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
    </div>
  );
};

export default AvatarUpload;
