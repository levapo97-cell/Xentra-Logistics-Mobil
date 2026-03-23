import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { theme } from "../theme/theme";

interface ERPButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "danger" | "outline" | "ghost";
    icon?: React.ReactNode;
    style?: ViewStyle | (ViewStyle | false)[];
    textStyle?: TextStyle | (TextStyle | false)[];
    disabled?: boolean;
}

export default function ERPButton({
    title,
    onPress,
    variant = "primary",
    icon,
    style,
    textStyle,
    disabled = false,
}: ERPButtonProps) {
    const isPrimary = variant === "primary";
    const isDanger = variant === "danger";
    const isOutline = variant === "outline";
    const isGhost = variant === "ghost";

    const getBgColor = () => {
        if (disabled) return theme.colors.card;
        if (isPrimary) return theme.colors.primary;
        if (isDanger) return theme.colors.danger;
        return "transparent";
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.muted;
        if (isPrimary || isDanger) return "#000000";
        if (isOutline) return theme.colors.text;
        return theme.colors.primary;
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: getBgColor() },
                isOutline && styles.outline,
                pressed && !disabled && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                style,
            ]}
        >
            {icon && icon}
            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: theme.radius.md,
        gap: 8,
    },
    outline: {
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    text: {
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 0.2,
    },
});
