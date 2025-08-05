import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
} from "react-native";
import theme from "../core/theme";
import FormField from "../components/FormField";
import FormFieldWithIcon from "../components/FormFieldWithIcon";
import DefaultButton from "../components/DefaultButton";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/user";
import { setAccessToken, saveRefreshToken } from "../utils/auth";

export default function LoginScreen({ navigation }) {
    const dispatch = useDispatch();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const passwordRef = useRef(null);

    useEffect(() => {
        setErrorMessage(null);
    }, [email, password]);

    const handleForm = async () => {
        if (!email || !password) {
            setErrorMessage("Tous les champs sont requis");
        }
        const data = {
            email,
            password,
        };
        const postData = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }
        );
        // Check for response status code
        const status = postData.status;
        if (status === 400) {
            return setErrorMessage("Tous les champs sont requis");
        } else if (status === 401) {
            return setErrorMessage("Adresse mail ou mot de passe invalide");
        } else if (status === 422) {
            return setErrorMessage("Le format de l'adresse mail est invalide");
        }
        const response = await postData.json();
        const user = response.user;

        dispatch(
            setUser({
                username: user.username,
                categories: user.categories,
                favoriteArticles: user.favoriteArticles,
                followedUsers: user.followedUsers,
                followers: user.followers,
                isPublic: user.isPublic,
            })
        );

        setAccessToken(response.accessToken);
        await saveRefreshToken(response.refreshToken);
    };

    // TODO : Connect with Google
    const handleConnectBtn = () => {};

    const handleSubscribeBtn = () => {
        setEmail(null);
        setPassword(null);
        setErrorMessage(null);
        navigation.navigate("Register");
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}
                >
                    <View style={styles.inner}>
                        <Image
                            style={{ width: 320, height: 90 }}
                            resizeMode="contain"
                            source={require("../assets/images/logo_light_mode.png")}
                        />
                        <Text style={styles.heading}>
                            Ne cherchez plus, veillez.
                        </Text>
                        <View style={styles.googleConnectionContainer}>
                            <Image
                                source={require("../assets/logo_google.png")}
                                style={{ width: 25, height: 45 }}
                            />
                            <Text>Se Connecter avec Google</Text>
                        </View>
                        <FormField
                            label={"E-mail"}
                            placeHolder={"johndoe@gmail.com"}
                            setInput={setEmail}
                            input={email}
                            keyboardType="email-address"
                            blurOnSubmit={false}
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />
                        <FormFieldWithIcon
                            ref={passwordRef}
                            label={"Mot de passe"}
                            placeHolder={"Entrez votre mot de passe..."}
                            setInput={setPassword}
                            input={password}
                            autoCorrect={false}
                            returnKeyType="done"
                            onSubmitEditing={handleForm}
                        />

                        {errorMessage && (
                            <Text style={styles.danger}>{errorMessage}</Text>
                        )}

                        <DefaultButton
                            handlePress={handleForm}
                            text="Connexion"
                            align="center"
                        />

                        <TouchableOpacity onPress={handleSubscribeBtn}>
                            <Text style={styles.link}>S'inscrire</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg_White,
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    heading: {
        fontSize: theme.fontSizes.header,
        color: theme.colors.text_gray,
        fontFamily: theme.fonts.comfortaaBold,
        marginTop: 25,
        marginBottom: 60,
    },
    googleConnectionContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: theme.colors.text_gray,
        borderWidth: 1,
        borderRadius: 10,
        width: 300,
        height: 50,
        marginBottom: 50,
        gap: 20,
    },
    link: {
        padding: 20,
        fontSize: theme.fontSizes.medium,
        fontWeight: theme.fonts.openSansSemiBold,
    },
    danger: {
        marginBottom: 10,
        color: theme.colors.red,
    },
});
