import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import GroupsIcon from "@mui/icons-material/Groups";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  BACKGROUND,
  COMMON,
  UNCOMMON,
  RARE,
  EPIC,
  LEGENDARY,
  getSize,
} from "../util/theme.js";
import LoadingView from "../components/LoadingView.js";
import Button from "@mui/material/Button";
import ConstructionIcon from "@mui/icons-material/Construction";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

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
      gap="100px"
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
            {/* <Typography
              fontSize={subtitleSize}
              color="primary"
              fontWeight={500}
            >
              NFTicket
            </Typography> */}
          </Box>
        </Box>
      </Box>

      <Box
        display="flex"
        height="100vh"
        width="100vw"
        flexDirection="column"
        bgcolor="black"
      >
        <Box flex={1} maxHeight="70%">
          <video
            autoPlay
            muted
            playsInline
            width="100%"
            height="100%"
            alt="Trailer video"
          >
            <source src="/videos/trailer.mp4" type="video/mp4" />
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
          >
            Events tickets, simplified
          </Typography>

          <Box display="flex" marginTop={2} gap={4}>
            <Button variant="contained" size="large" href="/build">
              Enter App
            </Button>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <video
          autoPlay
          muted
          playsInline
          width="100%"
          height="100%"
          alt="Block showcase"
          loop
        >
          <source src="/videos/blockDisplay.mp4" type="video/mp4" />
        </video>
      </Box>

      <Box className="section">
        <Box maxWidth="800px" textAlign="left" marginX={2} fontSize={textSize}>
          <Typography
            className="gradientText"
            fontSize={titleSize}
            variant="h2"
          >
            About Coblox
          </Typography>
          <Typography fontSize="inherit">
            The community creates the NFTs and sets the price of the NFTs. 100%
            of the auction price is split between the builders of the NFT,
            incentiving the community to participate, cooperate and make a
            masterpeice.
          </Typography>
          <Typography fontSize="inherit" mt={4}>
            Art isn&apos;t just a final product but instead it is a journey
            filled with twists and turns. Coblox brings the journey of art back
            to NFTs. By placing a block, you make your mark in the journey.
          </Typography>
          <Typography fontSize="inherit"></Typography>
        </Box>
      </Box>
      <Box className="section">
        <Typography className="gradientText" fontSize={titleSize} variant="h2">
          How it works
        </Typography>
        <Typography fontSize={textSize} marginX={2}>
          From start to finish, a build takes 6 days to be minted into a NFT
        </Typography>
        <Grid container justifyContent="center" marginTop={4}>
          <PhaseCard
            time="Day 0"
            video="start"
            title="Start of build"
            desc="A fresh build has only one block."
          />
          <PhaseCard
            time="Day 0 to 6"
            video="buildPhase"
            title="Build Phase"
            desc="Buy a random block for 0.5 MATIC and place it on another block."
          />
          <PhaseCard
            time="Day 6 to 7"
            video="auctionPhase"
            title="Auction phase"
            desc="Bid on the build to win 3D NFT."
          />
          <PhaseCard
            time="Day 7"
            video="auctionEnd"
            title="Auction end"
            desc="100% of the auction price is split among the builders"
          />
        </Grid>
      </Box>
      <Box className="section">
        <Typography className="gradientText" fontSize={titleSize} variant="h2">
          What you&apos;ll build with
        </Typography>
        <Box
          display="flex"
          flexDirection={isWidescreen ? "row" : "column"}
          margin={4}
          rowGap="100px"
        >
          <Box
            sx={{ backgroundColor: BACKGROUND }}
            padding={4}
            margin={4}
            borderRadius="15px"
            textAlign="left"
            fontSize={textSize}
            maxWidth="600px"
          >
            <Typography fontSize="inherit">
              There are a total of 19 blocks that differ in rarity.
            </Typography>
            <Typography fontSize="inherit" color={COMMON} mt={4}>
              Common: 50%
            </Typography>
            <Typography fontSize="inherit" color={UNCOMMON}>
              Uncommon: 25%
            </Typography>
            <Typography fontSize="inherit" color={RARE}>
              Rare: 15%
            </Typography>
            <Typography fontSize="inherit" color={EPIC}>
              Epic: 8%
            </Typography>
            <Typography fontSize="inherit" color={LEGENDARY}>
              Legendary: 2%
            </Typography>
            <Typography fontSize="inherit" mt={4}>
              For 0.5 MATIC, you are given a random block. You may only have 1
              block at a time per build.
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="section">
        <Typography className="gradientText" fontSize={titleSize} variant="h2">
          Utility of the NFT
        </Typography>
        <Box
          display="flex"
          flexDirection={isWidescreen ? "row" : "column"}
          gap="100px"
          marginY={4}
          justifyContent="center"
          alignItems="center"
        >
          <Box
            textAlign="left"
            fontSize={textSize}
            display="flex"
            flexDirection="column"
            gap="5px"
          >
            <UtilityCard
              icon={
                <Image
                  src="/logos/opensea.png"
                  width={50}
                  height={50}
                  layout="fixed"
                />
              }
              title="OpenSea Compatible"
              desc="Sell, buy and trade Coblox NFTs on the OpenSea marketplace."
            />
            <UtilityCard
              icon={<ThreeDRotationIcon sx={{ fontSize: "50px" }} />}
              title="3D Print"
              desc="3D print your Coblox NFT using a 3D printer."
            />
            <UtilityCard
              icon={<ViewInArIcon sx={{ fontSize: "50px" }} />}
              title="View in AR"
              desc="View your Coblox NFT in AR using the AR viewer."
            />

            <UtilityCard
              icon={<GroupsIcon sx={{ fontSize: "50px" }} />}
              title="Community"
              desc="Experience a community like never before."
            />
            <UtilityCard
              icon={<QuestionMarkIcon sx={{ fontSize: "50px" }} />}
              title="Much More"
              desc="Wait and see."
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            maxWidth="100vw"
          >
            <video
              autoPlay
              muted
              playsInline
              width="400px"
              height="500px"
              alt="NFT in AR"
              className="curvedEdges"
              loop
            >
              <source src="/videos/ARView.mp4" type="video/mp4" />
            </video>
          </Box>
        </Box>
      </Box>
      <Box className="section">
        <Typography className="gradientText" fontSize={titleSize} variant="h2">
          Roadmap
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          gap="5px"
          margin={4}
          width="100%"
          maxWidth="800px"
        >
          <RoadMapItem
            title="Testnet Release"
            time="2022 Q2"
            desc="The Coblox app will be publicly deployed on the Polygon Mumbai testnet. The NFTs will also be listed on the the OpenSea testnet marketplace."
          />
          <RoadMapItem
            title="Security testing"
            time="2022 Q2"
            desc="The Coblox app will be tested for bugs and scale issues. The smart contract will also be audited for vulnerabilities."
          />
          <RoadMapItem
            title="Mainnet Release"
            time="2022 Q3"
            desc="Coblox will be public to everyone. Coblox NFTs will also be publicly listed on the OpenSea marketplace."
          />
          <RoadMapItem
            title="More to come"
            time="2022 Q4"
            desc="Developers will listen to the community and continue improving the Coblox ecosystem. Different gamemodes will added to the Coblox app."
          />
        </Box>
      </Box>
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        marginTop={8}
      >
        <Link href="https://discord.gg/GxNsprD6ZB">
          <a>
            <Image
              src="/logos/discord.svg"
              width={25}
              height={25}
              alt="Discord logo"
              layout="fixed"
              className="darkOnHover"
            />
          </a>
        </Link>
        <Typography
          fontSize={25}
          className="gradientText"
          marginX={2}
          textAlign="center"
        >
          Join to stay updated
        </Typography>

        <Link href="https://twitter.com/CobloxNFT">
          <a>
            <Image
              src="/logos/twitter.svg"
              width={25}
              height={25}
              alt="Twitter logo"
              layout="fixed"
              className="darkOnHover"
            />
          </a>
        </Link>
      </Box>
    </Box>
  );
};

const PhaseCard = ({ time, video, title, desc }) => {
  const videoComponent =
    video != "auctionPhase" ? (
      <video
        autoPlay
        loop
        muted
        playsInline
        width="100%"
        height="100%"
        alt={`${video} Video`}
        className="curvedEdges"
      >
        <source src={`/videos/${video}.mp4`} type="video/mp4" />
      </video>
    ) : (
      <Link
        href="https://giphy.com/gifs/season-16-the-simpsons-16x8-xT5LMESHbV1KLGMsq4"
        passHref
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          width="100%"
          height="100%"
          alt="Powered By GIPHY"
          className="curvedEdges"
        >
          <source src={`/videos/${video}.mp4`} type="video/mp4" />
        </video>
      </Link>
    );
  return (
    <Grid
      item
      xs={10}
      sm={5}
      lg={2.5}
      bgcolor={BACKGROUND}
      margin={2}
      borderRadius="10px"
      className="card"
    >
      <Box
        position="absolute"
        zIndex={1}
        borderRadius="7px"
        margin={2}
        border="solid"
        paddingX={1}
        display="flex"
        alignItems="center"
        gap="10px"
      >
        <AccessTimeIcon />
        <Typography variant="h6">{time}</Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        marginTop={1}
        padding={5}
        paddingBottom={5}
        textAlign="center"
      >
        <Box marginY={3}>{videoComponent}</Box>

        <Typography fontSize={30} marginBottom={0.5}>
          {title}
        </Typography>
        <Typography fontSize={18} color="#c8c8c8">
          {desc}
        </Typography>
      </Box>
    </Grid>
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
        <Typography fontSize={25} className="gradientText">
          {title}
        </Typography>
        <Typography fontSize={20}>{desc}</Typography>
      </Box>
    </Box>
  );
};

const RoadMapItem = ({ title, desc, time }) => {
  return (
    <Accordion sx={{ backgroundColor: BACKGROUND }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
        width="600px"
      >
        <Typography
          color={BACKGROUND}
          sx={{ backgroundColor: "white" }}
          padding={1}
          borderRadius={2}
          marginRight={2}
        >
          {time}
        </Typography>
        <Typography fontSize={25} className="gradientText">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography fontSize={20} color="white" textAlign="left">
          {desc}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

LandingPage.removeNavBar = true;

export default LandingPage;
