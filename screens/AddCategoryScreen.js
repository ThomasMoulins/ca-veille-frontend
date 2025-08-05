import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import ColorPicker from "react-native-wheel-color-picker";
import { getContrastingTextColor } from "../utils/InverseColorUtils";
import { addCategory } from "../reducers/user";
import { createCategory } from "../constants/Urls";
import NavigationBackArrow from "../components/NavigationBackArrow";
import theme from "../core/theme";

export default function AddCategoryScreen() {
    const [inputCategory, setInputCategory] = useState("");
    const [inputColor, setInputColor] = useState(theme.colors.blue);
    const [textError, setTextError] = useState("");
    const dispatch = useDispatch();

    const handleAddCategory = async () => {
        const trimmed = inputCategory.trim();
        if (!trimmed) return setTextError("Rentrer un nom à la catégorie");
        const data = await createCategory(trimmed, inputColor);

        if (data.result) {
            setTextError("");
            setInputCategory("");
            setInputColor(theme.colors.blue);
            dispatch(addCategory(data.category._id));
        } else {
            setTextError("Cette catégorie existe déjà");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <NavigationBackArrow />
            <Text style={styles.title}>Nouvelle catégorie</Text>

            {/* Nom de la catégorie */}
            <TextInput
                style={styles.input}
                placeholder="Nom de la catégorie"
                value={inputCategory}
                onChangeText={setInputCategory}
            />

            {/* Color Picker */}
            <View style={styles.pickerWrapper}>
                <ColorPicker
                    color={inputColor}
                    onColorChange={setInputColor}
                    thumbSize={30}
                    sliderSize={40}
                    gapSize={20}
                    noSnap={true}
                    row={false}
                    shadeSliderThumb={true}
                />
            </View>

            <Text style={styles.textError}>{textError}</Text>

            {/* Boutons Valider */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: inputColor }]}
                onPress={handleAddCategory}
            >
                <Text
                    style={[
                        styles.buttonText,
                        {
                            color: getContrastingTextColor(inputColor),
                        },
                    ]}
                >
                    Valider
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bg_White,
        paddingHorizontal: 32,
    },
    title: {
        fontSize: theme.fontSizes.large,
        fontFamily: theme.fonts.comfortaaBold,
        textAlign: "center",
    },
    pickerWrapper: {
        height: 450,
        borderRadius: 12,
        marginBottom: 32,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.icon_gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginTop: 16,
        fontFamily: theme.fonts.openSansRegular,
    },
    textError: {
        textAlign: "center",
        color: "red",
        marginBottom: 16,
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fonts.openSansSemiBold,
    },

    button: {
        alignSelf: "center",
        width: "50%",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 100,
    },
    buttonText: {
        textAlign: "center",
        fontFamily: theme.fonts.openSansSemiBold,
    },
});
