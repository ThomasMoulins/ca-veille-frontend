import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import NavigationBackArrow from "../components/NavigationBackArrow";
import theme from "../core/theme";
import { useEffect, useState } from "react";
import {
    deleteFeedFromCategory,
    getAllFeedsWithCategories,
} from "../constants/Urls";
import { useSelector } from "react-redux";

export default function ManageFeedsScreen() {
    const categories = useSelector((state) => state.user.value.categories);
    const [feeds, setFeeds] = useState([]);
    const [selectedFeed, setSelectedFeed] = useState({
        id: null,
        name: "",
        catId: null,
        catName: "",
    });

    useEffect(() => {
        const getAllFeeds = async () => {
            let tempFeedsList = [];
            const res = await getAllFeedsWithCategories();
            if (res.result) {
                for (let category of res.categories) {
                    for (let feed of category.feeds) {
                        tempFeedsList.push({
                            id: feed._id,
                            name: feed.name,
                            catId: category._id,
                            catName: category.name,
                            catColor: category.color,
                        });
                    }
                }
            }
            setFeeds(tempFeedsList);
        };
        getAllFeeds();
    }, []);

    const handleDelete = async () => {
        const res = await deleteFeedFromCategory(
            selectedFeed.catId,
            selectedFeed.id
        );

        if (res.result) {
            setFeeds((prevFeeds) =>
                prevFeeds.filter(
                    (feed) =>
                        feed.id !== selectedFeed.id ||
                        feed.catId !== selectedFeed.catId
                )
            );

            setSelectedFeed({
                id: null,
                name: "",
                catId: null,
                catName: "",
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <NavigationBackArrow />
            <ScrollView
                style={styles.catList}
                contentContainerStyle={{ paddingVertical: 4 }}
                showsVerticalScrollIndicator
            >
                {feeds.map((feed, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.catItem,
                                i === categories.length - 1 && {
                                    borderBottomWidth: 0,
                                },
                                selectedFeed.id === feed.id &&
                                    styles.catItemSelected,
                            ]}
                            onPress={() =>
                                setSelectedFeed({
                                    id: feed.id,
                                    name: feed.name,
                                    catId: feed.catId,
                                    catName: feed.catName,
                                })
                            }
                        >
                            <Text style={{ color: feed.catColor }}>
                                {feed.name} - {feed.catName}
                            </Text>
                            {selectedFeed.id === feed.id && (
                                <FontAwesome6
                                    name="check"
                                    size={16}
                                    color={"green"}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            {selectedFeed.name && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                >
                    <Text style={{ color: theme.colors.text_light }}>
                        Supprimer {selectedFeed.name} de {selectedFeed.catName}
                    </Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg_White,
        paddingHorizontal: 32,
    },
    catList: {
        maxHeight: 500,
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
    deleteButton: {
        backgroundColor: theme.colors.red,
        color: theme.colors.text_light,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignSelf: "center",
    },
});
