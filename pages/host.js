import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { BACKGROUND, getSize, SECONDARY } from "../util/theme.js";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingView from "../components/LoadingView";
import Image from "next/image";
import UploadIcon from "@mui/icons-material/Upload";
import IconButton from "@mui/material/IconButton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useCreateEvent } from "../util/NFTContractInterface.js";
import Switch from "@mui/material/Switch";
import { EventCard } from "./events.js";
import { addDays } from "date-fns";

const HostPage = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [eventDate, setEventDate] = useState(addDays(new Date(), 3));
  const [eventImage, setEventImage] = useState();
  const [eventImageRaw, setEventImageRaw] = useState();
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [eventLink, setEventLink] = useState("");

  const { loading, createEvent } = useCreateEvent();

  const handleUpload = ({ target }) => {
    const file = target.files[0];
    setEventImage(file);

    var reader = new FileReader();
    reader.onload = function () {
      setEventImageRaw(reader.result);
    };
    reader.readAsDataURL(file);
  };

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
          Host an Event
        </Typography>
        <Box display="flex" gap={4} justifyContent="space-between">
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            maxWidth={400}
            width="100%"
            mt={4}
          >
            <TextField
              label="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <TextField
              label="Description Name"
              value={eventDescription}
              multiline
              minRows={3}
              maxRows={5}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <TextField
              label="Event Location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="Start Date"
                value={eventDate}
                onChange={(newValue) => {
                  setEventDate(newValue);
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Max Particpants"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              type="number"
            />
            <TextField
              label="Link (Optional)"
              value={eventLink}
              onChange={(e) => setEventLink(e.target.value)}
            />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography fontSize={textSize}>Whitelist</Typography>
              <Switch
                value={isWhitelisted}
                onChange={(e) => setIsWhitelisted(e.target.checked)}
                size="large"
              />
            </Box>

            <Button
              onClick={() =>
                createEvent(
                  eventName,
                  eventDescription,
                  eventLocation,
                  eventImage,
                  eventDate,
                  maxParticipants,
                  isWhitelisted,
                  eventLink
                )
              }
              variant="contained"
            >
              Create Event
            </Button>
          </Box>

          <Box
            width={400}
            height={400}
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {eventImageRaw ? (
              <EventCard
                image={eventImageRaw}
                title={eventName}
                desc={eventDescription}
                location={eventLocation}
                startTime={eventDate}
                maxParticipants={maxParticipants}
              />
            ) : (
              <Box textAlign="center">
                <IconButton color="primary" component="label">
                  <UploadIcon sx={{ fontSize: titleSize * 2 }} />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleUpload}
                  />
                </IconButton>
                <Typography size={subtitleSize} fontWeight={500}>
                  Upload Event Image
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HostPage;
