import React from "react";
import { AuthProvider } from "../context/AuthContext";
import UserProfile from "./UserProfile";

const UserProfileIsland: React.FC = () => (
  <AuthProvider>
    <UserProfile />
  </AuthProvider>
);

export default UserProfileIsland;