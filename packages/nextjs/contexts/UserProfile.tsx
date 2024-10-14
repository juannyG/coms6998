import { createContext } from "react";

export type TUserProfile = {
  username: string | undefined;
  isRegistered: boolean | undefined;
};

interface IUserProfileContext {
  userProfile: TUserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<TUserProfile>>;
}
export const UserProfileContext = createContext<IUserProfileContext>({
  userProfile: {
    username: undefined,
    isRegistered: undefined,
  },
  setUserProfile: () => {
    return null;
  },
});
