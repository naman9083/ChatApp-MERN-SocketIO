import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  useDisclosure,
  ModalCloseButton,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import UserBatchItem from "../UserItems/UserBatchItem";
import { React, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserItems/UserListItem";
import { useEffect } from "react";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();
  const handleSearch = async (query) => {
    setSearch(query.target.value);
    if (!query.target.value) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName) {
      return toast({
        title: "Please enter a valid name",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    }
    if (selectedUsers.length === 0) {
      return toast({
        title: "Please add atleast one user",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((sel) => sel._id)),
        },
        config
      );
      setChats([data, ...chats]);
      toast({
        title: "New Group Chat Created",
        status: "success",
        description: "You can now start chatting with your friends",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Create Group Chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    setSearchResults([]);
   }, []);


  const handleDelete = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deleteUser._id));
  };
  const handleGroup = async (user) => {
    if (selectedUsers.includes(user)) {
      return toast({
        title: "User already added",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBatchItem
                  key={u._id}
                  user={u}
                  handleDelete={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResults?.slice(0, 4).map((user) => (
                // <div>{user.name}</div>
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
