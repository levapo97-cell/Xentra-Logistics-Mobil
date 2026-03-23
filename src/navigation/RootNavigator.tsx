import React from "react";
import { useAuth } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

export default function RootNavigator() {
    const { isAuthed, login, logout } = useAuth();

    return isAuthed ? (
        <MainTabs />
    ) : (
        <AuthStack
            onLoginSuccess={() =>
                login({ id: "1", name: "Usuario", email: "user@xentra.com" })
            }
        />
    );
}