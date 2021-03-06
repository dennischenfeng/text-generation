import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#987554',
    },
  },

  typography: {
    "fontFamily": `"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif`
   }
});

export default theme;