import React, { useState } from "react";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

export default function RootNavigator() {
    const [isAuthed, setIsAuthed] = useState(false);

    return isAuthed ? (
        <MainTabs onLogout={() => setIsAuthed(false)} />
    ) : (
        <AuthStack onLoginSuccess={() => setIsAuthed(true)} />
    );
}