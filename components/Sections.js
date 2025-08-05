import { View, FlatList, Text } from "react-native";
import theme from "../core/theme";
import ArticlesSection from "../components/ArticlesSection";

export default function Sections({ data, searchText, screen }) {
    const renderSectionItem = ({ item }) => (
        <ArticlesSection articlesArray={item} screen={screen} />
    );

    // je filtre sur data (catégories ou utilisateurs)
    const filteredData = data
        ?.filter(
            (
                cat //1ère condition !
            ) =>
                (cat.name || cat.username) // nom de la cat ou nom de l'utilisateur
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                cat.articles.some(
                    // ou 2ème condition
                    (article) =>
                        article.title
                            .toLowerCase()
                            .includes(searchText.toLowerCase()) || // au moins un article a un titre ou une description qui matche
                        article.description
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                )
        )
        .map((cat) => {
            //je tranforme chaque objet filtré pour l'affichage de la liste
            const nameMatches = (cat.name || cat.username) // checke si le nom de la cat ou de l'utilisateur matche la recherche
                .toLowerCase()
                .includes(searchText.toLowerCase());
            return {
                _id: cat._id,
                name: cat.name || cat.username,
                color: cat.color || theme.colors.text_dark,
                articles: nameMatches
                    ? cat.articles // si le nom de la cat ou de l'utilisateur matche la recherche : j'affiche tous les articles de cette cat ou utilisateur
                    : cat.articles.filter(
                          //sinon j'affiche juste les articles dont le titre ou la description matche
                          (article) =>
                              article.title
                                  .toLowerCase()
                                  .includes(searchText.toLowerCase()) ||
                              article.description
                                  .toLowerCase()
                                  .includes(searchText.toLowerCase())
                      ),
            };
        });
    // check if the category has articles
    const dataWithArticle = filteredData?.filter(
        (cat) => cat.articles.length > 0
    );
    return (
        <View
            style={{
                backgroundColor: theme.colors.bg_gray,
                flex: 1,
            }}
        >
            <FlatList
                data={dataWithArticle}
                renderItem={renderSectionItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{
                    paddingLeft: 16,
                    paddingBottom: 16,
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
    );
}
