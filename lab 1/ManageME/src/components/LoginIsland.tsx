import React from "react";
import { AuthProvider } from "../context/AuthContext";
import LoginForm from "./LoginForm";

const LoginIsland: React.FC = () => (
    <AuthProvider>
        <LoginForm/>
    </AuthProvider>
);

export default LoginIsland;

