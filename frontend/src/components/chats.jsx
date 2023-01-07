import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import ChatPage from "./ChatPage";
import SideDrawer from "./miscellaneous/SideDrawer";
import MyChats from "./MyChats";

const Chats = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: "100%"}}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10">
        <HStack w="100%" justify="space-between">
          {user && <MyChats />}
          {user && <ChatPage />}
        </HStack>
      </Box>
    </div>
  );
};

export default Chats;
