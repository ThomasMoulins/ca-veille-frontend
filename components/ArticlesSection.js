import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from "react-native";
import theme from "../core/theme";
import ArticleSmallCard from "./ArticleSmallCard";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import truncate from "../utils/truncate";

export default function ArticlesSection({
    articlesArray: categoryObj,
    screen,
}) {
    const user = useSelector((state) => state.user.value);
    const navigation = useNavigation();
    const handleCategoryPress = () => {
        if (screen === "category") {
            navigation.navigate("Category", {
                categoryId: categoryObj._id,
                title: categoryObj.name,
                color: categoryObj.color,
                articles: categoryObj.articles,
            });
        } else if (screen === "followed") {
            navigation.navigate("OneFollowScreen", {
                userId: categoryObj._id,
                username: categoryObj.name,
                articles: categoryObj.articles,
            });
        } else if (screen === "popular") {
            navigation.navigate("OnePopular", {
                userId: categoryObj._id,
                username: categoryObj.name,
                articles: categoryObj.articles,
            });
        }
    };
    const handleArticlePress = (value) => {
        navigation.navigate("Article", {
            articleId: value._id,
            title: value.title,
            description: value.description,
            sectionName: categoryObj.name,
            categoryColor: categoryObj.color,
            media: value.media,
            defaultMedia: value.defaultMedia,
            date: value.date ? value.date.toString() : undefined,
            isFavorite: user.favoriteArticles.includes(value._id),
            url: value.url,
            author: value.author,
        });
    };

    const renderCardItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleArticlePress(item)}>
            <ArticleSmallCard article={item} />
        </TouchableOpacity>
    );

    return (
        <View
            style={{
                backgroundColor: theme.colors.bg_gray,
            }}
        >
            <TouchableOpacity onPress={() => handleCategoryPress()}>
                <Text
                    style={{
                        ...styles.sectionTitle,
                        color: categoryObj.color || theme.colors.dark,
                    }}
                >
                    {truncate(categoryObj.name, 29) + " ›"}
                </Text>
            </TouchableOpacity>
            <FlatList
                data={categoryObj.articles}
                renderItem={renderCardItem}
                keyExtractor={(item) => item._id || item.id}
                horizontal={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        color: theme.colors.primary,
        fontSize: theme.fontSizes.xlarge,
        margin: 15,
        fontFamily: theme.fonts.openSansSemiBold,
    },
});
