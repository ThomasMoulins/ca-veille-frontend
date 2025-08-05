import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AreaOfInterest from "../screens/AreaOfInterestScreen";
import ArticleScreen from "../screens/ArticleScreen";
import OneFollowScreen from "../screens/OneFollowScreen";
import OnePopularScreen from "../screens/OnePopularScreen";
import CategoryScreen from "../screens/CategoryScreen";
import AddFeedScreen from "../screens/AddFeedScreen";
import ManageFeedsScreen from "../screens/ManageFeedsScreen";
import AddCategoryScreen from "../screens/AddCategoryScreen";
import ManageCategoriesScreen from "../screens/ManageCategoriesScreen";
import SettingsUserScreen from "../screens/SettingsUserScreen";
import SettingsAppScreen from "../screens/SettingsAppScreen";
import ManageCategoryFeed from "../screens/ManageCategoryFeed";
import ManageOneCategoryScreen from "../screens/ManageOneCategoryScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen from "../screens/HomeScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import PopularScreen from "../screens/PopularScreen";
import FollowedScreen from "../screens/FollowedScreen";
import FavorisScreen from "../screens/FavorisScreen";
import theme from "../core/theme";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    // marge android
    const insets = useSafeAreaInsets().bottom;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName = "";

                    if (route.name === "Accueil") {
                        iconName = "home";
                    } else if (route.name === "Catégories") {
                        iconName = "list";
                    } else if (route.name === "Populaire") {
                        iconName = "fire-alt";
                    } else if (route.name === "Suivis") {
                        iconName = "user-plus";
                    } else if (route.name === "Favoris") {
                        iconName = "star";
                    }

                    return (
                        <FontAwesome5
                            name={iconName}
                            size={25}
                            color={color}
                            style={{ marginLeft: route.name === "Suivis" && 8 }}
                        />
                    );
                },
                tabBarActiveTintColor: theme.colors.text_light,
                tabBarInactiveTintColor: theme.colors.text_gray,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.blue,
                    height: 80 + insets,
                    paddingTop: 10,
                    paddingBottom: 15 + insets,
                },
                tabBarLabelStyle: {
                    fontSize: theme.fontSizes.small,
                },
            })}
        >
            <Tab.Screen name="Accueil" component={HomeScreen} />
            <Tab.Screen name="Catégories" component={CategoriesScreen} />
            <Tab.Screen name="Populaire" component={PopularScreen} />
            <Tab.Screen name="Suivis" component={FollowedScreen} />
            <Tab.Screen name="Favoris" component={FavorisScreen} />
        </Tab.Navigator>
    );
};

export default function AppNavigator() {
    const categories = useSelector((state) => state.user.value.categories);

    // Choix dynamique de l'écran initial
    const initialRoute =
        categories.length === 0 ? "AreaOfInterest" : "TabNavigator";

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={initialRoute}
        >
            <Stack.Screen name="AreaOfInterest" component={AreaOfInterest} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="Article" component={ArticleScreen} />
            <Stack.Screen name="OneFollowScreen" component={OneFollowScreen} />
            <Stack.Screen name="OnePopular" component={OnePopularScreen} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="AddFeedScreen" component={AddFeedScreen} />
            <Stack.Screen
                name="ManageFeedsScreen"
                component={ManageFeedsScreen}
            />
            <Stack.Screen
                name="AddCategoryScreen"
                component={AddCategoryScreen}
            />
            <Stack.Screen
                name="ManageCategoriesScreen"
                component={ManageCategoriesScreen}
            />
            <Stack.Screen
                name="SettingsUserScreen"
                component={SettingsUserScreen}
            />
            <Stack.Screen
                name="SettingsAppScreen"
                component={SettingsAppScreen}
            />
            <Stack.Screen
                name="ManageCategoryFeed"
                component={ManageCategoryFeed}
            />
            <Stack.Screen
                name="ManageOneCategoryScreen"
                component={ManageOneCategoryScreen}
            />
        </Stack.Navigator>
    );
}
