import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { theme } from "../theme/theme";
import ERPStatusBadge from "./ERPStatusBadge";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    title: string;
    subtitle: string;
    amount?: number;
    date: string;
    status: string;
    onPress: () => void;
}

export default function DocumentListItem({ title, subtitle, amount, date, status, onPress }: Props) {
    return (
        <Pressable 
            onPress={onPress} 
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
        >
            <View style={styles.topRow}>
                <Text style={styles.title}>{title}</Text>
                <ERPStatusBadge status={status} />
            </View>
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            <View style={styles.bottomRow}>
                <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={14} color={theme.colors.muted} />
                    <Text style={styles.date}>{date}</Text>
                </View>
                {amount !== undefined && (
                    <Text style={styles.amount}>${amount.toFixed(2)}</Text>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    title: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 0.2,
    },
    subtitle: {
        color: theme.colors.muted,
        fontSize: 13,
        marginBottom: 12,
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    date: {
        color: theme.colors.muted,
        fontSize: 12,
        fontWeight: "500",
    },
    amount: {
        color: theme.colors.primary,
        fontSize: 15,
        fontWeight: "800",
    },
});
