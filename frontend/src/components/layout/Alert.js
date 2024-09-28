import React from 'react';
import { useSelector } from 'react-redux';
import { Alert as MuiAlert, Snackbar } from '@mui/material';

const Alert = () => {
  const alerts = useSelector(state => state.alert);

  return (
    <>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={true}
          autoHideDuration={5000}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={alert.alertType}
          >
            {alert.msg}
          </MuiAlert>
        </Snackbar>
      ))}
    </>
  );
};

export default Alert;