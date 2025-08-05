import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";
import Modal from "react-native-modal";
import theme from "../core/theme";
import { handleDeleteUserCategory } from "../constants/Urls";
import { useDispatch } from "react-redux";
import { deleteUserCategory } from "../reducers/user";

export default function ModalUpdateCategory({
    menuVisible,
    onClose,
    categoryId,
    categoryName,
    categoryColor,
}) {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        Alert.alert(
            "Confirmation",
            "Êtes-vous sûr(e) de vouloir supprimer cette catégorie ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        const response = await handleDeleteUserCategory(
                            categoryId
                        );
                        dispatch(
                            deleteUserCategory(response.foundUser.categories)
                        );
                        navigation.navigate("Catégories");
                    },
                },
            ]
        );
    };

    const handleClick = () => {
        onClose();
        navigation.navigate("ManageOneCategoryScreen", {
            categoryId,
            categoryName,
            categoryColor,
        });
    };

    return (
        <Modal
            isVisible={menuVisible}
            onBackdropPress={onClose}
            animationIn="fadeInDown"
            animationOut="slideOutUp"
            style={styles.modal}
            backdropOpacity={0.4}
        >
            <View style={styles.menuContainer}>
                <Text style={{ ...styles.username, color: categoryColor }}>
                    {categoryName}
                </Text>

                {/* Change color */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={{
                            ...styles.btnOutline,
                            borderLeftWidth: 0.6,
                        }}
                        onPress={handleClick}
                    >
                        <Text style={styles.textButton}>Gérer</Text>
                        <FontAwesome6
                            name="gear"
                            size={14}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            ...styles.btnOutline,
                            borderLeftWidth: 0.6,
                        }}
                        onPress={() => handleDelete(categoryId)}
                    >
                        <Text
                            style={{
                                ...styles.textButton,
                                color: theme.colors.icon_red,
                            }}
                        >
                            Supprimer{" "}
                        </Text>
                        <FontAwesome6
                            name="trash"
                            size={14}
                            color={theme.colors.icon_red}
                        />
                    </TouchableOpacity>
                </View>

                {/* Croix de fermeture */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <FontAwesome6 name="xmark" size={32} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-start",
        margin: 0,
    },
    menuContainer: {
        backgroundColor: theme.colors.bg_White,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingTop: 65,
        paddingHorizontal: 40,
    },
    username: {
        fontFamily: theme.fonts.comfortaaBold,
        fontSize: theme.fontSizes.large,
        marginHorizontal: "auto",
    },
    buttonRow: {
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 8,
        borderColor: theme.colors.icon_gray,
        overflow: "hidden",
        marginTop: 30,
    },
    btnOutline: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        gap: 10,
        paddingVertical: 10,
        borderColor: theme.colors.icon_gray,
    },
    textButton: {
        textAlign: "center",
        fontFamily: theme.fonts.openSansRegular,
        fontSize: theme.fontSizes.small,
    },
    link: {
        paddingVertical: 12,
    },
    icon: {
        color: theme.colors.icon_gray,
    },
    closeButton: {
        marginHorizontal: "auto",
        marginVertical: 25,
    },
});
