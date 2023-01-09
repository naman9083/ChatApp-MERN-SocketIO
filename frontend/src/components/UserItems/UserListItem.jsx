import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      _hover={{ backgroundColor: "#38B2AC", color: "white" }}
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      alignItems="center"
      display="flex"
      w="100%"
      bg="#E8E8E8"
      color="black"
    >
      <Avatar
        size="sm"
        mr={2}
        name={user.name}
        src={user.pic}
        cursor="pointer"
      />

      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
