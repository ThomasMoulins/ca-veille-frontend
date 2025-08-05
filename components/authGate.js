// hooks/AuthGate.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "../reducers/user";
import {
    getRefreshToken,
    setAccessToken,
    saveRefreshToken,
} from "../utils/auth";
import axios from "axios";
import SplashScreen from "../screens/SplashScreen";
import AppNavigator from "../navigators/AppNavigator";
import AuthNavigator from "../navigators/AuthNavigator";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function AuthGate() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(
        (state) => state.user.value.isAuthenticated
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const refreshToken = await getRefreshToken();
            if (!refreshToken) {
                dispatch(logout());
                setLoading(false);
                return;
            }
            try {
                const res = await axios.post(`${backendUrl}/auth/refresh`, {
                    refreshToken,
                });
                setAccessToken(res.data.accessToken);
                await saveRefreshToken(res.data.refreshToken);
                dispatch(setUser(res.data.user));
            } catch {
                dispatch(logout());
            }
            setLoading(false);
        }
        checkAuth();
    }, [dispatch]);

    if (loading) return <SplashScreen />;

    return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
