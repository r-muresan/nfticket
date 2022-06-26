import Image from "next/image";
import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { BACKGROUND, getSize } from "../util/theme.js";
import Button from "@mui/material/Button";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import SellIcon from "@mui/icons-material/Sell";

const LandingPage = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();

  return (
    <Box
      sx={{
        backgroundColor: "black",
      }}
      color="white"
      display="flex"
      flexDirection="column"
    >
      <Box sx={{ position: "absolute", zIndex: 1 }} width="100%">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginTop={isWidescreen ? 4 : 2}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            marginLeft={isWidescreen ? 8 : 2}
          >
            <Image
              src="/icons/logo.png"
              width={titleSize * 2.5}
              height={titleSize * 2.5}
              alt="ogo"
              layout="fixed"
            />
          </Box>
        </Box>
      </Box>

      <Box
        display="flex"
        height="100vh"
        width="100vw"
        flexDirection="column"
        bgcolor="black"
        my={4}
      >
        <Box flex={1} maxHeight="60%" mt={8} mb={4}>
          <video
            autoPlay
            muted
            playsInline
            loop
            width="100%"
            height="100%"
            alt="Trailer video"
          >
            <source src="/videos/tickets.mp4" type="video/mp4" />
          </video>
        </Box>
        <Box
          display="flex"
          flex={1}
          flexDirection="column"
          textAlign="center"
          alignItems="center"
          marginX={2}
        >
          <Typography
            className="gradientText"
            fontSize={isWidescreen ? 60 : 45}
            variant="h1"
            color={BACKGROUND}
          >
            Events tickets simplified with NFTs
          </Typography>

          <Box display="flex" marginTop={2} gap={4}>
            <Button variant="contained" size="large" href="/events">
              Events
            </Button>
            <Button variant="contained" size="large" href="/host">
              Host an Event
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <Box maxWidth="800px" textAlign="left" marginX={2} fontSize={textSize}>
          <Typography
            className="gradientText"
            fontSize={titleSize}
            variant="h2"
            color="primary"
            fontWeight={400}
          >
            About NFTicket
          </Typography>
          <Typography fontSize="inherit" fontWeight={300} marginTop={3}>
            We solve for double spending, coordination issues, and credible
            identification by streamlining the ticketing process with NFTs.
            On-chain governance and NFT-related rewards guarantee better
            attendee and host experiences.
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <Box
          maxWidth="800px"
          textAlign="left"
          marginX={2}
          fontSize={textSize}
          display="flex"
          flexDirection="column"
          gap={1}
        >
          <Typography
            className="gradientText"
            fontSize={titleSize}
            variant="h2"
            color="primary"
            fontWeight={400}
          >
            What makes us different
          </Typography>
          <UtilityCard
            title="Ticket Resale done easy"
            desc="You can sell your tickets to anyone, anywhere, and anytime; just like NFTs."
            icon={<SellIcon sx={{ fontSize: titleSize }} color="dark" />}
          />
          <UtilityCard
            title="Governance"
            desc="Event participants get to vote on decisions proposed by event creators."
            icon={
              <AssuredWorkloadIcon sx={{ fontSize: titleSize }} color="dark" />
            }
          />
          <UtilityCard
            title="Zero Knowledge"
            desc="Using Zero Knowledge proofs to prove ownership"
            icon={<HowToVoteIcon sx={{ fontSize: titleSize }} color="dark" />}
          />
        </Box>
      </Box>
    </Box>
  );
};

const UtilityCard = ({ icon, title, desc }) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      sx={{ backgroundColor: BACKGROUND }}
      padding={1.5}
      paddingRight={3}
      borderRadius={1}
      marginX={2}
      gap="25px"
    >
      <Box>{icon}</Box>
      <Box>
        <Typography fontSize={25} color="black" fontWeight={500}>
          {title}
        </Typography>
        <Typography fontSize={20} color="black">
          {desc}
        </Typography>
      </Box>
    </Box>
  );
};

LandingPage.removeNavBar = true;

export default LandingPage;
