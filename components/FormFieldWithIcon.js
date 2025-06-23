import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import theme from "../core/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";

export default function FormFieldWithIcon({
    label,
    placeHolder,
    input,
    setInput,
    ...rest
}) {
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const toggleSecureTextEntry = () => {
        setSecureTextEntry((value) => !value);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.row}>
                <TextInput
                    placeholder={placeHolder}
                    style={styles.textInput}
                    secureTextEntry={secureTextEntry}
                    onChangeText={setInput}
                    value={input}
                    autoCapitalize="none"
                    {...rest}
                />
                <TouchableOpacity onPress={toggleSecureTextEntry}>
                    <FontAwesome5
                        name={secureTextEntry ? "eye-slash" : "eye"}
                        size={20}
                        color={theme.colors.icon_gray}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        marginBottom: 15,
    },
    label: {
        position: "absolute",
        top: -8,
        left: 14,
        fontSize: theme.fontSizes.small,
        backgroundColor: theme.colors.bg_White,
        zIndex: 1,
        paddingInline: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: theme.colors.text_gray,
        borderWidth: 1,
        borderRadius: 10,
        width: 300,
        padding: 15,
    },
    textInput: {
        color: theme.colors.text_dark,
        fontSize: theme.fontSizes.medium,
        width: 230,
        padding: 0,
    },
});
