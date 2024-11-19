"use client";

import { useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider, useAccount } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { PaywallSupportContext } from "~~/contexts/PaywallSupport";
import { UserProfileContext } from "~~/contexts/UserProfile";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { TUserProfile } from "~~/types/spotlight";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();
  const { address: connectedAddress } = useAccount();
  const [userProfile, setUserProfile] = useState<TUserProfile>();
  const [paywallSupported, setPaywallSupported] = useState(false);

  const { data: isRegistered } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "isRegistered",
    args: [connectedAddress],
    watch: true,
  });

  const { data: readUserProfile, refetch: refetchProfile } = useScaffoldReadContract({
    contractName: "Spotlight",
    functionName: "getProfile",
    args: [connectedAddress],
    watch: true,
  });

  useEffect(() => {
    if (typeof window !== "object") {
      return;
    }

    const checkIfEncryptionSupported = async () => {
      try {
        const ethAccounts = await window.ethereum?.request({
          method: "eth_accounts",
          params: [],
        });

        // This checks if the metamask account is ACTUALLY the account being used in Spotlight
        // (i.e. you can have MetaMask installed, but you're using a burner wallet/ledger/etc)
        // We need to normalize the account addresses to make sure we can compare them
        if (ethAccounts?.length > 0 && ethAccounts[0].toLowerCase() == connectedAddress?.toLowerCase()) {
          setPaywallSupported(true);
        } else {
          setPaywallSupported(false);
        }
      } catch {
        setPaywallSupported(false);
      }
    };

    checkIfEncryptionSupported().catch(err => console.log(err));
  }, [connectedAddress, setPaywallSupported]);

  useEffect(() => {
    if (isRegistered === undefined) {
      return;
    }

    if (isRegistered) {
      setUserProfile(readUserProfile);
      console.log(readUserProfile);
    } else {
      setUserProfile({ username: "", reputation: BigInt(0), avatarCID: "" });
    }
  }, [isRegistered, readUserProfile, setUserProfile]);

  return (
    <>
      <UserProfileContext.Provider value={{ userProfile, setUserProfile, refetchProfile }}>
        <PaywallSupportContext.Provider value={{ paywallSupported, setPaywallSupported }}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="relative flex flex-col flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </PaywallSupportContext.Provider>
      </UserProfileContext.Provider>
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
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
