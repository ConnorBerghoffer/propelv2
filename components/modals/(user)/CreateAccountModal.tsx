import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '@/app/providers/AuthProvider';
import { supabase } from '@/utils/supabase/client';

interface PermissionGroup {
  uuid: string;
}

const CreateAccountModal: React.FC = () => {
  const { session } = useAuth();
  const toast = useToast();
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [group, setGroup] = useState('');

  const handleSubmit = async () => {
    console.log('Submit clicked');
    const { user } = session!;

    try {
      console.log('Fetching permission group');
      const { data: permissionGroup, error: groupError } = await supabase
        .from('permission_groups')
        .select('uuid')
        .eq('name', group)
        .maybeSingle();

      if (groupError) {
        console.error('Error fetching permission group:', groupError);
        toast({
          title: 'Error',
          description: 'Failed to fetch permission group.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!permissionGroup) {
        console.error('No permission group found');
        toast({
          title: 'Error',
          description: 'No permission group found with the selected role.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      console.log('Permission group fetched:', permissionGroup);

      console.log('Inserting user');
      const { data: userInsert, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            uuid: user?.id,
            f_name: fName,
            l_name: lName,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting user:', insertError);
        toast({
          title: 'Error',
          description: 'Failed to create profile.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      console.log('User inserted:', userInsert);

      console.log('Inserting user group');
      const { error: userGroupError } = await supabase
        .from('user_groups')
        .insert([
          {
            user_uuid: userInsert.uuid,
            permission_group_uuid: permissionGroup.uuid,
          },
        ]);

      if (userGroupError) {
        console.error('Error inserting user group:', userGroupError);
        toast({
          title: 'Error',
          description: 'Failed to assign user to group.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      console.log('User created and assigned to group successfully');
      toast({
        title: 'Success',
        description: 'Profile created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      window.location.reload();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={true} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input value={fName} onChange={(e) => setFName(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input value={lName} onChange={(e) => setLName(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Role</FormLabel>
            <Select placeholder="Select role" onChange={(e) => setGroup(e.target.value)}>
              <option value="Viewer">Viewer</option>
              <option value="Creator">Creator</option>
              <option value="Manager">Manager</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAccountModal;
