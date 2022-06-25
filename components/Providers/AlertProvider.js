import React, { useState, createContext } from "react";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export const AlertContext = createContext({
  setAlert: (alert) => {},
  clearAlert: () => {},
});

const AlertProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [visible, setVisible] = useState(false);

  const setAlert = (alert) => {
    setAlertMessage(alert);
    setVisible(true);
  };

  const clearAlert = () => {
    setVisible(false);
  };

  return (
    <AlertContext.Provider value={{ setAlert, clearAlert }}>
      {children}
      <Snackbar
        open={visible}
        autoHideDuration={6000}
        onClose={() => setVisible(null)}
      >
        <AppAlert
          onClose={() => setVisible(null)}
          severity={alertMessage?.type ?? "info"}
        >
          {alertMessage?.message}
        </AppAlert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

const AppAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default AlertProvider;
