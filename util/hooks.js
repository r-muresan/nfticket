import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AlertContext } from "../components/Providers/AlertProvider";

export const getEventId = () => {
  const router = useRouter();
  const eventId = parseInt(router.query["eventId"]);

  return eventId;
};

// Providers

export const useAlert = () => {
  const { setAlert, clearAlert } = useContext(AlertContext);
  return { setAlert, clearAlert };
};
