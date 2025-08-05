import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import theme from "../core/theme";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { toggleFavoriteArticle } from "../constants/Urls";
import { toggleFavorite } from "../reducers/user";

export default function ArticleCard({
    _id,
    title,
    description,
    image,
    category,
    username,
    categoryColor,
    isFavorite,
    showDate = false,
    defaultMedia,
    date,
    url,
    author,
}) {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    //fonction pour tronquer le texte où on veut
    function truncate(text, maxLength) {
        if (!text) return "";
        return text.length > maxLength
            ? text.substring(0, maxLength - 1) + "..."
            : text;
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        const d = new Date(dateString);
        return d.toLocaleDateString("fr-FR", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }
    const handleArticlePress = () => {
        navigation.navigate("Article", {
            articleId: _id,
            title: title,
            description: description,
            sectionName: category || username,
            categoryColor: categoryColor,
            media: image,
            defaultMedia: defaultMedia,
            date: date ? date.toString() : undefined,
            url: url,
            author: author,
        });
    };

    const handleFavorite = () => {
        toggleFavoriteArticle(_id).then(
            (res) => res.result && dispatch(toggleFavorite({ articleId: _id }))
        );
    };

    const MAX_TITLE_LENGTH = 70;
    const MAX_DESCRIPTION_LENGTH = 90;

    const isTitleTooLong = title.length > MAX_TITLE_LENGTH;

    return (
        <TouchableOpacity onPress={() => handleArticlePress()}>
            <View style={styles.card}>
                <View style={styles.topBar}>
                    <View style={styles.topLeft}>
                        {showDate ? (
                            <Text style={styles.date}>{formatDate(date)}</Text>
                        ) : (
                            <Text
                                style={[
                                    styles.category,
                                    { color: categoryColor },
                                ]}
                            >
                                {category}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={() => handleFavorite()}
                        style={{ paddingVertical: 2, paddingHorizontal: 4 }}
                    >
                        <FontAwesome5
                            name="star"
                            size={22}
                            solid={isFavorite}
                            color={
                                isFavorite
                                    ? theme.colors.blue
                                    : theme.colors.blue
                            }
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <Image
                        source={{ uri: image || defaultMedia }}
                        style={{
                            ...styles.image,
                            resizeMode: image ? "cover" : "contain",
                        }}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            {truncate(title, MAX_TITLE_LENGTH)}
                        </Text>
                        {!isTitleTooLong && description && (
                            <Text style={styles.description}>
                                {truncate(description, MAX_DESCRIPTION_LENGTH)}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.bg_White,
        borderRadius: 18,
        padding: 16,
        marginBottom: 24,
        shadowColor: theme.colors.text_dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        width: "100%",
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
    },
    topLeft: {
        flex: 1,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
        margin: 5,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: theme.fontSizes.medium,
        marginBottom: 2,
        color: theme.colors.text_dark,
        fontFamily: theme.fonts.openSansSemiBold,
    },
    category: {
        fontSize: theme.fontSizes.small,
        marginBottom: 4,
        fontFamily: theme.fonts.openSansRegular,
    },
    date: {
        color: theme.colors.text_dark,
        fontFamily: theme.fonts.openSansRegular,
        fontSize: theme.fontSizes.small,
    },
    description: {
        color: theme.colors.text_gray,
        fontSize: theme.fontSizes.small,
        fontFamily: theme.fonts.openSansRegular,
    },
    textContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        marginLeft: 5,
    },
});
