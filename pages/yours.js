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
import { useMultiEvents } from "../util/NFTContractInterface.js";
import Grid from "@mui/material/Grid";
import { EventCard } from "./events.js";

const YourEventsPage = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { loading, events } = useMultiEvents(true);

  console.log(events);

  if (loading) {
    return (
      <Box height="calc(100vh - 48px)">
        <LoadingView />
      </Box>
    );
  }

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
          fontSize={titleSize}
          color="black"
          fontWeight={400}
        >
          Events
        </Typography>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard
                title={event.name}
                desc={event.desc}
                image={event.image}
                startTime={event.eventDate}
                maxParticipants={event.maxParticipants}
                eventId={event.id}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default YourEventsPage;
