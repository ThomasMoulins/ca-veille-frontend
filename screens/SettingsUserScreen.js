import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Switch,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBackArrow from "../components/NavigationBackArrow";
import theme from "../core/theme";
import {
    logout,
    toggleIsPublicReducer,
    updateUsername,
} from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { deleteUser, getEmail, toggleIsPublic } from "../constants/Urls";

export default function SettingsUserScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector((state) => state.user.value);
    const [email, setEmail] = useState("");
    const [isPublic, setIsPublic] = useState(user.isPublic);
    const [inputVisible, setInputVisible] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                setEmail(await getEmail(user.token));
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération de l'email :",
                    error
                );
            }
        };

        fetchEmail();
    }, [user.token]);

    const toggleSwitch = async () => {
        try {
            setIsPublic(await toggleIsPublic(user.token));
            dispatch(toggleIsPublicReducer(!isPublic));
        } catch (error) {
            console.error("Erreur mise à jour visibilité :", error);
        }
    };

    const handleDisconnect = () => {
        Alert.alert(
            "Confirmation de déconnexion",
            "Voulez-vous vous déconnecter ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Se déconnecter",
                    onPress: () => {
                        dispatch(logout());
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "Login" }],
                        });
                    },
                    style: "destructive",
                },
            ],
            {
                cancelable: true,
            }
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Confirmation de suppression",
            "Voulez-vous supprimer votre compte ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer mon compte",
                    onPress: async () => {
                        const result = await deleteUser(user.token);
                        if (result) {
                            dispatch(logout());
                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Register" }],
                            });
                        }
                    },
                    style: "destructive",
                },
            ],
            {
                cancelable: true,
            }
        );
    };

    const handleIsInputVisible = () => {
        setInputVisible((value) => !value);
    };
    const handleCLick = async () => {
        console.log("clicked");
        const postUsername = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/users`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ username, token: user.token }),
            }
        );
        const res = await postUsername.json();
        dispatch(updateUsername(res.data));
        setUsername("");
        setInputVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <NavigationBackArrow />
            <View style={styles.titleContainer}>
                <FontAwesome6
                    name="user"
                    size={32}
                    color={theme.colors.text_dark}
                />
                <Text style={styles.title}>Paramètres utilisateur</Text>
            </View>
            <View style={styles.textContainer}>
                <View style={styles.gap}>
                    <View style={styles.row}>
                        <Text style={styles.text}>Nom : {user.username}</Text>
                        <TouchableOpacity onPress={handleIsInputVisible}>
                            <AntDesign name="edit" size={18} />
                        </TouchableOpacity>
                    </View>
                    {inputVisible && (
                        <View style={styles.row}>
                            <TextInput
                                style={styles.updateUsername}
                                placeholder="Entrez votre nouveau nom..."
                                onChangeText={(value) => setUsername(value)}
                            />
                            <Text style={styles.btn} onPress={handleCLick}>
                                Valider
                            </Text>
                        </View>
                    )}
                    <Text style={styles.text}>Email : {email}</Text>
                </View>
                <View style={styles.switchContainer}>
                    <Text style={styles.text}>Profil public</Text>
                    <Switch
                        thumbColor={
                            isPublic ? theme.colors.blue : theme.colors.bg_gray
                        }
                        ios_backgroundColor={theme.colors.gray_light}
                        onValueChange={toggleSwitch}
                        value={isPublic}
                    />
                </View>
                <TouchableOpacity onPress={handleDisconnect}>
                    <Text style={[styles.text, styles.redText]}>
                        Se déconnecter
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteAccount}>
                    <Text style={[styles.text, styles.redText]}>
                        Supprimer le compte
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg_White,
        paddingHorizontal: 32,
    },
    titleContainer: {
        flexDirection: "row",
        gap: 20,
        marginBottom: 40,
        alignItems: "flex-end",
    },
    title: {
        fontFamily: theme.fonts.comfortaaBold,
        fontSize: theme.fontSizes.header,
    },
    textContainer: {
        gap: 60,
    },
    text: {
        fontFamily: theme.fonts.comfortaaSemiBold,
        fontSize: theme.fontSizes.medium,
    },
    redText: {
        fontFamily: theme.fonts.comfortaaBold,
        color: theme.colors.red,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    updateUsername: {
        fontFamily: theme.fonts.comfortaaSemiBold,
        fontSize: theme.fontSizes.medium,
    },
    btn: {
        fontFamily: theme.fonts.comfortaaSemiBold,
        fontSize: theme.fontSizes.medium,
    },
    gap: {
        gap: 20,
    },
});
