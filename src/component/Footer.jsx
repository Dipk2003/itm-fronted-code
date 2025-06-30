import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Tag,
  Image,
} from "@chakra-ui/react";
import React from "react";
import Logo from "../assets/logodark.png";
import AboutUs from "../pages/AboutUs";

const Footer = () => {
  return (
    <Box borderTop="3px solid purple" bg="black" textColor={"white"}>
      <Container as={Stack} maxW={"6xl"} py={10}>
        <Box height={{ base: "10px", md: "40px" }}>
          <Image src={Logo} height="100%" />
        </Box>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={1}>
              Product
            </Text>
            <Link href={"#"}>Overview</Link>
            <Stack direction={"row"} align={"center"} spacing={1}>
              <Link href={"#"}>Features</Link>
              <Tag size={"sm"} ml={1} color={"white"}>
                New
              </Tag>
            </Stack>
            <Link href={"#"}>Tutorials</Link>
            <Link href={"#"}>Pricing</Link>
            <Link href={"#"}>Releases</Link>
          </Stack>
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={1}>
              Company
            </Text>
            <Link href={"./AboutUs"}>About Us</Link>
            <Link href={"./Press"}>Press</Link>
            <Link href={"./Career"}>Careers</Link>
            <Link href={"./ContactUs"}>Contact Us</Link>
            <Link href={"#"}>Partners</Link>
          </Stack>
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={1}>
              Legal
            </Text>
            <Link href={"#"}>Cookies Policy</Link>
            <Link href={"#"}>Privacy Policy</Link>
            <Link href={"#"}>Terms of Service</Link>
            <Link href={"#"}>Law Enforcement</Link>
            <Link href={"#"}>Status</Link>
          </Stack>
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={1}>
              Follow Us
            </Text>
            <Link href={"https://www.facebook.com/IndianTradeMart/"}>Facebook</Link>
            <Link href={"#"}>Twitter</Link>
            <Link href={"#"}>Dribbble</Link>
            <Link href={"https://www.instagram.com/indiantrademart?igsh=d2ljNTQyZ2Z5bDN5/"}>Instagram</Link>
            <Link href={"https://www.linkedin.com/company/itm-indiantrademart/"}>LinkedIn</Link>
          </Stack>
        </SimpleGrid>
      </Container>
      <Text pt={6} fontSize={"sm"} textAlign={"center"}>
        © 2025 INDIANTRADEMART. All rights reserved
      </Text>
    </Box>
  );
};

export default Footer;
