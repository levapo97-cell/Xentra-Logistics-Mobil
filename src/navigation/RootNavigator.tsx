import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSession } from "../store/slices/userSlice";
import { supabase } from "../lib/supabase";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import { theme } from "../theme/theme";

export default function RootNavigator() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, loading } = useAppSelector(state => state.user);

    useEffect(() => {
        // Obtenemos sesión actual
        supabase.auth.getSession().then(({ data: { session } }) => {
            dispatch(setSession({ session, user: session?.user ?? null }));
        });

        // Escuchamos la bóveda JWT de Supabase
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            dispatch(setSession({ session, user: session?.user ?? null }));
        });

        return () => subscription.unsubscribe();
    }, [dispatch]);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return isAuthenticated ? <MainTabs /> : <AuthStack onLoginSuccess={() => {}} />;
}