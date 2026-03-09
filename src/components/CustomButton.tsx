import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../theme/theme";

type Variant = "primary" | "success" | "danger";

type Props = {
    title: string;
    onPress: () => void;
    variant?: Variant;
    outline?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
};
    
export default function CustomButton({
    title,
    onPress,
    variant = "primary",
    outline = false,
    disabled = false,
    style,
}: Props) {
    const mainColor =
        variant === "success"
            ? theme.colors.success
            : variant === "danger"
                ? theme.colors.danger
                : theme.colors.primary;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.btn,
                outline ? styles.outline : { backgroundColor: mainColor },
                outline ? { borderColor: mainColor } : null,
                disabled ? styles.disabled : null,
                pressed && !disabled ? styles.pressed : null,
                style,
            ]}
        >
            <Text style={[styles.text, outline ? { color: mainColor } : { color: "#fff" }]}>
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btn: {
        width: "100%",
        paddingVertical: 14,
        borderRadius: theme.radius.md,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "transparent",
    },
    outline: { backgroundColor: "transparent" },
    disabled: { opacity: 0.5 },
    pressed: { transform: [{ scale: 0.99 }] },
    text: { fontSize: 15, fontWeight: "700" },
});