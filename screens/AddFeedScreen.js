import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { createFeed, getCategories } from "../constants/Urls";
import ModalAddCategory from "../components/ModalAddCategory";
import NavigationBackArrow from "../components/NavigationBackArrow";
import theme from "../core/theme";
import DefaultButton from "../components/DefaultButton";

export default function AddFeedScreen() {
    const userCategories = useSelector((state) => state.user.value.categories);
    // récupération des catégories
    const [categories, setCategories] = useState(userCategories || []);

    // inputs
    const [inputUrl, setInputUrl] = useState("");
    const [selectedCategory, setSelectedCategory] = useState({
        id: null,
        name: "",
    });

    const [textInfo, setTextInfo] = useState({ text: "", color: "#fff" });
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await getCategories(userCategories);
                const cats = userCategories.map((id, i) => ({
                    _id: id,
                    name: res.categoriesList[i].name,
                    color: res.categoriesList[i].color,
                }));
                setCategories(cats);
            } catch (e) {
                console.error("Failed to load categories", e);
            }
        };
        loadCategories();
    }, [userCategories]);

    const handleAddFeed = async () => {
        const data = await createFeed(inputUrl, selectedCategory.id);

        if (!data.result || data.status === 500) {
            setTextInfo({
                text: data.error || "Erreur lors de l'ajout du feed",
                color: "red",
            });
        } else {
            setSelectedCategory({
                id: null,
                name: "",
            });
            setInputUrl("");
            setTextInfo({
                text: `Le feed ${inputUrl} a été ajouté dans la catégorie ${selectedCategory.name}`,
                color: "green",
            });
        }
    };

    const handleCreateCategory = (inputCategory) => {
        setCategories((prev) => [...prev, inputCategory]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <NavigationBackArrow />
            <Text style={styles.label}>Entrez l'URL du site web</Text>
            <TextInput
                style={styles.input}
                placeholder="ex. https://lesnumeriques.com"
                value={inputUrl}
                onChangeText={setInputUrl}
                autoCapitalize="none"
                keyboardType="url"
            />
            {categories.length !== 0 && (
                <>
                    <Text style={[styles.label, { marginTop: 30 }]}>
                        Dans quelle catégorie souhaitez-vous l'ajouter ?
                    </Text>
                    <ScrollView
                        style={styles.catList}
                        contentContainerStyle={{ paddingVertical: 4 }}
                        showsVerticalScrollIndicator
                    >
                        {categories
                            .filter((cat) => typeof cat === "object" && cat._id)
                            .map((category, i) => (
                                <TouchableOpacity
                                    key={category._id}
                                    style={[
                                        styles.catItem,
                                        i === categories.length - 1 && {
                                            borderBottomWidth: 0,
                                        },
                                        selectedCategory.name ===
                                            category.name &&
                                            styles.catItemSelected,
                                    ]}
                                    onPress={() =>
                                        setSelectedCategory({
                                            id: category._id,
                                            name: category.name,
                                        })
                                    }
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        {/* Pastille couleur */}
                                        <View
                                            style={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: 6,
                                                backgroundColor:
                                                    category.color ||
                                                    theme.colors.icon_gray,
                                                marginRight: 8,
                                            }}
                                        />
                                        <Text
                                            style={[
                                                styles.catText,
                                                selectedCategory.name ===
                                                    category.name &&
                                                    styles.catTextSelected,
                                            ]}
                                        >
                                            {category.name}
                                        </Text>
                                    </View>
                                    {selectedCategory.name ===
                                        category.name && (
                                        <FontAwesome6
                                            name="check"
                                            size={16}
                                            color={"green"}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                    </ScrollView>
                </>
            )}
            {/* Bouton pour ouvrir la modal */}
            <DefaultButton
                handlePress={() => setIsModalVisible(true)}
                text="+ Ajouter une catégorie"
                align="center"
            />
            <ModalAddCategory
                modalVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onCreate={handleCreateCategory}
            />
            <Text
                style={{
                    marginVertical: 30,
                    color: textInfo.color,
                    fontFamily: theme.fonts.openSansSemiBold,
                }}
            >
                {textInfo.text}
            </Text>
            <DefaultButton
                handlePress={handleAddFeed}
                text="Ajouter le feed"
                align="center"
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
    label: {
        fontFamily: theme.fonts.openSansRegular,
        fontSize: theme.fontSizes.medium,
        marginBottom: 8,
        color: theme.colors.text_dark,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.icon_gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: theme.fonts.openSansRegular,
    },
    catList: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: theme.colors.icon_gray,
        borderRadius: 8,
        marginVertical: 8,
    },
    catItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.icon_gray,
    },
    catItemSelected: {
        backgroundColor: theme.colors.bg_light,
        paddingHorizontal: 20,
    },
    catText: {
        width: "90%",
        fontFamily: theme.fonts.openSansRegular,
        fontSize: theme.fontSizes.medium,
    },
    catTextSelected: {
        color: theme.colors.primary,
    },
});
