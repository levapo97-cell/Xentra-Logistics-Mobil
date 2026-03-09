import React, { createContext, useContext, useState, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthContextType = {
    isAuthed: boolean;
    user: UserInfo | null;
    login: (user: UserInfo) => void;
    logout: () => void;
};

export type UserInfo = {
    id: string;
    name: string;
    email: string;
    role?: string;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserInfo | null>(null);

    const login = (userData: UserInfo) => setUser(userData);
    const logout = () => setUser(null);

    return (
        <AuthContext.Provider
            value={{
                isAuthed: user !== null,
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    }
    return ctx;
}
