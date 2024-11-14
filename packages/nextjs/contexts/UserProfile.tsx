import { createContext } from "react";
import { TUserProfile } from "~~/types/spotlight";

interface IUserProfileContext {
  userProfile: TUserProfile | undefined;
  setUserProfile: React.Dispatch<React.SetStateAction<TUserProfile | undefined>>;
  refetchProfile: () => void;
}

export const UserProfileContext = createContext<IUserProfileContext>({
  userProfile: undefined,
  setUserProfile: () => {
    return null;
  },
  refetchProfile: () => {
    return null;
  },
});
