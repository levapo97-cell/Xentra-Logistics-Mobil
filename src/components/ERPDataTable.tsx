import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

interface Column {
    id: string;
    label: string;
    flex?: number;
    width?: number;
    align?: "left" | "center" | "right";
}

interface ERPDataTableProps {
    columns: Column[];
    data: any[];
    renderRow: (item: any) => React.ReactNode;
    totals?: {
        subtotal?: number;
        taxes?: number;
        total: number;
    };
    emptyMessage?: string;
}

export default function ERPDataTable({ columns, data, renderRow, totals, emptyMessage = "No hay datos." }: ERPDataTableProps) {
    return (
        <View style={styles.container}>
            <View style={styles.head}>
                {columns.map(col => (
                    <Text 
                        key={col.id} 
                        style={[
                            styles.headTxt, 
                            col.flex ? { flex: col.flex } : { width: col.width },
                            { textAlign: col.align || "left" }
                        ]}
                    >
                        {col.label}
                    </Text>
                ))}
            </View>
            
            {data.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Text style={styles.emptyTxt}>{emptyMessage}</Text>
                </View>
            ) : (
                data.map((item, i) => (
                    <View key={item.id || i} style={[styles.row, i === data.length - 1 && { borderBottomWidth: 0 }]}>
                        {renderRow(item)}
                    </View>
                ))
            )}
            
            {totals && (
                <View style={styles.totalsBox}>
                    {totals.subtotal !== undefined && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>${totals.subtotal.toFixed(2)}</Text>
                        </View>
                    )}
                    {totals.taxes !== undefined && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Impuestos</Text>
                            <Text style={styles.totalValue}>${totals.taxes.toFixed(2)}</Text>
                        </View>
                    )}
                    <View style={[styles.totalRow, { marginTop: 4 }]}>
                        <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total Final</Text>
                        <Text style={styles.totalFinalValue}>${totals.total.toFixed(2)}</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: "hidden",
        marginBottom: theme.spacing.xl,
    },
    head: {
        flexDirection: "row",
        backgroundColor: "#0d1526",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headTxt: {
        color: theme.colors.muted,
        fontSize: 11,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    emptyWrap: {
        padding: 30,
        alignItems: "center",
    },
    emptyTxt: {
        color: theme.colors.muted,
        fontSize: 14,
    },
    totalsBox: {
        backgroundColor: "#0d1526",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    totalLabel: {
        color: theme.colors.muted,
        fontSize: 13,
        fontWeight: "600",
    },
    totalValue: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: "600",
    },
    totalFinalValue: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: "900",
    },
});
