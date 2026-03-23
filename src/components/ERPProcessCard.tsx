import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { theme } from "../theme/theme";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    title: string;
    description: string;
    iconName: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

export default function ERPProcessCard({ title, description, iconName, onPress }: Props) {
    return (
        <Pressable 
            onPress={onPress} 
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
        >
            <View style={styles.iconBox}>
                <Ionicons name={iconName} size={24} color="#050505" />
            </View>
            <View style={styles.textBox}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.desc}>{description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.muted} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.card,
        padding: theme.spacing.md,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.md,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    textBox: {
        flex: 1,
    },
    title: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 4,
    },
    desc: {
        color: theme.colors.muted,
        fontSize: 13,
        fontWeight: "500",
    },
});
