'use client'
import { ChevronDownIcon } from '@chakra-ui/icons';
import React from 'react';
import EventCreationModal from '../modals/EventCreationModal';
import ForumPostCreationModal from '../modals/ForumPostCreationModal';
import TrackCreationModal from '../modals/TrackCreationModal';
import VideoCreationModal from '../modals/VideoCreationModal';
import { useDisclosure, Menu, MenuButton, Button, MenuList, MenuItem, Box } from '@chakra-ui/react';

export const ActivityBar = () => {
  const { isOpen: isTrackOpen, onOpen: onTrackOpen, onClose: onTrackClose } = useDisclosure();
  const { isOpen: isVideoOpen, onOpen: onVideoOpen, onClose: onVideoClose } = useDisclosure();
  const { isOpen: isEventOpen, onOpen: onEventOpen, onClose: onEventClose } = useDisclosure();
  const { isOpen: isForumPostOpen, onOpen: onForumPostOpen, onClose: onForumPostClose } = useDisclosure();

  return (
    <Box p={4}>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Create
        </MenuButton>
        <MenuList>
          <MenuItem onClick={onTrackOpen}>Track</MenuItem>
          <MenuItem onClick={onVideoOpen}>Video</MenuItem>
          <MenuItem onClick={onEventOpen}>Event</MenuItem>
          <MenuItem onClick={onForumPostOpen}>Forum Post</MenuItem>
        </MenuList>
      </Menu>
      
      <TrackCreationModal isOpen={isTrackOpen} onClose={onTrackClose} />
      <VideoCreationModal isOpen={isVideoOpen} onClose={onVideoClose} />
      <EventCreationModal isOpen={isEventOpen} onClose={onEventClose} />
      <ForumPostCreationModal isOpen={isForumPostOpen} onClose={onForumPostClose} />
    </Box>
  );
};
