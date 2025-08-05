import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import NavigationBackArrow from "../components/NavigationBackArrow";
import theme from "../core/theme";
import ModalModifyCategory from "../components/ModalModifyCategory";
import { getContrastingTextColor } from "../utils/InverseColorUtils";
import { useRoute } from "@react-navigation/native";
import {
    createFeed,
    updateCategory,
    getFeedsByCategory,
    deleteFeedFromCategory,
} from "../constants/Urls";
import { useIsFocused } from "@react-navigation/native";
import DefaultButton from "../components/DefaultButton";

export default function ManageOneCategoryScreen() {
    const route = useRoute();
    const isFocused = useIsFocused();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const { categoryId, categoryName, categoryColor } = route.params;
    const [catName, setCatName] = useState(categoryName);
    const [catColor, setCatColor] = useState(categoryColor);
    const [inputUrl, setInputUrl] = useState("");
    const [textInfo, setTextInfo] = useState({ text: "", color: "#fff" });
    const [data, setData] = useState([]);

    //récupère les feeds grace à categoryId récupéreé en param
    useEffect(() => {
        isFocused &&
            getFeedsByCategory(categoryId).then((data) => setData(data.feeds));
    }, [isFocused]);

    // modification de la couleur et du nom, inverse data flow de la modal
    const handleCategoriesUpdate = async (itemColor, itemName, itemId) => {
        const res = await updateCategory(itemName, itemColor, itemId);
        const valid = res.result;
        if (valid) {
            setCatColor(itemColor);
            setCatName(itemName);
        }
    };

    // ajout d'un feed via l'input et le bouton en bas de page
    const handleAddFeed = async () => {
        if (inputUrl && categoryId) {
            const data = await createFeed(inputUrl, categoryId);
            if (data.result) {
                setInputUrl("");

                setData((prevData) => [
                    ...prevData,
                    { name: data.feedName, _id: data.feedId },
                ]);
                setTextInfo({
                    text: `Le feed ${inputUrl} a été ajouté dans la catégorie ${selectedCategory.name}`,
                    color: "green",
                });
            } else {
                setTextInfo({
                    text: data.error || "Erreur lors de l'ajout du feed",
                    color: "red",
                });
            }
        }
    };
    // delete un feed au click de  l'icone poubelle
    const handleDeleteFeed = async (feedId) => {
        const result = await deleteFeedFromCategory(categoryId, feedId);
        if (result.result) {
            const filteredData = data.filter((item) => item._id !== feedId);
            setData(filteredData);
        }
    };
    const renderFeeds = ({ item }) => {
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
                    <Text
                        style={[
                            styles.itemText,
                            { color: theme.colors.text_dark },
                        ]}
                    >
                        {item.name}
                    </Text>

                    <TouchableOpacity>
                        <FontAwesome6
                            name="trash"
                            size={18}
                            color={theme.colors.icon_red}
                            onPress={() => handleDeleteFeed(item._id)}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <NavigationBackArrow />
            <Text style={{ ...styles.title, color: catColor }}>{catName}</Text>
            <ModalModifyCategory
                modalName={"Modifier la catégorie"}
                sectionName={catName}
                sectionColor={catColor}
                sectionId={categoryId}
                modalVisible={isModalVisible}
                onValidation={handleCategoriesUpdate}
                onClose={() => setIsModalVisible(false)}
            />

            <View style={[styles.itemList, { backgroundColor: catColor }]}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        maxWidth: "100%",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setIsModalVisible((prevItem) => (prevItem = true));
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                // blanc ou noir en fonction de la couleur de fond du bouton
                                color: getContrastingTextColor(catColor),
                            }}
                        >
                            modifier le nom et la couleur
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text
                style={{
                    textAlign: "center",
                    marginTop: 15,
                    fontFamily: theme.fonts.openSansSemiBold,
                }}
            >
                Gérer vos feeds :
            </Text>
            <FlatList
                data={data}
                renderItem={renderFeeds}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                }}
            />
            <TextInput
                style={styles.input}
                placeholder="ex. https://lesnumeriques.com"
                value={inputUrl}
                onChangeText={setInputUrl}
                autoCapitalize="none"
                keyboardType="url"
            />
            <View style={{ marginBottom: 30 }}>
                <Text
                    style={{
                        color: textInfo.color,
                        fontFamily: theme.fonts.openSansSemiBold,
                        marginVertical: 20,
                        textAlign: "center",
                    }}
                >
                    {textInfo.text}
                </Text>
                <DefaultButton
                    handlePress={handleAddFeed}
                    align="center"
                    text="Ajouter le feed"
                />
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
    title: {
        fontSize: theme.fontSizes.xlarge,
        fontFamily: theme.fonts.comfortaaBold,
        color: theme.colors.text_dark,
        textAlign: "center",
        marginBottom: 25,
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
    },
    iconButton: {
        marginLeft: 25,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.icon_gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: theme.fonts.openSansRegular,
        marginTop: 10,
    },
});
