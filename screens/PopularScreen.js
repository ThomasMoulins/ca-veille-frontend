import { View, StyleSheet } from "react-native";
import theme from "../core/theme";
import Header from "../components/Header";
import Sections from "../components/Sections";
import { useState, useEffect } from "react";
import { getPopulars } from "../constants/Urls";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

export default function PopularScreen() {
    const token = useSelector((state) => state.user.value.token);
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const isFocused = useIsFocused();

    useEffect(() => {
        isFocused && getPopulars(token).then((res) => setData(res.users));
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
