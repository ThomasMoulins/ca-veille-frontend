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
import { saveRefreshToken, setAccessToken } from "../utils/auth";

export default function RegisterScreen({ navigation }) {
    const dispatch = useDispatch();

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    useEffect(() => {
        setErrorMessage(null);
    }, [username, email, password, confirmPassword]);

    const handleForm = async () => {
        const data = {
            username,
            email,
            password,
        };

        if (!username || !email || !password || !confirmPassword) {
            setErrorMessage("Tous les champs sont requis");
        } else if (password !== confirmPassword) {
            return setErrorMessage("Les mots de passe ne sont pas identiques");
        } else {
            const postData = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            const status = postData.status;

            if (status === 400) {
                return setErrorMessage("Tous les champs sont requis");
            } else if (status === 409) {
                return setErrorMessage("Cette adresse mail est inutilisable");
            } else if (status === 422) {
                return setErrorMessage(
                    "Le format de l'adresse mail est invalide"
                );
            }

            const response = await postData.json();

            dispatch(
                setUser({
                    username: response.username,
                    categories: [],
                    favoriteArticles: [],
                    followedUsers: [],
                    followers: 0,
                    isPublic: false,
                })
            );

            setAccessToken(response.accessToken);
            await saveRefreshToken(response.refreshToken);
        }
    };

    const handleLoginBtn = () => {
        setUsername(null);
        setEmail(null);
        setPassword(null);
        setConfirmPassword(null);
        setErrorMessage(null);
        navigation.navigate("Login");
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

                        <FormField
                            label={"Nom d'utilisateur"}
                            placeHolder={"Entrez votre pseudo"}
                            setInput={setUsername}
                            input={username}
                            blurOnSubmit={false}
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current?.focus()}
                        />
                        <FormField
                            ref={emailRef}
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
                            blurOnSubmit={false}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                                confirmPasswordRef.current?.focus()
                            }
                        />
                        <FormFieldWithIcon
                            ref={confirmPasswordRef}
                            label={"Confirmer le mot de passe"}
                            placeHolder={"Confirmez votre mot de passe..."}
                            setInput={setConfirmPassword}
                            input={confirmPassword}
                            autoCorrect={false}
                            returnKeyType="done"
                            onSubmitEditing={handleForm}
                        />

                        {errorMessage && (
                            <Text style={styles.danger}>{errorMessage}</Text>
                        )}

                        <DefaultButton
                            handlePress={handleForm}
                            text="S'inscrire"
                            align="center"
                        />

                        <TouchableOpacity onPress={handleLoginBtn}>
                            <Text style={styles.link}>
                                Retour à la page de connexion
                            </Text>
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
