import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import SingleChat from "../SingleChat";
const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const { selectedChat } = ChatState();

  return (
    <div>
      <Box
        display={{ base: selectedChat ? "flex" : "none", md: "flex", lg: "flex" }}
        flexDir="column"
       
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "78vw", md: "62vw", lg: "64vw", sm: "85vw" }}
        borderRadius="lg"
        height="82vh"
        borderWidth="1px"
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </div>
  );
};

export default ChatBox;