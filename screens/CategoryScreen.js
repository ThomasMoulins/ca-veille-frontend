import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import theme from "../core/theme";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";
import ArticleCard from "../components/ArticleCard";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { getCategories } from "../constants/Urls";

export default function CategoryScreen() {
    const route = useRoute();
    const user = useSelector((state) => state.user.value);
    const isFocused = useIsFocused();
    const { categoryId } = route.params;
    const [catName, setCatName] = useState("");
    const [catColor, setCatColor] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [data, setData] = useState([]);

    useEffect(() => {
        isFocused &&
            getCategories(user).then((res) => {
                const resultArticles = res.categoriesList.filter(
                    (item) => item._id === categoryId
                );
                res.categoriesList.map((item) => {
                    if (item._id === categoryId) {
                        setCatColor(item.color);
                        setCatName(item.name);
                    }
                });
                setData(resultArticles[0].articles);
            });
    }, [isFocused]);

    const filteredData = data.filter(
        (item) =>
            item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    const renderVeilleItem = ({ item }) => (
        <ArticleCard
            _id={item._id}
            title={item.title}
            description={item.description}
            image={item.media}
            category={catName}
            categoryColor={catColor}
            defaultMedia={item.defaultMedia}
            date={item.date}
            url={item.url}
            author={item.author}
            isFavorite={user.favoriteArticles.includes(item._id)}
            showDate={true}
        />
    );

    return (
        // <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.container}>
            <Header
                title={catName}
                colorText={catColor}
                inputSearch={searchValue}
                setInputSearch={setSearchValue}
                haveNavigationBackArrow={true}
                categoryId={categoryId}
            />
            <View
                style={{
                    backgroundColor: theme.colors.bg_gray,
                    flex: 1,
                }}
            >
                <FlatList
                    data={filteredData}
                    renderItem={renderVeilleItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                    }}
                    ListEmptyComponent={
                        <Text
                            style={{
                                textAlign: "center",
                                marginTop: 50,
                                color: theme.colors.text_dark,
                            }}
                        >
                            Aucun article trouvé.
                        </Text>
                    }
                />
            </View>
        </View>
        // {/* </SafeAreaView> */}
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg_White,
    },
});
