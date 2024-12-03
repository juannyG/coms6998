import { defineChain } from "viem";

// Spotlight Hosted Chain
export const spotlightHosted = defineChain({
  id: 31337,
  name: "Spotlight Hosted",
  nativeCurrency: { name: "Spotlight Hosted", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://35.208.181.51:9545/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Spotlight Explorer",
      url: "https://35.208.181.51/blockexplorer",
    },
  },
});
