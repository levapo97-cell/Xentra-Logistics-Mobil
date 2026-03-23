import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

interface Props {
    value: string;
    onChangeText: (t: string) => void;
    placeholder?: string;
}

export default function ERPSearchBar({ value, onChangeText, placeholder = "Buscar..." }: Props) {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={18} color={theme.colors.muted} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.muted}
                style={styles.input}
                autoCorrect={false}
                clearButtonMode="while-editing"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.input,
        borderRadius: theme.radius.md,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        height: 48,
        marginBottom: theme.spacing.md,
    },
    input: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 15,
        marginLeft: 8,
        height: "100%",
    },
});
