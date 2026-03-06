import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

export default function RootNavigator() {
    const [isAuthed, setIsAuthed] = useState(false);

    return (
        <NavigationContainer>
            {isAuthed ? (
                <MainTabs onLogout={() => setIsAuthed(false)} />
            ) : (
                <AuthStack onLoginSuccess={() => setIsAuthed(true)} />
            )}
        </NavigationContainer>
    );
}