import { View, ActivityIndicator, Image, StyleSheet, Text } from "react-native";
import theme from "../core/theme";

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            {/* Logo de l'app */}
            <Image
                source={require("../assets/icon.png")} // Place ton logo ici
                style={styles.logo}
                resizeMode="contain"
            />
            {/* Spinner animé */}
            <ActivityIndicator
                size="large"
                color={theme.colors.blue || "#2979ff"}
            />
            <Text style={styles.text}>Chargement...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg_White || "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        color: theme.colors.blue || "#222",
        fontFamily: theme.fonts.comfortaaBold || undefined,
    },
});
