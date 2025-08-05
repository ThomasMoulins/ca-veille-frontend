import { View, StyleSheet } from "react-native";
import theme from "../core/theme";
import Header from "../components/Header";
import Sections from "../components/Sections";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getCategories } from "../constants/Urls";
import { useIsFocused } from "@react-navigation/native";

export default function CategoriesScreen() {
    const userCategories = useSelector((state) => state.user.value.categories);
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const isFocused = useIsFocused();

    useEffect(() => {
        isFocused &&
            getCategories(userCategories).then((res) =>
                setData(res.categoriesList)
            );
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <Header
                title={"Mes catégories"}
                inputSearch={searchValue}
                setInputSearch={setSearchValue}
            />
            <Sections
                data={data}
                searchText={searchValue}
                screen={"category"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg_White,
    },
});
