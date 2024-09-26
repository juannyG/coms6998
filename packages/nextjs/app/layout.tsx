import "@rainbow-me/rainbowkit/styles.css";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { SpotlightAppWithProviders } from "~~/components/spotlight/SpotlightWithProviders";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Spotlight App",
  description: "Built with 🏗 Scaffold-ETH 2",
});

const SpotlightApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <SpotlightAppWithProviders>{children}</SpotlightAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default SpotlightApp;
