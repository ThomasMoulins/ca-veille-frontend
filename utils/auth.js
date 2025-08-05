import * as SecureStore from "expo-secure-store";
import axios from "axios";

export async function saveRefreshToken(token) {
    await SecureStore.setItemAsync("refreshToken", token);
}

export async function getRefreshToken() {
    return await SecureStore.getItemAsync("refreshToken");
}

export async function deleteRefreshToken() {
    await SecureStore.deleteItemAsync("refreshToken");
}

export function setAccessToken(token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
