import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import ERPSearchBar from "../../components/ERPSearchBar";
import ERPDataTable from "../../components/ERPDataTable";
import ERPStatusBadge from "../../components/ERPStatusBadge";
import { ExpensesStackParamList } from "../../navigation/ExpensesStack";

type Nav = NativeStackNavigationProp<ExpensesStackParamList, "GastosList">;

// Datos de ejemplo
const GASTOS_DATA = [
    { id: "1", factura: "001-001-00001234", cai: "3D5F7A", proveedor: "Distribuidora ABC", tipo: "Combustible", monto: 1500.00, auditoria: "Pendiente", autorizado: false },
    { id: "2", factura: "001-001-00001235", cai: "4E6G8B", proveedor: "Office Depot", tipo: "Papelería", monto: 850.50, auditoria: "Aprobado", autorizado: true },
    { id: "3", factura: "001-001-00001236", cai: "5F7H9C", proveedor: "TechSolutions", tipo: "Software", monto: 2500.00, auditoria: "Pendiente", autorizado: false },
];

const FILTERS = ["Todos", "Pendientes", "Aprobados", "Rechazados"];

export default function GastosListScreen() {
    const navigation = useNavigation<Nav>();
    const [search, setSearch] = useState("");
    const [filterIndex, setFilterIndex] = useState(0);

    // KPIs
    const reintegrosAprobados = GASTOS_DATA.filter(g => g.auditoria === "Aprobado").reduce((acc, g) => acc + g.monto, 0);
    const auditoriaPendiente = GASTOS_DATA.filter(g => g.auditoria === "Pendiente").reduce((acc, g) => acc + g.monto, 0);
    const acumuladoHistorico = GASTOS_DATA.reduce((acc, g) => acc + g.monto, 0);

    const filteredData = GASTOS_DATA.filter(g => {
        const matchesSearch = g.proveedor.toLowerCase().includes(search.toLowerCase()) ||
            g.factura.toLowerCase().includes(search.toLowerCase());
        if (filterIndex === 0) return matchesSearch;
        if (filterIndex === 1) return matchesSearch && g.auditoria === "Pendiente";
        if (filterIndex === 2) return matchesSearch && g.auditoria === "Aprobado";
        if (filterIndex === 3) return matchesSearch && g.auditoria === "Rechazado";
        return matchesSearch;
    });

    const columns = [
        { id: "factura", label: "Factura", flex: 1.5 },
        { id: "proveedor", label: "Proveedor", flex: 1.2 },
        { id: "monto", label: "Monto", flex: 0.8, align: "right" as const },
        { id: "auditoria", label: "Estado", flex: 0.8 },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={styles.title}>Gastos</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* KPI Cards */}
                <View style={styles.kpiRow}>
                    <View style={[styles.kpiCard, styles.kpiGreen]}>
                        <View style={styles.kpiIconWrap}>
                            <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.kpiLabel}>REINTEGROS APROBADOS</Text>
                            <Text style={styles.kpiValue}>L{reintegrosAprobados.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.kpiRow}>
                    <View style={[styles.kpiCard, styles.kpiYellow]}>
                        <View style={[styles.kpiIconWrap, { backgroundColor: theme.colors.warning + "20" }]}>
                            <Ionicons name="time" size={24} color={theme.colors.warning} />
                        </View>
                        <View>
                            <Text style={styles.kpiLabel}>AUDITORÍA PENDIENTE</Text>
                            <Text style={[styles.kpiValue, { color: theme.colors.warning }]}>L{auditoriaPendiente.toFixed(2)}</Text>
                        </View>
                    </View>

                    <View style={[styles.kpiCard, styles.kpiGray]}>
                        <View style={[styles.kpiIconWrap, { backgroundColor: theme.colors.muted + "20" }]}>
                            <Ionicons name="folder" size={24} color={theme.colors.muted} />
                        </View>
                        <View>
                            <Text style={styles.kpiLabel}>ACUMULADO HISTÓRICO</Text>
                            <Text style={[styles.kpiValue, { color: theme.colors.text }]}>L{acumuladoHistorico.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Search + Filter */}
                <View style={styles.searchRow}>
                    <View style={{ flex: 1 }}>
                        <ERPSearchBar
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Buscar por Motivo o Proveedor..."
                        />
                    </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
                    {FILTERS.map((f, i) => (
                        <Pressable
                            key={f}
                            onPress={() => setFilterIndex(i)}
                            style={[styles.filterChip, filterIndex === i && styles.filterChipActive]}
                        >
                            <Text style={[styles.filterText, filterIndex === i && styles.filterTextActive]}>{f}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Table */}
                <ERPDataTable
                    columns={columns}
                    data={filteredData}
                    emptyMessage="No existen erogaciones que coincidan con el criterio fiscal."
                    renderRow={(item) => (
                        <>
                            <View style={{ flex: 1.5 }}>
                                <Text style={styles.cellText} numberOfLines={1}>{item.factura}</Text>
                                <Text style={styles.cellSubtext}>{item.cai}</Text>
                            </View>
                            <Text style={[styles.cellText, { flex: 1.2 }]} numberOfLines={1}>{item.proveedor}</Text>
                            <Text style={[styles.cellText, { flex: 0.8, textAlign: "right" }]}>L{item.monto.toFixed(2)}</Text>
                            <View style={{ flex: 0.8 }}>
                                <ERPStatusBadge status={item.auditoria === "Aprobado" ? "Aprobada" : "Pendiente"} />
                            </View>
                        </>
                    )}
                />
            </ScrollView>

            {/* FAB */}
            <Pressable
                style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
                onPress={() => navigation.navigate("ExpenseForm")}
            >
                <Ionicons name="add" size={28} color="#000" />
                <Text style={styles.fabText}>Procesar Factura</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 60,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.card,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: "800",
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },

    // KPIs
    kpiRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
    },
    kpiCard: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: 16,
        borderWidth: 1,
        gap: 12,
    },
    kpiGreen: { borderColor: theme.colors.primary + "40" },
    kpiYellow: { borderColor: theme.colors.warning + "40" },
    kpiGray: { borderColor: theme.colors.border },
    kpiIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: theme.colors.primary + "20",
        alignItems: "center",
        justifyContent: "center",
    },
    kpiLabel: {
        color: theme.colors.muted,
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    kpiValue: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: "900",
    },

    // Search & Filters
    searchRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    filtersScroll: {
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterText: {
        color: theme.colors.muted,
        fontSize: 13,
        fontWeight: "600",
    },
    filterTextActive: {
        color: "#000",
    },

    // Table cells
    cellText: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: "600",
    },
    cellSubtext: {
        color: theme.colors.muted,
        fontSize: 11,
        marginTop: 2,
    },

    // FAB
    fab: {
        position: "absolute",
        bottom: 30,
        right: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 30,
        gap: 8,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    fabPressed: { transform: [{ scale: 0.96 }] },
    fabText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "800",
    },
});
