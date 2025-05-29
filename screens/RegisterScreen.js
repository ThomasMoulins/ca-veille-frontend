import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
} from "react-native";
import theme from "../core/theme";
import FormField from "../components/FormField";
import FormFieldWithIcon from "../components/FormFieldWithIcon";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../reducers/user";

export default function RegisterScreen({ navigation }) {
    const dispatch = useDispatch();

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

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
            const user = response.user;

            dispatch(
                addUser({
                    username: user.username,
                    token: user.token,
                    categories: user.categories,
                    favoriteArticles: user.favoriteArticles,
                    followedUsers: user.followedUsers,
                    followers: user.followers,
                    isPublic: user.isPublic,
                })
            );
            navigation.reset({
                index: 0,
                routes: [{ name: "AreaOfInterest" }],
            });
        }
    };

    // TODO : Connect with Google
    const handleConnectWithGoogle = () => {};

    const handleLoginBtn = () => {
        //j'ai changé handleRegisterBtn par ce nom
        navigation.navigate("Login");
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("TabNavigator")}
                    >
                        <Image
                            style={{ width: 320, height: 90 }}
                            resizeMode="contain"
                            source={require("../assets/images/logo_light_mode.png")}
                        />
                    </TouchableOpacity>

                    <Text style={styles.heading}>
                        Ne cherchez plus, veillez.
                    </Text>

                    <FormField
                        label={"Nom d'utilisateur"}
                        placeHolder={"Entrez votre pseudo"}
                        setInput={setUsername}
                        input={username}
                    />
                    <FormField
                        label={"E-mail"}
                        placeHolder={"johndoe@gmail.com"}
                        setInput={setEmail}
                        input={email}
                    />
                    <FormFieldWithIcon
                        label={"Mot de passe"}
                        placeHolder={"Entrez votre mot de passe..."}
                        setInput={setPassword}
                        input={password}
                    />
                    <FormFieldWithIcon
                        label={"Confirmer le mot de passe"}
                        placeHolder={"Confirmez votre mot de passe..."}
                        setInput={setConfirmPassword}
                        input={confirmPassword}
                    />

                    {errorMessage && (
                        <Text style={styles.danger}>{errorMessage}</Text>
                    )}

                    <TouchableOpacity onPress={handleForm}>
                        <Text style={styles.btn}>S'inscrire</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLoginBtn}>
                        <Text style={styles.link}>
                            Retour à la page de connexion
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.bg_White,
    },
    heading: {
        fontSize: theme.fontSizes.header,
        textAlign: "center",
        color: theme.colors.text_gray,
        fontFamily: theme.fonts.comfortaaBold,
        marginTop: 25,
        marginBottom: 60,
    },
    form: {},
    btn: {
        color: theme.colors.bg_White,
        backgroundColor: theme.colors.blue,
        padding: 15,
        borderRadius: 30,
        width: 180,
        textAlign: "center",
        marginTop: 45,
        marginBottom: 80,
        fontFamily: theme.fonts.openSansSemiBold,
    },
    link: {
        fontSize: theme.fontSizes.medium,
        fontWeight: theme.fonts.openSansSemiBold,
    },
    danger: {
        marginTop: 20,
        textAlign: "center",
        color: "red",
    },
});
