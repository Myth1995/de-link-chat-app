import React, { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { Box, Text, Button, Stack, Avatar, Divider, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { IoMdAdd, IoMdPeople } from "react-icons/io";
import Loader from "./Loader";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";
import DiscussionChatModal from "./DiscussionChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [userList, setUserList] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats, teams, setTeams, selectedUser, setSelectedUser } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/chats`, config);
      setTeams(data);
    } catch (err) {
      toast.error(err);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/discussions`, config);
      setChats(data);
    } catch (err) {
      toast.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users`, config);
      setUserList(data.users);
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    const getAllData = async () => {
      setLoggedUser(JSON.parse(localStorage.getItem("deLinkUser")));
      await fetchUsers();
      await fetchChats();
      await fetchDiscussions();
    }

    getAllData();
  }, [fetchAgain]);

  if (!loggedUser) {
    return <Loader />;
  }
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p="3"
      h="90vh"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      bg={"rgba(255, 255, 255, 0.885)"}
    >
      <Tabs w={{ base: "100%" }} align='start' variant='enclosed'>
        <TabList>
          <Tab>My Contracts</Tab>
          <Tab>Teams</Tab>
          <Tab>Discussions</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box
              pb="3"
              px="3"
              fontSize={{ base: "1rem", md: "1.2rem" }}
              d="flex"
              w="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>Contract</Text>
            </Box>
            <Box
              d="flex"
              flexDir="column"
              p={3}
              bg="#f8f8f8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {userList ? (
                <Stack overflowY="scroll">
                  {userList.map((el, index) => (
                    <div key={index}>
                      <Box
                        onClick={() => {
                          setSelectedUser(el);
                        }}
                        cursor="pointer"
                        bg={selectedUser === el ? "#1d1931" : "e8e8e8"}
                        color={selectedUser === el ? "#fff" : "#000"}
                        px="3"
                        py="2"
                        borderRadius="lg"
                        transition="200ms ease-in-out"
                        d="flex"
                      >
                        <Avatar
                          size="sm"
                          cursor="pointer"
                          // bg={chat.isGroupChat ? "#1d1931" : null}
                          icon={el.image
                            // chat.isGroupChat && (
                            //   <IoMdPeople fontSize="1.5rem" color="#fff" />
                            // )
                          }
                          src={el.image
                            // !chat.isGroupChat &&
                            // getSender(loggedUser.user, chat.users)?.image
                          }
                          name={el.name
                            // !chat.isGroupChat &&
                            // getSender(loggedUser.user, chat.users).name
                          }
                          mr="4"
                        />
                        <Text fontSize="1.25rem">
                          {el.name
                          // !chat.isGroupChat
                          //   ? getSender(loggedUser?.user, chat?.users)?.name
                          //   : chat.discussionName
                            }
                        </Text>
                      </Box>
                      <Divider />
                    </div>
                  ))}
                </Stack>
              ) : (
                <Loader />
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              pb="3"
              px="3"
              fontSize={{ base: "1rem", md: "1.2rem" }}
              d="flex"
              w="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>My Teams</Text>
              {
                user.user.role === "superuser" ? 
                  <GroupChatModal>
                    <Button
                      d="flex"
                      fontSize={{ base: "1rem", md: "0.9rem", lg: "1rem" }}
                      color="#fff"
                      rightIcon={
                        <div style={{ color: "#fff" }}>
                          <IoMdAdd />
                        </div>
                      }
                      zIndex="0"
                      colorScheme={"blackAlpha"}
                      bg={"#1d1931"}
                    >
                      Create Team
                    </Button>
                  </GroupChatModal>
                : <></>
              }
              
            </Box>
            <Box
              d="flex"
              flexDir="column"
              p={3}
              bg="#f8f8f8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {teams ? (
                <Stack overflowY="scroll">
                  {teams.map((chat, index) => (
                    <div key={index}>
                      <Box
                        onClick={() => setSelectedChat(chat)}
                        cursor="pointer"
                        bg={selectedChat === chat ? "#1d1931" : "e8e8e8"}
                        color={selectedChat === chat ? "#fff" : "#000"}
                        px="3"
                        py="2"
                        borderRadius="lg"
                        transition="200ms ease-in-out"
                        d="flex"
                      >
                        <Avatar
                          size="sm"
                          cursor="pointer"
                          bg={chat.isGroupChat ? "#1d1931" : null}
                          icon={
                            chat.isGroupChat && (
                              <IoMdPeople fontSize="1.5rem" color="#fff" />
                            )
                          }
                          src={
                            !chat.isGroupChat &&
                            getSender(loggedUser.user, chat.users)?.image
                          }
                          name={
                            !chat.isGroupChat &&
                            getSender(loggedUser.user, chat.users).name
                          }
                          mr="4"
                        />
                        <Text fontSize="1.25rem">
                          {!chat.isGroupChat
                            ? getSender(loggedUser?.user, chat?.users)?.name
                            : chat.chatName}
                        </Text>
                      </Box>
                      <Divider />
                    </div>
                  ))}
                </Stack>
              ) : (
                <Loader />
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              pb="3"
              px="3"
              fontSize={{ base: "1rem", md: "1.2rem" }}
              d="flex"
              w="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>My Discussions</Text>
              {
                user.user.role === "superuser" ? 
                  <DiscussionChatModal>
                    <Button
                      d="flex"
                      fontSize={{ base: "1rem", md: "0.9rem", lg: "1rem" }}
                      color="#fff"
                      rightIcon={
                        <div style={{ color: "#fff" }}>
                          <IoMdAdd />
                        </div>
                      }
                      zIndex="0"
                      colorScheme={"blackAlpha"}
                      bg={"#1d1931"}
                    >
                      Create Discussion
                    </Button>
                  </DiscussionChatModal>
                : <></>
              }
              
            </Box>
            <Box
              d="flex"
              flexDir="column"
              p={3}
              bg="#f8f8f8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {chats ? (
                <Stack overflowY="scroll">
                  {chats.map((chat, index) => (
                    <div key={index}>
                      <Box
                        onClick={() => setSelectedChat(chat)}
                        cursor="pointer"
                        bg={selectedChat === chat ? "#1d1931" : "e8e8e8"}
                        color={selectedChat === chat ? "#fff" : "#000"}
                        px="3"
                        py="2"
                        borderRadius="lg"
                        transition="200ms ease-in-out"
                        d="flex"
                      >
                        <Avatar
                          size="sm"
                          cursor="pointer"
                          bg={chat.isGroupChat ? "#1d1931" : null}
                          icon={
                            chat.isGroupChat && (
                              <IoMdPeople fontSize="1.5rem" color="#fff" />
                            )
                          }
                          src={
                            !chat.isGroupChat &&
                            getSender(loggedUser.user, chat.users)?.image
                          }
                          name={
                            !chat.isGroupChat &&
                            getSender(loggedUser.user, chat.users).name
                          }
                          mr="4"
                        />
                        <Text fontSize="1.25rem">
                          {!chat.isGroupChat
                            ? getSender(loggedUser?.user, chat?.users)?.name
                            : chat.discussionName}
                        </Text>
                      </Box>
                      <Divider />
                    </div>
                  ))}
                </Stack>
              ) : (
                <Loader />
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
    </Box>
  );
};

export default MyChats;
