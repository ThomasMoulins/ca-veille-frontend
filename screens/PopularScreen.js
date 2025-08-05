import { View, StyleSheet } from "react-native";
import theme from "../core/theme";
import Header from "../components/Header";
import Sections from "../components/Sections";
import { useState, useEffect } from "react";
import { getPopulars } from "../constants/Urls";
import { useIsFocused } from "@react-navigation/native";

export default function PopularScreen() {
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const isFocused = useIsFocused();

    useEffect(() => {
        isFocused && getPopulars().then((res) => setData(res.users));
    }, [isFocused]);
    return (
        <View style={styles.container}>
            <Header
                title={"Populaire"}
                inputSearch={searchValue}
                setInputSearch={setSearchValue}
            />
            <Sections data={data} searchText={searchValue} screen={"popular"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg_White,
    },
});
