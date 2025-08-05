import { Text, View } from "react-native";
import { useFonts } from "expo-font";
import {
    Comfortaa_600SemiBold,
    Comfortaa_700Bold,
} from "@expo-google-fonts/comfortaa";
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import user from "./reducers/user";
import useAxiosInterceptor from "./hooks/useAxiosInterceptor";
import AuthGate from "./components/authGate";

const reducers = combineReducers({ user });
const persistConfig = {
    key: "ça veille",
    storage: AsyncStorage,
};
const store = configureStore({
    reducer: persistReducer(persistConfig, reducers),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

function AxiosInterceptor() {
    useAxiosInterceptor();
    return null;
}

export default function App() {
    const [fontsLoaded] = useFonts({
        Comfortaa_600SemiBold,
        Comfortaa_700Bold,
        OpenSans_400Regular,
        OpenSans_600SemiBold,
    });

    if (!fontsLoaded) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>Chargement...</Text>
            </View>
        );
    }

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <SafeAreaProvider>
                    <NavigationContainer>
                        <AxiosInterceptor />
                        <AuthGate />
                    </NavigationContainer>
                </SafeAreaProvider>
            </PersistGate>
        </Provider>
    );
}
