import { useState } from 'react';
import { Box, Flex, FormControl, Input, Text, Button, Image, Textarea } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { IoCloudUploadOutline } from "react-icons/io5";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/utils/supabase/client';

type FormData = {
  [key: string]: string;
  artist_name: string;
  f_name: string;
  l_name: string;
  website: string;
  facebook_url: string;
  instagram_url: string;
  biography: string;
  avatar_url: string;
  banner_url: string;
};

const ArtistProfileModal = () => {
  const [formData, setFormData] = useState<FormData>({
    artist_name: '', f_name: '', l_name: '', website: '',
    facebook_url: '', instagram_url: '', biography: '', avatar_url: '', banner_url: ''
  });
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string>('');

  const router = useRouter();
  const supabase = createClient();

  const compressImage = async (file: File) => {
    const options = { maxSizeMB: 1 };
    try {
      console.log('Compressing image...');
      return await imageCompression(file, options);
    } catch (compressionError) {
      console.error('Compression Error:', compressionError);
      setError('Failed to compress image.');
      throw compressionError;
    }
  };

  const handleFileUpload = async (field: keyof FormData, files: FileList | null) => {
    if (!files || files.length === 0) { setError('No file selected.');
      return;
    }
    setLoading(prev => ({ ...prev, [field]: true }));
    let file;
    try { file = await compressImage(files[0]);
    } catch { setLoading(prev => ({ ...prev, [field]: false }));
      return;
    }
    const filename = `${uuidv4()}.${file.name.split('.').pop()}`;
    const { error: uploadError, data } = await supabase.storage.from('profiles').upload(`${field}/${filename}`, file);
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      setError('Failed to upload image.');
      setLoading(prev => ({ ...prev, [field]: false }));
      return;
    }
    const { data: publicURL, error: urlError } = await supabase.storage.from('profiles').createSignedUrl(`${field}/${filename}`, 3153600000);
    if (urlError) {
      console.error('Error creating signed URL:', urlError);
      setError('Failed to generate image URL.');
      await supabase.storage.from('profiles').remove([`${field}/${filename}`]);
    } else { setFormData(prev => ({ ...prev, [`${field}Url`]: publicURL?.signedUrl ?? prev[`${field}Url`] })); }
    setLoading(prev => ({ ...prev, [field]: false }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(prev => ({ ...prev, form: true }));
    const { data, error: insertError } = await supabase.from('profiles').insert([formData]).single();
    if (insertError) {
      console.error('Error creating profile:', insertError);
      setError('Failed to create profile.');
    } else {
      router.push('/');
    }
    setLoading(prev => ({ ...prev, form: false }));
  };

  return (
    <Box className="flex justify-center w-full p-8">
      <Box className="w-1/2 min-w-96">
        <Text className="mb-4 text-lg font-bold">Create your Artist Profile</Text>
        <Box className="relative">
          {/* Image upload interface for banner */}
          <Box className={`z-0 flex justify-center w-full overflow-hidden border-4 border-dotted shadow-md cursor-pointer border-bgLight aspect-video h-1/2 rounded-b-xl ${loading.banner ? 'bg-gray-300' : ''}`}
                onMouseDown={() => document.getElementById('bannerInput')!.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFileUpload('banner', e.dataTransfer.files); }}>
            {formData.bannerUrl ? <Image src={formData.bannerUrl} /> : 'Drop or Click to Upload Banner Image'}
            <input id="bannerInput" type="file" className="hidden" onChange={(e) => handleFileUpload('banner', e.target.files)} />
          </Box>
          {/* Image upload interface for avatar */}
          <Flex className="justify-center w-full mt-4">
          <Box className={` flex items-center justify-center w-40 overflow-hidden bg-black border-4 border-dotted rounded-full shadow-md cursor-pointer border-bgLight aspect-square ${loading.avatar ? 'bg-gray-300' : ''}`}
                onMouseDown={() => document.getElementById('avatarInput')!.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFileUpload('avatar', e.dataTransfer.files); }}>
            {formData.avatarUrl ? <Image src={formData.avatarUrl} /> : <IoCloudUploadOutline className="text-3xl" />}
            <input id="avatarInput" type="file" className="hidden" onChange={(e) => handleFileUpload('avatar', e.target.files)} />
          </Box>
          </Flex>
        </Box>
        {/* Fields for profile information */}
        {['artist_name', 'f_name', 'l_name', 'website', 'facebook_url', 'instagram_url', 'biography'].map(field => (
          <FormControl className="mt-4" key={field}>
            <Input name={field} value={formData[field]} onChange={handleChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/Url$/, '')} />
          </FormControl>
        ))}
        <Button className="mt-4" colorScheme="orange" mr={3} onMouseDown={handleSubmit} isLoading={loading.form}>Create Profile</Button>
        {error && <Text color="red.500">{error}</Text>}
      </Box>
    </Box>
  );
};

export default ArtistProfileModal;
