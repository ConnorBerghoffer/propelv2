import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, FormControl, FormLabel, Select, Switch, Textarea, Text, useToast, InputGroup, InputLeftAddon, Stack, Image, InputLeftElement, Box,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';
import imageCompression from 'browser-image-compression';
import { IoCloudUpload } from 'react-icons/io5';
import { BsCardHeading } from "react-icons/bs";

interface FormData {
  title: string;
  url: string;
  type: string;
  genre: string;
  tags: string[];
  description: string;
  artist: string;
  publisher: string;
  downloadable: boolean;
  album_title: string;
  release_date: string;
  is_public: boolean;
  artwork_url: string;
  audio_url?: string;
}

const TrackCreationModal = ({ isOpen, onClose }: any) => {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '', url: '', type: 'audio', genre: '', tags: [], description: '', artist: '', publisher: '', downloadable: false, album_title: '', release_date: new Date().toISOString().split('T')[0], is_public: true, artwork_url: ''
  });
  const [tagInput, setTagInput] = useState('');
  const toast = useToast();
  const supabase = createClient();
  const { user } = useAuth();

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      toast({ title: 'No file selected.', status: 'error', duration: 3000, isClosable: true, });
      return;
    }

    setLoading(true);
    const file = files[0];
    const filename = `${uuidv4()}.${file.name.split('.').pop()}`;

    try {
      const { error: uploadError, data } = await supabase.storage.from('tracks').upload(`tracks/${filename}`, file);
      if (uploadError) throw new Error(uploadError.message);
      const { data: publicURL, error: urlError } = await supabase.storage.from('tracks').createSignedUrl(`tracks/${filename}`, 3153600000);
      if (urlError) throw new Error(urlError.message);
      setAudioUrl(publicURL?.signedUrl ?? '');
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, status: 'error', duration: 3000, isClosable: true, });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      toast({ title: 'No file selected.', status: 'error', duration: 3000, isClosable: true, });
      return;
    }

    const file = files[0];
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920 };
    setLoading(true);

    try {
      const compressedFile = await imageCompression(file, options);
      const filename = `${uuidv4()}.${compressedFile.name.split('.').pop()}`;
      const { error: uploadError, data } = await supabase.storage.from('tracks').upload(`artwork/${filename}`, compressedFile);
      if (uploadError) throw new Error(uploadError.message);
      const { data: publicURL, error: urlError } = await supabase.storage.from('tracks').createSignedUrl(`artwork/${filename}`, 3153600000);
      if (urlError) throw new Error(urlError.message);
      setFormData(prev => ({ ...prev, artwork_url: publicURL?.signedUrl ?? prev.artwork_url }));
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, status: 'error', duration: 3000, isClosable: true, });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = tagInput;
      const tags = value.split('#').map(tag => tag.trim()).filter(tag => tag);
      setFormData(prev => ({ ...prev, tags: [...prev.tags, ...tags] }));
      setTagInput('');
    }
  };

  const handleSubmit = async () => {
    if (!audioUrl) {
      toast({ title: 'Please upload an audio file first.', status: 'warning', duration: 3000, isClosable: true, });
      return;
    }
    setLoading(true);

    // Prepare the data for the JSON column
    const { title, genre, tags, type } = formData;
    const data = {
      ...formData,
      audio_url: audioUrl,
      artwork_url: formData.artwork_url,
      url: formData.url,
      description: formData.description,
      artist: formData.artist,
      publisher: formData.publisher,
      downloadable: formData.downloadable,
      album_title: formData.album_title,
      release_date: formData.release_date,
      is_public: formData.is_public,
    };

    const postData = { title, genre, tags, type, posted_by: user?.id, data };

    try {
      const { data, error: insertError } = await supabase.from('posts').insert([postData]);
      if (insertError) throw new Error(insertError.message);
      toast({ title: 'Track created successfully!', status: 'success', duration: 3000, isClosable: true, });
      onClose();
    } catch (error: any) {
      toast({ title: 'Creation failed', description: error.message, status: 'error', duration: 3000, isClosable: true, });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal size={'xl'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Track</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Upload Audio File</FormLabel>
            <Box position="relative" display="inline-block">
              {!audioUrl ? <Button as="label" htmlFor="audio-upload" cursor="pointer" disabled={loading}>
                {loading ? 'Uploading...' : 'Choose File'}
              </Button> :
                <Box className="flex items-center justify-between w-full gap-4">
                  <Text className="overflow-hidden text-sm w-52 text-primary text-nowrap">{audioUrl}</Text>
                  <Button as="label" htmlFor="audio-upload" cursor="pointer" disabled={loading}>
                    {loading ? 'Uploading...' : 'Change Audio File'}
                  </Button>
                </Box>}
              <Input id="audio-upload" type="file" accept="audio/*" onChange={handleAudioUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', }} disabled={loading} />
            </Box>
          </FormControl>
          {audioUrl && (
            <>
              <FormControl mt={4} className="w-full ">
                <FormLabel>Artwork</FormLabel>
                <Box className="flex flex-col items-center justify-center w-full">
                  <Box position="relative" width="300px" height="300px" borderWidth="2px" borderRadius="md" borderColor="gray.300" display="flex" alignItems="center" justifyContent="center" overflow="hidden" cursor="pointer" onClick={() => document.getElementById('file-input')?.click()} _hover={{ borderColor: 'blue.500' }}>
                    {!formData.artwork_url && (
                      <Box textAlign="center" className="flex flex-col items-center justify-center ease-in-out opacity-50 cursor-pointer tranition hover:opacity-100">
                        <IoCloudUpload className="text-3xl" />
                        <Box mt={2} fontSize="sm">
                          Click to upload
                        </Box>
                      </Box>
                    )}
                    {formData.artwork_url && (<Image src={formData.artwork_url} alt="Artwork" objectFit="cover" width="100%" height="100%" />)}
                    <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={loading} />
                  </Box>
                </Box>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel size={'xs'} mb={-0.5} opacity={'50%'}>Title</FormLabel>
                <InputGroup variant='filled' size={'sm'}>
                  <InputLeftElement pointerEvents="none">
                    <BsCardHeading className="text-xs" />
                  </InputLeftElement>
                  <Input name="title" value={formData.title} onChange={handleChange} placeholder="My New Song" />
                </InputGroup>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel size={'xs'} mb={-0.5} opacity={'50%'}>URL</FormLabel>
                <InputGroup variant='filled' size={'sm'}>
                  <InputLeftAddon>https://propel.com/</InputLeftAddon>
                  <Input name="url" value={formData.url} onChange={handleChange} placeholder='mysongname' />
                </InputGroup>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel size={'xs'} mb={-0.5} opacity={'50%'}>Genre</FormLabel>
                <Select variant='filled' size={'sm'} name="genre" value={formData.genre} onChange={handleChange}>
                  <option value="drum and bass">Drum & Bass</option>
                  <option value="dubstep">Dubstep</option>
                  <option value="house">House</option>
                  <option value="psytrance">Psytrance</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel size={'xs'} mb={-0.5} opacity={'50%'}>Tags</FormLabel>
                <Input variant='filled' size={'sm'} value={tagInput} onChange={handleTagChange} placeholder="Add tags separated by # or enter" onKeyDown={handleTagKeyDown} />
                <Stack className="flex flex-wrap" direction="row" mt={2}>
                  {formData.tags.map((tag, index) => (
                    <Text key={index} bg="bgLight" px={2} py={1} borderRadius="md" className="text-xs">#{tag}</Text>
                  ))}
                </Stack>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel size={'xs'} mb={-0.5} opacity={'50%'}>Description</FormLabel>
                <Textarea variant='filled' size={'sm'} name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel size={'xs'} mb={-0.5} opacity={'50%'}>Artist</FormLabel>
                <Input variant='filled' size={'sm'} name="artist" value={formData.artist} onChange={handleChange} placeholder="Artist" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel size={'xs'} mb={-0.5} opacity={'50%'}>Publisher</FormLabel>
                <Input variant='filled' size={'sm'} name="publisher" value={formData.publisher} onChange={handleChange} placeholder="Publisher" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel size={'xs'} mb={-0.5} opacity={'50%'}>Album Title</FormLabel>
                <Input variant='filled' size={'sm'} name="album_title" value={formData.album_title} onChange={handleChange} placeholder="Album Title" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel size={'xs'} mb={-0.5} opacity={'50%'}>Release Date</FormLabel>
                <Input variant='filled' size={'sm'} name="release_date" type="date" value={formData.release_date} onChange={handleChange} />
              </FormControl>
              <FormControl mt={4} display="flex" alignItems="center" justifyContent={'space-between'}>
                <FormLabel size={'xs'} mb={-0.5}>Downloadable?</FormLabel>
                <Switch colorScheme='red' size={'sm'} name="downloadable" isChecked={formData.downloadable} onChange={(e) => setFormData(prev => ({ ...prev, downloadable: e.target.checked }))} />
              </FormControl>
              <FormControl mt={4} display="flex" alignItems="center" justifyContent={'space-between'}>
                <FormLabel size={'xs'} mb={-0.5}>Public</FormLabel>
                <Switch colorScheme='orange' size={'sm'} name="is_public" isChecked={formData.is_public} onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))} />
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button colorScheme="green" onClick={handleSubmit} isLoading={loading}>
            Create Track
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TrackCreationModal;
