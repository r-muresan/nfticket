import Image from "next/image";
import Link from "next/link";
import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { BACKGROUND, getSize, SECONDARY } from "../util/theme.js";
import LoadingView from "../components/LoadingView.js";
import Button from "@mui/material/Button";
import ConstructionIcon from "@mui/icons-material/Construction";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatDistance } from "date-fns";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const BuyPage = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      marginTop={10}
      marginBottom={5}
    >
      <Box display="flex" flexDirection="column" maxWidth={1000} width="100%">
        <Typography
          variant="h2"
          size={titleSize}
          color="black"
          fontWeight={400}
        >
          Events
        </Typography>
      </Box>
    </Box>
  );
};

export const EventCard = ({
  title,
  desc,
  image,
  startTime,
  eventId,
  location,
  maxParticipants,
}) => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();

  return (
    <Card sx={{ backgroundColor: SECONDARY, width: "600px" }}>
      <CardActionArea href={eventId ? `/event/${eventId}` : undefined}>
        <CardMedia component="img" height="300" width="500" image={image} />

        <CardContent>
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize={textSize + 5} noWrap>
                {title || "Event Name"}
              </Typography>
              {location && (
                <Box display="flex" gap={1} alignItems="center">
                  <LocationOnIcon />
                  <Typography fontSize={textSize} noWrap>
                    {location}
                  </Typography>
                </Box>
              )}
            </Box>

            <Typography fontSize={textSize}>{desc}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap={1} alignItems="center">
              <PeopleIcon />
              <Typography fontSize={textSize}>
                {`0/${maxParticipants}`}
              </Typography>
            </Box>
            <Box display="flex" gap={1} alignItems="center">
              <AccessTimeIcon />
              <Typography fontSize={textSize}>
                {formatDistance(startTime, new Date(), {
                  addSuffix: true,
                })}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BuyPage;