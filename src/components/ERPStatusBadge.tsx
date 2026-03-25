import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

interface Props {
    status: string;
}

const STATUS_COLORS: Record<string, string> = {
    Borrador: theme.colors.muted,
    Pendiente: theme.colors.warning,
    Aprobada: theme.colors.primary,
    Completada: theme.colors.primary,
    Rechazada: theme.colors.danger,
    Abierta: theme.colors.warning,
    Cerrada: theme.colors.success,
    Cancelada: theme.colors.danger,
    Pagada: theme.colors.success,
    Deuda: theme.colors.danger,
    Activo: theme.colors.primary,
    Activa: theme.colors.primary,
    Inactivo: theme.colors.danger,
    Inactiva: theme.colors.danger,
};

export default function ERPStatusBadge({ status }: Props) {
    const color = STATUS_COLORS[status] || theme.colors.muted;
    return (
        <View style={[styles.badge, { borderColor: color, backgroundColor: color + "1A" }]}>
            <Text style={[styles.text, { color }]}>{status}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        alignSelf: "flex-start",
    },
    text: {
        fontSize: 10,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
});
