import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import axios from "axios";
import ChatsLoading from "./ChatLoading";
import UserListItem from "./UserListItem";


const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {user,setSelectedChat,chats, setChats} = ChatState();
  const logout = () => {
    localStorage.removeItem("userInfo");
    window.location.reload();
  };
  const handleSearch = async (element) => {
    setSearch(element.target.value);
    if(element.target.value.length === 0) {
    return toast({
      title: "Please enter a name",
      status: "warning",
      duration: 2000,
      isClosable: true,
      position: "top-left",
    });
    
  }
  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.get(`/api/user?search=${search}`, config);
    setLoading(false);
    setSearchResult(data); 
  } catch (error) {
    return toast({
      title: "Something went wrong",
      description: 'Please try again later',
      status: "error",
      duration: 2000,
      isClosable: true,
      position: "bottom-left",
    });

  }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post('/api/chat/',{userId}, config);
      if(!chats.find(chat => chat._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      return toast({
        title: "Something went wrong",
        description: 'Please try again later',
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  return (
    <div>
      <Box
        d="flex"
        justifyContent="space-between"
        w="100%"
        p="5px 10px 5px 10px"
        alignItems="center"
        bg="white"
        borderWidth="5px"
      >
        <HStack justifyContent="space-between">
          <Tooltip
            label="Search Users to chat"
            aria-label="Search"
            hasArrow
            placement="bottom-end"
          >
            <Button
              variant="ghost"
              onClick={ onOpen }
              style={{ border: "1px solid black" }}
              _hover={{ backgroundColor: "black", textColor: "white" }}
            >
              <i className="fas fa-search"></i>
              <Text d={{ base: "none", md: "flex" }} px="4">
                Search User
              </Text>
            </Button>
          </Tooltip>
          <Text fontSize="4xl" color="black" fontWeight="900">
            
            Tanz-A-Tive
          </Text>
          <div>
            <Menu>
              <MenuButton p={1}>
                <BellIcon fontSize="2xl" m={1} />
              </MenuButton>
              {/* <MenuList></MenuList> */}
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}></Avatar>
              </MenuButton>
              <MenuList>
                <ProfileModel user={user}>

                <MenuItem>My Profile</MenuItem>
                </ProfileModel>
                <MenuDivider/>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </HStack>
      </Box>
      <Drawer placement="left" size="sm" isOpen={isOpen}  onClose={onClose} onOpen={onOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerCloseButton onClick={onclose}/>
          <DrawerHeader borderWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb="2px" mb="5px">
              <HStack spacing="24px">
              <Input placeholder="Search by username or email" value={search} mr={2} onChange={(e) => handleSearch(e)} />
              <Button onClick={handleSearch}  colorScheme="blue">Go</Button>
              </HStack>
            </Box>
            {loading?<ChatsLoading/>:
            (searchResult?.map((user) => (
              
              <UserListItem user={user} key={user._id}  handleFunction={()=>accessChat}/>
            )
            )
            )
            }
          {loadingChat && <Spinner ml="auto" display="flex"/>}
          </DrawerBody>
          
        </DrawerContent>
      </Drawer>

    </div>
  );
};

export default SideDrawer;
