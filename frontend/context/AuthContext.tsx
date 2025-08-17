"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { cookies } from "next/headers";

interface User {
    token: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthContextProps {
    user: User | null;
    fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/auth");
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user, fetchUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
