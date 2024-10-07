"use client";

import CssBaseline from "@mui/material/CssBaseline";
// import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
// import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

// export const metadata = getMetadata({
//   title: "Scaffold-ETH 2 App",
//   description: "Built with 🏗 Scaffold-ETH 2",
// });

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* To reset default styling */}
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
