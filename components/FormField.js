import { StyleSheet, Text, TextInput, View } from "react-native";
import theme from "../core/theme";

export default function FormField({
    label,
    placeHolder,
    input,
    setInput,
    ...rest
}) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                placeholder={placeHolder}
                style={styles.textInput}
                onChangeText={setInput}
                value={input}
                autoCapitalize="none"
                {...rest}
            />
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
    textInput: {
        borderColor: theme.colors.text_gray,
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        color: theme.colors.text_dark,
        width: 300,
        fontSize: theme.fontSizes.medium,
    },
});
