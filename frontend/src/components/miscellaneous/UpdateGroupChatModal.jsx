import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBatchItem from "../UserItems/UserBatchItem";
import UserListItem from "../UserItems/UserListItem";

const UpdateGroupChatModal = ({ fetch, setFetchAgain, fetchMessages }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [groupName, setGroupName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const Toast = useToast();
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      Toast({
        title: "Un-Authorized!",
        description: "Only Group Admin can remove users",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/removeFromGroup",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetch);
      fetchMessages();
      setLoading(false);
      Toast({
        title: "Success!",
        description: "User Removed Successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      Toast({
        title: "Error Occured!",
        description: "Failed to Remove the User",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      Toast({
        title: "Error Occured!",
        description: "User is already in the chat",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      Toast({
        title: "Un-Authorized!",
        description: "Only Group Admin can add users to the chat",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/addToGroup`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetch);
      setLoading(false);
      Toast({
        title: "Success!",
        description: "User Added to the Chat Successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      Toast({
        title: "Error Occured!",
        description: "Failed to Add User to the Chat",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupName },
        config
      );
      setRenameLoading(false);
      setFetchAgain(!fetch);
      setSelectedChat(data);
      onClose();
      Toast({
        title: "Success!",
        description: "Chat Name Updated Successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      Toast({
        title: "Error Occured!",
        description: "Failed to Update the Chat Name",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupName("");
  };
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
      setSearchResult(data);
    } catch (error) {
      Toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <div>
      <IconButton
        onClick={onOpen}
        display={{ base: "flex" }}
        icon={<ViewIcon />}
      />
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBatchItem
                  key={u._id}
                  user={u}
                  handleDelete={() => handleRemove(u)}
                />
              ))}
            </Box>
            <Box
              display="flex"
              width="100%"
              justifyContent="center"
              flexDir="row"
            >
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  value={groupName}
                  mb={3}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </FormControl>
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </Box>
            <FormControl>
              <Input
                placeholder="Add Users to Group"
                mb={1}
                onChange={(e) => handleSearch(e)}
              />
            </FormControl>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                // <div>{user.name}</div>
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    handleAddUser(user);
                  }}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={()=>handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModal;
