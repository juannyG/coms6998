import { createContext } from "react";

export type TUserProfile = {
  username: string;
};

interface IUserProfileContext {
  userProfile: TUserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<TUserProfile>>;
}
export const UserProfileContext = createContext<IUserProfileContext>({
  userProfile: {
    username: "",
  },
  setUserProfile: () => {
    return null;
  },
});
