import axios from "axios";
import { useEffect, useState } from "react";
import ChatLoading from "../miscellaneous/ChatLoading";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import { add7hrs, getSender } from "../../config/ChatsLogics";
import GroupChatModal from "../miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const Toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      Toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      height="82vh"
      borderWidth="1px"
    >
      <Box
        display="flex"
        flexDir={{ base: "column", md: "row" }}
        pb={3}
        px={3}
        w="100%"
        alignItems="center"
        fontSize={{ base: "18px", md: "30px" }}
        justifyContent="space-between"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            mt={{ base: "10px", md: "0px" }}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            colorScheme="blue"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Box
                    display="flex"
         
                    justifyContent="space-between"
                  >
                    <Text
                      fontSize="xs"
                      display="flex"
                      justifyContent="flex-start"
                    >
                      <b>
                        {chat.latestMessage.sender._id !== user._id
                          ? chat.latestMessage.sender.name.split(" ")[0]
                          : "You"}{" "}
                        :{" "}
                      </b>

                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 25) + "..."
                        : chat.latestMessage.content}
                    </Text>
                    <Text fontWeight="extrabold" fontSize="10px">
                      {" "}
                      {add7hrs(chat.latestMessage.createdAt)}
                    </Text>
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
