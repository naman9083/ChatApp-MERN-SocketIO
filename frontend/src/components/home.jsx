import {
  Box,
  Center,
  Container,
  Text,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  TabList,
} from "@chakra-ui/react";
import React from "react";
import Login from "./authentication/login";
import SignUp from "./authentication/signUp";

const Home = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Center>
          <Text color={"black"} fontSize="4xl" fontFamily="Work Sans">
            Tanz-A-Tive
          </Text>
        </Center>
      </Box>
      <Box
        bg="white"
        w="100%"
        color={'black'}
        p={4}
        borderRadius="lg"
        borderWidth="1px"

      >
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
