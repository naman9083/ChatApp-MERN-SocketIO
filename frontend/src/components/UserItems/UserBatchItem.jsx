import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBatchItem = ({user, handleDelete}) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      
      mb={2}
      fontSize={12}
      variant="solid"
      cursor="pointer"
      color="white"
      backgroundColor="purple"
      onClick={handleDelete}
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBatchItem;
