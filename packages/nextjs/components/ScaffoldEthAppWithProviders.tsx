"use client";

import { useContext, useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider, useAccount } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { UserProfileContext } from "~~/contexts/UserProfile";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { TUserProfile } from "~~/types/spotlight";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();
  const { address: connectedAddress } = useAccount();
  const { setUserProfile } = useContext(UserProfileContext);

  const { data: isRegistered } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "isRegistered",
    args: [connectedAddress],
    watch: true,
  });

  const { data: userProfile } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [connectedAddress],
    watch: true,
  }) as { data: TUserProfile };

  useEffect(() => {
    if (isRegistered === undefined) {
      return;
    }

    if (isRegistered) {
      setUserProfile(userProfile);
      console.log(userProfile);
    } else {
      setUserProfile({ username: "", reputation: BigInt(0) });
    }
  }, [isRegistered, userProfile, setUserProfile]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<TUserProfile>();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar />
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
        >
          <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
            <ScaffoldEthApp>{children}</ScaffoldEthApp>
          </UserProfileContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
