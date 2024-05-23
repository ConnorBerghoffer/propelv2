'use client'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, Input, FormControl, FormLabel, Textarea, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { createClient, supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import AvatarUpload from '../upload/AvatarUpload';
import { CldImage } from 'next-cloudinary';
import Compressor from 'compressorjs';

const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const ArtistProfileModal = ({ isOpen, onClose }: any) => {
  const [artistName, setArtistName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [website, setWebsite] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [biography, setBiography] = useState('');

  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [bannerUrl, setBannerUrl] = useState<string>('');
  
  const router = useRouter();


  const compress = async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.2, // Set the quality of compression
        success(result) {
          return resolve(result);
        },
        error(err) {
          console.error('Compression Error:', err);
          reject(err);
        },
      });
    });
  };

  const handleAvatarUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = await compress(files[0]);
    const { data, error } = await supabase.storage.from('profiles').upload(`avatars/${file.name}`, file);
    if (error) {
      console.log('Error uploading', error);
      return;
    }
  
    const { publicURL, error: urlError } = await supabase.storage.from('profiles').createSignedUrl(`avatars/${file.name}`, 100 * 365 * 24 * 60 * 60);
    if (urlError) {
      console.log('Error creating signed URL', urlError);
      return;
    }
    setAvatarUrl(publicURL);
  };
  

  const handleBannerUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = await compress(files[0]);
    const { data, error } = await supabase.storage.from('profiles').upload(`banners/${file.name}`, file);
    if (error) {
      console.log('Error uploading', error);
      return;
    }
  
    const { publicURL, error: urlError } = await supabase.storage.from('profiles').createSignedUrl(`banners/${file.name}`, 100 * 365 * 24 * 60 * 60);
    if (urlError) {
      console.log('Error creating signed URL', urlError);
      return;
    }
    setBannerUrl(publicURL);
  };

  const handleSubmit = async () => {
    const supabase = createClient();
    const { data: session } = await supabase.auth.getSession();
    const user = session.session?.user;
    if (!user) { console.error('User is not authenticated'); return; }
  
    // Begin transaction to handle multiple operations
    const { data: userRecord, error: userError } = await supabase.from('users').insert([{ uuid: user.id, f_name: firstName, l_name: lastName }]).single();
    if (userError) { console.error('Error creating user:', userError);
      return;
    }

    const { data: permGroupType, error: permGroupTypeError } = await supabase.from('permission_groups').select('uuid').eq('name', 'Artist').single();
    if (permGroupTypeError) { console.error('Error creating user:', permGroupTypeError);
    return;
  }

    const { data: permissionsData, error: permissionsError } = await supabase.from('user_groups').insert([{ user_uuid: user.id, permission_group_uuid: permGroupType?.uuid}]).single();
    if (permissionsError) { console.error('Error setting permissions:', permissionsError);
      return;
    }
  
    // Insert into profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          banner_url: '', // You need to handle image uploads separately
          avatar_url: '', // You need to handle image uploads separately
          artist_name: artistName,
          website: website,
          facebook_url: facebookUrl,
          instagram_url: instagramUrl,
          biography: biography
        }
      ])
      .select('uuid').single();
  
    if (profileError) {
      console.error('Error creating profile:', profileError);
      return;
    }
    console.log('profile data', profileData)
    console.log('profile uuid', profileData.uuid)
    // Link user and permissions in user_groups
    const { data: userGroupsData, error: userGroupsError } = await supabase
      .from('user_profiles')
      .insert([
        { user_uuid: user.id, profile_uuid: profileData.uuid }
      ])
      .single();
  
    if (userGroupsError) {
      console.error('Error linking user and permissions:', userGroupsError);
      return;
    }

    router.push('/');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create your Artist Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
          <div className="flex items-center justify-center p-6 border-2 rounded-full cursor-pointer asepct-square border-bgLight"
              onClick={() => document.getElementById('fileInput')?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleAvatarUpload(e.dataTransfer.files); }}>
              {avatarUrl ? (
                <CldImage src={avatarUrl.replace(/^.*\/([^\/]*)$/, '$1')} width="500" height="500" crop={{ type: 'auto', source: true }} alt={''} />
              ) : ( 'Drop or Click to Upload Image' )}
              <input type="file" id="fileInput" className="hidden" onChange={(e) => handleAvatarUpload(e.target.files)} />
            </div>
          </FormControl>
          {/* <FormControl>
            <FormLabel>Artist Name</FormLabel>
            <Input value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Artist Name" />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>First Name</FormLabel>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Last Name</FormLabel>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Website</FormLabel>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL" />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Facebook Link</FormLabel>
            <Input value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="Facebook URL" />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Instagram Link</FormLabel>
            <Input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="Instagram URL" />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Biography</FormLabel>
            <Textarea value={biography} onChange={(e) => setBiography(e.target.value)} placeholder="Write your biography in Markdown" />
          </FormControl> */}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Create Profile
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ArtistProfileModal;
