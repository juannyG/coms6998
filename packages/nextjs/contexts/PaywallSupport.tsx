import { createContext } from "react";

interface IPaywallSupportContext {
  paywallSupported: boolean;
  setPaywallSupported: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PaywallSupportContext = createContext<IPaywallSupportContext>({
  paywallSupported: false,
  setPaywallSupported: () => {
    return false;
  },
});
