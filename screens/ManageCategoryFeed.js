import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    TextInput,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import NavigationBackArrow from "../components/NavigationBackArrow";
import {
    getFeedsByCategory,
    createFeed,
    deleteFeedFromCategory,
} from "../constants/Urls";
import { useIsFocused } from "@react-navigation/native";
import theme from "../core/theme";
import DefaultButton from "../components/DefaultButton";

export default function ManageCategoryFeed() {
    const route = useRoute();
    const { name, color, id } = route.params;
    const isFocused = useIsFocused();
    const [textInfo, setTextInfo] = useState({ text: "", color: "#fff" });
    const [data, setData] = useState([]);
    const [inputUrl, setInputUrl] = useState("");

    useEffect(() => {
        isFocused && getFeedsByCategory(id).then((data) => setData(data.feeds));
    }, [isFocused, textInfo]);

    const handleAddFeed = async () => {
        const data = await createFeed(inputUrl, id);

        if (!data.result || data.status === 500) {
            setTextInfo({
                text: data.error || "Erreur lors de l'ajout du feed",
                color: "red",
            });
        } else {
            setData((prevData) => [
                ...prevData,
                { name: data.feedName, _id: data.feedId },
            ]);
            setInputUrl("");
            setTextInfo({
                text: `Le feed ${inputUrl} a été créer dans la catégorie ${name}`,
                color: "green",
            });
        }
    };

    const handleDeleteFeed = async (feedId) => {
        const result = await deleteFeedFromCategory(id, feedId);
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
            <Text style={styles.title}>
                Gérer vos feeds pour <Text style={{ color }}>{name}</Text>
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
            <View style={{ marginVertical: 25 }}>
                <Text
                    style={{
                        marginBottom: 25,
                        color: textInfo.color,
                        fontFamily: theme.fonts.openSansSemiBold,
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
    input: {
        borderWidth: 1,
        borderColor: theme.colors.icon_gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: theme.fonts.openSansRegular,
    },
    button: {
        marginTop: 12,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: theme.colors.blue,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
});
