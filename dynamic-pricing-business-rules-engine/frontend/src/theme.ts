import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#4F46E5",
      light: "#6366F1",
      dark: "#3730A3",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#0EA5E9",
    },

    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },

    success: {
      main: "#16A34A",
    },

    warning: {
      main: "#F59E0B",
    },

    error: {
      main: "#DC2626",
    },

    divider: "#E2E8F0",
  },

  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "sans-serif",
    ].join(","),

    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingLeft: 18,
          paddingRight: 18,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
