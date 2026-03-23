import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../theme/theme";

interface RowProps {
    label: string;
    value: React.ReactNode;
    isLast?: boolean;
}

export function ERPInfoRow({ label, value, isLast = false }: RowProps) {
    return (
        <View style={[styles.row, !isLast && styles.borderBottom]}>
            <Text style={styles.label}>{label}</Text>
            {typeof value === 'string' ? (
                <Text style={styles.value} numberOfLines={2} ellipsizeMode="tail">{value}</Text>
            ) : (
                value
            )}
        </View>
    );
}

export default function ERPInfoCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        overflow: "hidden",
        marginBottom: theme.spacing.xl,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: 12,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    label: {
        color: theme.colors.muted,
        fontSize: 13,
        fontWeight: "600",
        flex: 1,
        marginRight: 10,
    },
    value: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: "700",
        flex: 1.5,
        textAlign: "right",
    },
});
