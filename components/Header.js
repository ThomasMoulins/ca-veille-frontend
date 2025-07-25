import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    TextInput,
    Image,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    FontAwesome5,
    MaterialIcons,
    Entypo,
    Ionicons,
} from "@expo/vector-icons";
import theme from "../core/theme";
import { Keyboard } from "react-native";
import truncate from "../utils/truncate";
import MenuBurger from "./MenuBurger";
import ModalUpdateCategory from "./ModalUpdateCategory";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteFollowedUser,
    addFollowedUser,
    toggleFavoriteArticle,
} from "../constants/Urls";
import { unfollowUser, followUser, toggleFavorite } from "../reducers/user";

const Header = ({
    title,
    colorText = theme.colors.text_dark,
    inputSearch,
    setInputSearch,
    haveNavigationBackArrow = false,
    articleId = null,
    categoryId = null,
    followedUserId = null,
}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const [showMenuBurger, setShowMenuBurger] = useState(false);
    const [showModalCategory, setShowModalCategory] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isFollowed, setIsFollowed] = useState(
        user.followedUsers.includes(followedUserId)
    );
    const favorite = user.favoriteArticles.includes(articleId);

    title = truncate(title, 40);

    const handleSearch = () => {
        !haveNavigationBackArrow && setShowSearch((prev) => !prev);
        setInputSearch("");
        Keyboard.dismiss();
    };

    const handleFavorite = () => {
        toggleFavoriteArticle(articleId, user.token).then(
            (res) => res.result && dispatch(toggleFavorite({ articleId }))
        );
    };

    const handleUnfollowPress = async () => {
        Alert.alert(
            "Confirmation",
            `Voulez-vous vraiment ne plus suivre ${title} ?`,
            [
                {
                    text: "Annuler",
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        const res = await deleteFollowedUser(
                            followedUserId,
                            user.token
                        );

                        if (res.result) {
                            dispatch(unfollowUser({ userId: followedUserId }));
                            setIsFollowed(false);
                        } else {
                            alert(
                                "Erreur lors de la suppression de l'abonnement"
                            );
                        }
                    },
                },
            ]
        );
    };

    const handleFollowPress = async () => {
        const res = await addFollowedUser(followedUserId, user.token);

        if (res.result) {
            dispatch(followUser({ userId: followedUserId }));
            setIsFollowed(true);
        } else {
            alert("Erreur lors de l'ajout de l'abonnement");
        }
    };

    return (
        <SafeAreaView style={styles.headerContainer} edges={["top"]}>
            <View style={styles.header}>
                {/* Left part */}
                {haveNavigationBackArrow ? (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <FontAwesome5
                            name="arrow-left"
                            size={28}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => setShowMenuBurger(true)}>
                        <Ionicons style={styles.icon} name="menu" size={28} />
                    </TouchableOpacity>
                )}

                {/* Middle part */}
                {title && !showSearch ? (
                    <Text style={{ ...styles.title, color: colorText }}>
                        {title}
                    </Text>
                ) : !showSearch ? (
                    <Image
                        style={{ width: 180, height: 60 }}
                        resizeMode="contain"
                        source={require("../assets/images/logo_light_mode.png")}
                    />
                ) : (
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={28} style={styles.icon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Rechercher..."
                            onChangeText={setInputSearch}
                            value={inputSearch}
                            autoFocus={true}
                        />
                        <TouchableOpacity
                            onPress={handleSearch}
                            style={styles.closeButton}
                        >
                            <Ionicons
                                name="close"
                                size={24}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Right part */}
                {followedUserId && isFollowed ? (
                    <TouchableOpacity onPress={handleUnfollowPress}>
                        <MaterialIcons
                            name="person-remove"
                            size={28}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                ) : followedUserId ? (
                    <TouchableOpacity onPress={handleFollowPress}>
                        <MaterialIcons
                            name="person-add"
                            size={28}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                ) : articleId ? (
                    <TouchableOpacity onPress={handleFavorite}>
                        <FontAwesome5
                            name="star"
                            size={28}
                            solid={favorite}
                            color={
                                favorite ? theme.colors.blue : theme.colors.blue
                            }
                        />
                    </TouchableOpacity>
                ) : haveNavigationBackArrow ? (
                    <TouchableOpacity
                        onPress={() => setShowModalCategory(true)}
                    >
                        <Entypo
                            name="dots-three-vertical"
                            size={28}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                ) : (
                    !showSearch && (
                        <TouchableOpacity onPress={handleSearch}>
                            <Ionicons
                                name="search"
                                size={28}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    )
                )}
            </View>
            {/* Bottom part */}
            {haveNavigationBackArrow && (
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={28} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Rechercher..."
                            onChangeText={setInputSearch}
                            value={inputSearch}
                            autoFocus={false}
                        />

                        {inputSearch && (
                            <TouchableOpacity onPress={handleSearch}>
                                <Entypo
                                    name="cross"
                                    size={28}
                                    color={theme.colors.text_gray}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <ModalUpdateCategory
                        menuVisible={showModalCategory}
                        onClose={() => setShowModalCategory(false)}
                        categoryId={categoryId}
                        categoryName={title}
                        categoryColor={colorText}
                        token={user.token}
                    />
                </View>
            )}

            {/* Modal part */}
            <MenuBurger
                menuVisible={showMenuBurger}
                onClose={() => setShowMenuBurger(false)}
            />
        </SafeAreaView>
    );
};

export default Header;

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 25,
        backgroundColor: theme.colors.bg_White,
        ...Platform.select({
            ios: {
                shadowColor: theme.colors.text_dark,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
            },
            android: {
                elevation: 15,
            },
        }),
        zIndex: 2,
    },
    searchContainer: {
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: theme.colors.bg_White,
        zIndex: 1,
        borderWidth: 1,
        borderColor: theme.colors.icon_gray,
        borderRadius: 30,
    },
    searchInput: {
        color: theme.colors.text_dark,
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontFamily: theme.fonts.openSansRegular,
        fontSize: theme.fontSizes.medium,
    },
    searchBar: {
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        backgroundColor: theme.colors.bg_White,
        zIndex: 1,
        borderWidth: 1,
        borderColor: theme.colors.icon_gray,
        borderRadius: 30,
        paddingVertical: Platform.OS === "ios" ? 7 : 2,
        marginBottom: 15,
    },
    input: {
        color: theme.colors.text_dark,
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontFamily: theme.fonts.openSansRegular,
        fontSize: theme.fontSizes.medium,
    },
    closeButton: {
        marginLeft: 10,
    },
    header: {
        height: 80,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: theme.fontSizes.large,
        fontFamily: theme.fonts.comfortaaBold,
        width: "75%",
        textAlign: "center",
    },
    icon: {
        color: theme.colors.icon_gray,
    },
    shadow: {
        backgroundColor: theme.colors.bg_gray,
        width: "100%",
        height: 1,
        zIndex: 1,
        ...Platform.select({
            ios: {
                shadowColor: theme.colors.text_dark,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
            },
            android: {
                elevation: 15,
            },
        }),
    },
});
