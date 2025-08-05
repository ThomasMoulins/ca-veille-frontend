import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import theme from "../core/theme";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCategories } from "../reducers/user";
import { createDefaultCategories } from "../constants/Urls";
import { categoriesImage } from "../constants/categoriesImage";

const defaultCategories = [
    { id: "tech", name: "tech" },
    { id: "movies", name: "cinema" },
    { id: "news", name: "news" },
    { id: "sports", name: "sport" },
    { id: "cooking", name: "cuisine" },
    { id: "science", name: "science" },
    { id: "health", name: "sante" },
    { id: "videoGames", name: "jeux vidéo" },
    { id: "music", name: "music" },
    { id: "design", name: "design" },
    { id: "performance", name: "spectacle" },
    { id: "economy", name: "économie" },
];

export default function AreaOfInterest({ navigation }) {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState([]);

    const handlepress = async () => {
        if (selected) {
            const data = await createDefaultCategories(selected);
            if (data.result) {
                dispatch(setCategories(data.categoriesID));
                navigation.reset({
                    index: 0,
                    routes: [{ name: "TabNavigator" }],
                });
            }
        }
    };

    const toggle = (name) => {
        setSelected(
            (prev) =>
                prev.includes(name)
                    ? prev.filter((n) => n !== name) // désélectionne
                    : [...prev, name] // ajoute
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Quels sont vos centres d'intérêt ?</Text>
            <View style={styles.categoriesContainer}>
                {defaultCategories.map((category) => {
                    const isSelected = selected.includes(category.id);
                    return (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => toggle(category.id)}
                            style={[
                                styles.categoryCard,
                                isSelected && styles.categoryCardSelected,
                            ]}
                        >
                            <ImageBackground
                                source={categoriesImage[category.id]}
                                style={styles.categoryImage}
                                imageStyle={{ borderRadius: 12 }}
                                resizeMode="cover"
                            >
                                <View style={styles.overlay} />
                                <Text style={styles.categoryName}>
                                    {category.name}
                                </Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <TouchableOpacity
                style={[
                    styles.button,
                    selected.length === 0 && styles.disabledButton,
                ]}
                onPress={handlepress}
                disabled={selected.length === 0}
            >
                <Text style={styles.textButton}>
                    {selected.length === 0
                        ? "Aucune catégorie sélectionnée"
                        : "Continuer"}
                </Text>
                {selected.length !== 0 && (
                    <FontAwesome6
                        name="arrow-right"
                        size={18}
                        color={theme.colors.text_light}
                    />
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 30,
    },
    title: {
        fontFamily: theme.fonts.comfortaaBold,
        fontSize: theme.fontSizes.xlarge,
        marginTop: 20,
        marginBottom: 40,
    },
    categoriesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
    },
    categoryCard: {
        width: 95,
        height: 95,
        borderRadius: 12,
        overflow: "hidden",
    },
    categoryCardSelected: {
        borderRadius: 20,
        borderWidth: 5,
        padding: 5,
        borderColor: theme.colors.blue,
    },
    categoryImage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 12,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    categoryName: {
        position: "absolute",
        color: theme.colors.text_light,
        fontFamily: theme.fonts.openSansSemiBold,
        fontSize: theme.fontSizes.small,
        textTransform: "capitalize",
    },
    button: {
        padding: 20,
        backgroundColor: theme.colors.blue,
        borderRadius: 100,
        alignSelf: "flex-end",
        marginTop: "auto",
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    disabledButton: {
        backgroundColor: theme.colors.icon_gray,
    },
    textButton: {
        color: theme.colors.text_light,
        fontFamily: theme.fonts.comfortaaSemiBold,
        fontSize: theme.fontSizes.medium,
    },
});
