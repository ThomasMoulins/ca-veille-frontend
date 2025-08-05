import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import theme from "../core/theme";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { getFavoritesArticles } from "../constants/Urls";
import ArticleCard from "../components/ArticleCard";

export default function FavorisScreen() {
    const favoriteArticles = useSelector(
        (state) => state.user.value.favoriteArticles
    );
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        getFavoritesArticles(favoriteArticles).then((res) =>
            setData(res.articles)
        );
    }, [favoriteArticles]);
    const filteredData = data?.filter(
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
            defaultMedia={item.defaultMedia}
            date={item.date}
            url={item.url}
            author={item.author}
            isFavorite={favoriteArticles.includes(item._id)}
            showDate={true}
        />
    );

    return (
        <View style={styles.container}>
            <Header
                title={"Mes articles favoris"}
                inputSearch={searchValue}
                setInputSearch={setSearchValue}
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
                                marginTop: 38,
                            }}
                        >
                            Aucun article trouvé.
                        </Text>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg_White,
    },
});
