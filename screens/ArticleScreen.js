import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,
    ScrollView,
} from "react-native";
import theme from "../core/theme";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import truncate from "../utils/truncate";
import { getDomain } from "../utils/getDomain";

export default function ArticleScreen() {
    const route = useRoute();
    // articlesId is the id of the all the articles of the category sort by date
    const {
        articleId,
        title,
        description,
        sectionName,
        categoryColor,
        media,
        defaultMedia,
        date,
        url,
        author,
    } = route.params;
    // const isFavorite = value.isFavorite || false;

    const truncatedCategoryName = truncate(sectionName, 40);
    const domain = getDomain(url);
    return (
        <View style={styles.container}>
            <Header articleId={articleId} />
            <View
                style={{
                    backgroundColor: theme.colors.bg_gray,
                    height: "100%",
                }}
            >
                <View style={styles.card}>
                    <View style={styles.topRow}>
                        <Text
                            style={[styles.category, { color: categoryColor }]}
                        >
                            {truncatedCategoryName}
                        </Text>
                        <TouchableOpacity
                            style={styles.linkBtn}
                            onPress={() => {
                                Linking.openURL(url);
                            }}
                        >
                            <Text
                                style={[
                                    styles.textLink,
                                    { color: categoryColor },
                                ]}
                            >
                                    {domain}
                            </Text>
                                <Feather
                                    name="external-link"
                                size={24}
                                color={categoryColor}
                                    style={{ marginTop: -2 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        style={{ maxHeight: "93%" }}
                        showsVerticalScrollIndicator={true}
                    >
                        {(media || defaultMedia) && (
                            <Image
                                source={{ uri: media || defaultMedia }}
                                style={{
                                    ...styles.image,
                                    resizeMode: media ? "cover" : "contain",
                                }}
                            />
                        )}

                        <Text style={styles.date}>
                            date de l'article :{" "}
                            {new Date(date).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                        <Text style={styles.articleTitle}>{title}</Text>
                        <Text style={styles.articleDesc}>{description}</Text>

                        <Text style={styles.date}>auteur : {author}</Text>
                    </ScrollView>
                </View>
                {/* <TouchableOpacity style={styles.similar}>
                <Text style={styles.similarText}>Voir des articles similaires</Text>
            </TouchableOpacity>  A voir à la fin si on laisse */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg_White,
    },
    card: {
        backgroundColor: theme.colors.bg_White,
        borderRadius: 18,
        padding: 18,
        marginHorizontal: 10,
        marginVertical: 25,
        height: "82%",
        width: "95%",
        shadowColor: theme.colors.text_dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
    category: {
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fonts.openSansSemiBold,
        width: "50%",
    },
    linkBtn: {
        flexDirection: "row",
    },
    textLink: {
        marginRight: 2,
        fontFamily: theme.fonts.openSansRegular,
        fontSize: theme.fontSizes.medium,
        color: theme.colors.text_dark,
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 10,
        marginBottom: 20,
    },
    date: {
        fontSize: theme.fontSizes.small,
        fontFamily: theme.fonts.openSansRegular,
        color: theme.colors.text_dark,
        marginVertical: 5,
    },
    articleTitle: {
        fontFamily: theme.fonts.openSansSemiBold,
        fontSize: theme.fontSizes.large,
        color: theme.colors.text_dark,
        marginVertical: 5,
    },
    articleDesc: {
        fontSize: theme.fontSizes.small,
        fontFamily: theme.fonts.openSansRegular,
        color: theme.colors.text_dark,
        marginVertical: 5,
    },
    // similar: {
    //     backgroundColor: theme.colors.bg_White,
    //     borderRadius: 18,
    //     shadowColor: theme.colors.text_dark,
    //     shadowOffset: { width: 0, height: 4 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 10,
    //     elevation: 3,
    //     padding: 18,
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    // similarText: {
    //     fontSize: theme.fontSizes.small,
    //     fontFamily: theme.fonts.openSansRegular,
    //     color: theme.colors.text_dark,
    // }
});
