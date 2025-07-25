import { View, StyleSheet } from "react-native";
import theme from "../core/theme";
import Header from "../components/Header";
import Sections from "../components/Sections";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getFollowedCategories } from "../constants/Urls";

export default function FollowedScreen() {
    const user = useSelector((state) => state.user.value);
    const followedUsers = user.followedUsers;
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        getFollowedCategories(user).then((res) => setData(res.userList));
    }, [followedUsers]);

    return (
        <View style={styles.container}>
            <Header
                title={"Mes abonnements"}
                inputSearch={searchValue}
                setInputSearch={setSearchValue}
            />
            <Sections
                data={data}
                searchText={searchValue}
                screen={"followed"}
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
