import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../reducers/user";
import {
    getRefreshToken,
    saveRefreshToken,
    deleteRefreshToken,
    setAccessToken,
} from "../utils/auth";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function useAxiosInterceptor() {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                // Ne pas intercepter les erreurs de /auth/refresh pour éviter la boucle
                if (error.config.url.includes("/auth/refresh")) {
                    return Promise.reject(error);
                }
                if (error.response?.status === 401) {
                    const refreshToken = await getRefreshToken();
                    if (!refreshToken) return Promise.reject(error);

                    try {
                        const res = await axios.post(
                            `${backendUrl}/auth/refresh`,
                            {
                                refreshToken,
                            }
                        );
                        setAccessToken(res.data.accessToken);
                        await saveRefreshToken(res.data.refreshToken);
                        error.config.headers[
                            "Authorization"
                        ] = `Bearer ${res.data.accessToken}`;
                        return axios(error.config);
                    } catch (e) {
                        dispatch(logout());
                        await deleteRefreshToken();
                        return Promise.reject(e);
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, [dispatch, navigation]);
}
