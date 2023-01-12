import { Avatar, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import "./messageStyle.css"
import {
  add7hrs,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatsLogics";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../Context/ChatProvider";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages.map((m, i) => (
        <div key={m._id} style={{ display: "flex" }}>
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                src={m.sender.pic}
                name={m.sender.name}
                cursor="pointer"
              />
            </Tooltip>
          )}
          
          <span
          className="message"
            style={{
              backgroundColor: `${
                m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              }`,
              marginLeft: isSameSenderMargin(messages, m, i, user._id),
              marginTop: isSameUser(messages, m, i, user._id) ? 4 : 10,
             
             
            }}
          >
            <Text wordBreak="break-word">{m.content}</Text>
            <Text fontSize="10px" textAlign="end">{add7hrs(m.createdAt)}</Text>
          </span>
          
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
