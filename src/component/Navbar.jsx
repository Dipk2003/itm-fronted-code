import React, { useEffect, useState } from "react";
//-----------Chakra UI Components-------
import { Box, Flex, HStack, IconButton, useDisclosure, Stack, Input, Text, Image, Button, PopoverFooter, PopoverBody, PopoverHeader, PopoverCloseButton, PopoverArrow, PopoverContent, Popover, PopoverTrigger,  Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Spinner, useToast,
} from "@chakra-ui/react";
//-----------ICONS----------------------
import { TiThSmall } from "react-icons/ti";
import { ImUserCheck } from "react-icons/im";
import { RiCustomerServiceFill } from "react-icons/ri";
import { BsQuestionCircle, BsShop } from "react-icons/bs";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { MdOutlineMessage, MdSendToMobile } from "react-icons/md";
import { BiMessageDetail, BiMobile, BiUserCircle } from "react-icons/bi";
import { AiOutlineHome, AiOutlineSetting, AiOutlineTag } from "react-icons/ai";
import { Link } from 'react-router-dom';

//-----------***------------------------------------------------------------------
import Logo from "../assets/logo.png";//
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AddUser,
  GetAllAdmin,
  LoginUser,
  LogOUT,
} from "../redux/Authentication/auth.action";
import { getItem, setItem } from "../utility/localStorage";
import AdminLogin from "./Login/AdminLogin";
import userLogin from './Login/userLogin'
import UserLogin from "./Login/userLogin";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Registarion, setRegistarion] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [cred, setCred] = useState({});
  const [conform, setConform] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handlechenge = (e) => {
    const { name, value } = e.target;
    setCred({
      ...cred,
      [name]: value,
    });
  };
  const { isLoading, isError, userData, isAuth, userlist, adminlist } =
    useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleAdminLogin = () => {
    adminlist.forEach((element) => {
      if (element.email === cred.email && element.password === cred.password) {
        setItem("admin", element);
        toast({
          title: "successfully sign in ",
          description: "",
          status: "success",
          duration: 6000,
          isClosable: true,
        });
        onClose();
        navigate("/admin");
      }
    });
  };

  useEffect(() => {
    dispatch(GetAllAdmin());

    
  }, []);
  const handleClick=async()=>{
    try {
       dispatch(AddUser(cred))
     
    }
    catch (error) {
    }
  }
  const handleLogin=async()=>{
    try {
      dispatch(LoginUser(cred))
      
    } catch (error) {
    }
  }

  


  const handleLogout = () => {
    dispatch(LogOUT());
  };
  let styleNev={
    position: "-webkit-sticky",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex : "1",
    width: "100%"
}
let tocken = getItem("userData");
  return (
    <>

      <Box backgroundColor="#2E3192" style={styleNev} >

     
        <Flex h={14} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={{ base: 3, md: 8 }} alignItems={"center"}>

            <Link to="/" ><Box w={["100px", "100px", "100px", "100px"]}>
              <Image src={Logo} />
            </Box></Link>

          </HStack>
          <Flex alignItems={"center"} w={{ md: "75%", md: "40%", lg: "30%" }}>
            <Box
              justifyContent="space-around"
              w="100%"
              display={{ base: "none", md: "flex" }}
            >
              <Box align="center">
                <AiOutlineTag
                  fontSize="20px"
                  color="#dbdbdb"
                  cursor="pointer"
                />
                <Text cursor="pointer" fontSize="12px" color="white">
                  Shopping
                </Text>
              </Box>
              <Box align="center">
                <BsShop fontSize="20px" color="#dbdbdb" cursor="pointer" />
                <Text cursor="pointer" fontSize="12px" color="white">
                  Sell
                </Text>
              </Box>
              <Box align="center">
                <BsQuestionCircle
                  fontSize="20px"
                  color="#dbdbdb"
                  cursor="pointer"
                />
                <Text cursor="pointer" fontSize="12px" color="white">
                  Shopping
                </Text>
              </Box>
              <Box align="center">
                <MdOutlineMessage
                  fontSize="20px"
                  color="#dbdbdb"
                  cursor="pointer"
                />
                <Text cursor="pointer" fontSize="12px" color="white">
                  Message
                </Text>
              </Box>
              <Popover>
                <PopoverTrigger>
                  <Box align="center">
                    <BiUserCircle
                      fontSize="20px"
                      color="#dbdbdb"
                      cursor="pointer"
                    />
                    <Text cursor="pointer" fontSize="12px" color="white">
                     {  tocken ? "user":"Sign In"}
                    </Text>
                  </Box>
                </PopoverTrigger>
                <PopoverContent
                  border="none"
                  borderRadius="0px"
                  boxShadow="rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"
                >
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>
                    <Box align="center">

      {/* user Login & sigin up Popo up  component   ------------------------------------------------ */}

                        <UserLogin handleLogout={handleLogout} admin={admin} handlechenge ={handlechenge} Registarion ={Registarion} handleLogin ={handleLogin}setRegistarion ={setRegistarion}setConform ={setConform}cred ={cred}conform ={conform}handleClick ={handleClick}/>

                      <Text fontSize={{ base: "11px", md: "12px" }}>
                        New to INDIANTRADEMART{" "}
                        <span style={{ color: "blue" }}>Join Now</span>
                      </Text>
                    </Box>
                  </PopoverHeader>
                  <PopoverBody>
                    <Box>
                      <Flex m={{ base: "5px 0px", md: "10px 0px" }} gap="5px">
                        <AiOutlineHome fontSize="20px" color="gray" />
                        <Text
                          display="flex"
                          fontSize={{ base: "12px", md: "14px" }}
                          cursor="pointer"
                          fontWeight="500"
                        >
                          Home
                        </Text>
                      </Flex>
                      <Flex m={{ base: "5px 0px", md: "10px 0px" }} gap="5px">
                        <MdSendToMobile fontSize="20px" color="gray" />
                        <Text
                          display="flex"
                          fontSize={{ base: "12px", md: "14px" }}
                          cursor="pointer"
                          fontWeight="500"
                        >
                          Post Your Requirement
                        </Text>
                      </Flex>
                      <Flex m={{ base: "5px 0px", md: "10px 0px" }} gap="5px">
                        <ImUserCheck fontSize="20px" color="gray" />
                        <Text
                          display="flex"
                          fontSize={{ base: "12px", md: "14px" }}
                          cursor="pointer"
                          fontWeight="500"
                        >
                          Verified
                        </Text>
                      </Flex>
                      <Flex m={{ base: "5px 0px", md: "10px 0px" }} gap="5px">
                        <BiMessageDetail fontSize="20px" color="gray" />
                        <Text
                          display="flex"
                          fontSize={{ base: "12px", md: "14px" }}
                          cursor="pointer"
                          fontWeight="500"
                        >
                          My Orders
                        </Text>
                      </Flex>
                      <Flex m={{ base: "5px 0px", md: "10px 0px" }} gap="5px">
                        <RiCustomerServiceFill fontSize="20px" color="gray" />
                        <Text
                          display="flex"
                          fontSize={{ base: "12px", md: "14px" }}
                          cursor="pointer"
                          fontWeight="500"
                        >
                          Products/Services Directory
                        </Text>
                      </Flex>
                      <Flex m={{ base: "5px 0px", md: "10px 0px" }} gap="5px">
                        <AiOutlineSetting fontSize="20px" color="gray" />
                        <Text
                          display="flex"
                          fontSize={{ base: "12px", md: "14px" }}
                          cursor="pointer"
                          fontWeight="500"
                        >
                          Settings
                        </Text>
                      </Flex>
                      <Flex m={{ base: "5px 0px", md: "10px 0px" }} gap="5px">
                        <TiThSmall fontSize="20px" color="gray" />
                        <Text
                          display="flex"
                          fontSize={{ base: "12px", md: "14px" }}
                          cursor="pointer"
                          fontWeight="500"
                        >
                          Recent Activity
                        </Text>
                      </Flex>
                    </Box>
                  </PopoverBody>
                  <PopoverFooter>
                    <Box>
                      <Box p="10px 0px">
                        <Text
                          fontSize={{ base: "12px", md: "14px" }}
                          fontWeight="500"
                        >
                          Pay with INDIANTRADEMART
                        </Text>
                        <Text
                          fontSize={{ base: "12px", md: "14px" }}
                          color="gray"
                        >
                          Secure & hassle-free payments
                        </Text>
                      </Box>
                      <hr />
                      <Box p="10px 0px">
                        <Text
                          fontSize={{ base: "12px", md: "14px" }}
                          fontWeight="500"
                        >
                          Ship with INDIANTRADEMART
                        </Text>
                        <Text
                          fontSize={{ base: "12px", md: "14px" }}
                          color="gray"
                        >
                          Easy booking & transport
                        </Text>
                      </Box>
                      <hr />
                      <Box m="15px 0px">
                        <Text
                          fontSize={{ base: "12px", md: "14px" }}
                          fontWeight="500"
                          display="flex"
                        >
                         <BiMobile fontSize="20px" color="gray" /> Download APP
                        </Text>
                      </Box>
                      <hr />
                    </Box>
                    <Box align="center">
                            <AdminLogin setAdmin={setAdmin} admin={admin} handlechenge={handlechenge} handleAdminLogin={handleAdminLogin} />
                    </Box>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            </Box>
            <Flex>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              backgroundColor="#2E3192"
              color="white"
              fontSize={{ base: "20px", sm: "30px" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <Box display={{ base: "block", md: "none"}}>
                           <AdminLogin setAdmin={setAdmin} admin={admin} handlechenge={handlechenge} handleAdminLogin={handleAdminLogin} />
            </Box>
          </Flex>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} pl={4}display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <Text cursor="pointer" fontSize="12px" color="white">
              <UserLogin handleLogout={handleLogout} admin={admin} handlechenge ={handlechenge} Registarion ={Registarion} handleLogin ={handleLogin}setRegistarion ={setRegistarion}setConform ={setConform}cred ={cred}conform ={conform}handleClick ={handleClick}/>

              </Text>
              <Text cursor="pointer" fontSize="12px" color="white">
                Message
              </Text>
              <Text cursor="pointer" fontSize="12px" color="white">
                Shopping
              </Text>
              <Text cursor="pointer" fontSize="12px" color="white">
                Help
              </Text>
              <Text cursor="pointer" fontSize="12px" color="white">
                
              </Text>
            </Stack>
           
          </Box> 
        ) : null}
        
      </Box>
    </>
  );
};

export default Navbar;
