import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { getContrastingTextColor } from "../utils/InverseColorUtils";
import theme from "../core/theme";
import { createCategory } from "../constants/Urls";
import { useDispatch } from "react-redux";
import { addCategory } from "../reducers/user";

export default function ModalModifycategory({
    modalName,
    sectionName,
    sectionColor,
    sectionId,
    modalVisible,
    onClose,
    onCreate,
    token,
    onValidation,
}) {
    const [inputCategory, setInputCategory] = useState("");
    const [inputColor, setInputColor] = useState("");
    const [textError, setTextError] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        setInputCategory(sectionName || "");
        setInputColor(sectionColor || theme.colors.blue);
    }, [sectionName, sectionColor]);

    const handleClose = () => {
        setTextError("");
        setInputCategory("");
        setInputColor(theme.colors.blue);
        onClose();
    };

    const handleModifyCategory = async () => {
        const trimmed = inputCategory.trim();
        if (!trimmed) return setTextError("Rentrer un nom à la catégorie");

        if (trimmed) {
            setTextError("");
            setInputCategory("");
            setInputColor(theme.colors.blue);
            onValidation(inputColor, trimmed, sectionId);
            onClose();
        } else {
            setTextError("Cette catégorie existe déjà");
        }
    };

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            <View style={styles.backdrop}>
                <View style={styles.content}>
                    <Text style={styles.title}>{modalName}</Text>

                    {/* Color Picker */}
                    <View style={styles.pickerWrapper}>
                        <ColorPicker
                            color={sectionColor}
                            onColorChange={setInputColor}
                            thumbSize={30}
                            sliderSize={30}
                            noSnap={true}
                            row={false}
                            shadeSliderThumb={true}
                        />
                    </View>

                    {/* Nom de la catégorie */}
                    <TextInput
                        style={styles.input}
                        placeholder="Nom de la catégorie"
                        value={inputCategory}
                        onChangeText={setInputCategory}
                    />
                    <Text style={styles.textError}>{textError}</Text>
                    {/* Boutons Valider / Annuler */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelBtn]}
                            onPress={handleClose}
                        >
                            <Text style={styles.buttonText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                { backgroundColor: inputColor },
                            ]}
                            onPress={handleModifyCategory}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    {
                                        color: getContrastingTextColor(
                                            inputColor
                                        ),
                                    },
                                ]}
                            >
                                Valider
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 16,
    },
    content: {
        backgroundColor: theme.colors.bg_White,
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: theme.fontSizes.large,
        fontFamily: theme.fonts.comfortaaBold,
        marginBottom: 12,
        textAlign: "center",
    },
    pickerWrapper: {
        height: 190,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.icon_gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        fontFamily: theme.fonts.openSansRegular,
    },
    textError: {
        alignSelf: "flex-end",
        color: "red",
        marginBottom: 16,
        fontFamily: theme.fonts.openSansRegular,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 12,
    },
    cancelBtn: {
        backgroundColor: theme.colors.bg_gray,
    },
    buttonText: {
        fontFamily: theme.fonts.openSansSemiBold,
    },
});
