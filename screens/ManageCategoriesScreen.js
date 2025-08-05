import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import NavigationBackArrow from "../components/NavigationBackArrow";
import theme from "../core/theme";
import ModalModifyCategory from "../components/ModalModifyCategory";
import { useNavigation } from "@react-navigation/native";
import {
    getCategories,
    updateCategory,
    deleteCategory,
} from "../constants/Urls";
import { deletCategory } from "../reducers/user";

export default function ManageCategoriesScreen() {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [nameCliked, setNameClicked] = useState("");
    const [colorCliked, setColorCliked] = useState("");
    const [idClicked, setIdClicked] = useState("");
    const userCategories = useSelector((state) => state.user.value.categories);
    const dispatch = useDispatch();
    useEffect(() => {
        getCategories(userCategories).then((res) =>
            setData(
                res.categoriesList.map((item) => {
                    return {
                        name: item.name,
                        color: item.color,
                        _id: item._id,
                    };
                })
            )
        );
    }, [userCategories]);

    const handleCategoriesUpdate = async (itemColor, itemName, itemId) => {
        let valid = false;
        const updated = await Promise.all(
            data.map(async (item) => {
                if (item._id === itemId) {
                    const res = await updateCategory(
                        itemName,
                        itemColor,
                        itemId
                    );
                    valid = res.result;
                    return {
                        ...item,
                        name: itemName,
                        color: itemColor,
                    };
                }
                return item;
            })
        );

        if (valid) {
            setData(updated);
        }
        return valid;
    };

    const handelDeleteCategory = (name, id) => {
        Alert.alert(
            "Confirmation",
            `Voulez-vous supprimer la catégorie ${name} ?`,
            [
                {
                    text: "Annuler",
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        const res = await deleteCategory(id);
                        if (res.result) {
                            dispatch(deletCategory(id));
                            setData((OldValue) =>
                                OldValue.filter((item) => item._id !== id)
                            );
                        } else {
                            alert(
                                "Erreur lors de la suppression de la catégorie"
                            );
                        }
                    },
                },
            ]
        );
    };

    const handleManageFeed = (name, color, id) => {
        navigation.navigate("ManageCategoryFeed", {
            name,
            color,
            id,
        });
    };

    const renderCategory = ({ item }) => {
        return (
            <View style={[styles.itemList]}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        maxWidth: "100%",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setNameClicked(
                                (prevItem) => (prevItem = item.name)
                            );
                            setColorCliked(
                                (prevItem) => (prevItem = item.color)
                            );
                            setIdClicked((prevItem) => (prevItem = item._id));
                            setIsModalVisible((prevItem) => (prevItem = true));
                        }}
                    >
                        <Text
                            style={[
                                styles.itemText,
                                { color: item.color || theme.colors.text_dark },
                            ]}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <TouchableOpacity>
                            <FontAwesome6
                                name="trash"
                                size={18}
                                color={theme.colors.icon_red}
                                onPress={() =>
                                    handelDeleteCategory(item.name, item._id)
                                }
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <FontAwesome6
                                name="gear"
                                size={18}
                                color={theme.colors.icon_gray}
                                onPress={() =>
                                    handleManageFeed(
                                        item.name,
                                        item.color,
                                        item._id
                                    )
                                }
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <NavigationBackArrow />
            <Text style={styles.title}>Gérer vos catégories</Text>
            <ModalModifyCategory
                modalName={"Modifier la catégorie"}
                sectionName={nameCliked}
                sectionColor={colorCliked}
                sectionId={idClicked}
                modalVisible={isModalVisible}
                onValidation={handleCategoriesUpdate}
                onClose={() => setIsModalVisible(false)}
            />

            <FlatList
                data={data}
                renderItem={renderCategory}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg_White,
        paddingHorizontal: 32,
    },
    title: {
        fontSize: theme.fontSizes.large,
        fontFamily: theme.fonts.comfortaaBold,
        color: theme.colors.text_dark,
        textAlign: "center",
    },

    itemList: {
        maxHeight: 250,
        borderWidth: 1,
        borderColor: theme.colors.icon_gray,
        borderRadius: 8,
        marginTop: 10,
        padding: 10,
    },
    itemText: {
        fontFamily: theme.fonts.openSansSemiBold,
        fontSize: theme.fontSizes.medium,
        maxWidth: 260,
    },
    iconButton: {
        marginLeft: 25,
    },
});
