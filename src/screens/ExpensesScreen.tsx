import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";
import DocumentListItem from "../components/DocumentListItem";
import { useExpenses } from "../context/ExpensesContext";
import { ExpensesStackParamList } from "../navigation/ExpensesStack";

type Nav = NativeStackNavigationProp<ExpensesStackParamList, "ExpensesHome">;

export default function ExpensesScreen() {
    const navigation = useNavigation<Nav>();
    const { expenses, total } = useExpenses();

    const pendingCount = expenses.filter(e => e.status === 'Pendiente').length;

    return (
        <View style={styles.container}>
            {/* Header + OCR Btn */}
            <View style={styles.header}>
                <Text style={styles.title}>Gastos</Text>
                <Pressable onPress={() => navigation.navigate("OCRExpense")} style={styles.ocrBtn}>
                    <Ionicons name="scan-outline" size={20} color="#000" />
                    <Text style={styles.ocrText}>Escanear</Text>
                </Pressable>
            </View>

            {/* KPIs Horizontales */}
            <View style={styles.kpiRow}>
                <View style={styles.kpiCard}>
                    <Text style={styles.kpiLabel}>Total Registrado</Text>
                    <Text style={styles.kpiValue}>${total.toFixed(2)}</Text>
                </View>
                <View style={styles.kpiCard}>
                    <Text style={styles.kpiLabel}>Pendientes</Text>
                    <Text style={[styles.kpiValue, { color: theme.colors.warning }]}>{pendingCount}</Text>
                </View>
            </View>

            {/* List */}
            <Text style={styles.sectionTitle}>Historial de gastos</Text>
            {expenses.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Ionicons name="receipt-outline" size={48} color={theme.colors.muted + "55"} style={{marginBottom: 16}} />
                    <Text style={styles.emptyText}>No hay gastos registrados.</Text>
                </View>
            ) : (
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <DocumentListItem
                            title={item.description}
                            subtitle={item.category}
                            date={item.date}
                            amount={item.amount}
                            status={item.status ?? 'Borrador'}
                            onPress={() => {}}
                        />
                    )}
                />
            )}

            {/* FAB para agregar gasto manual */}
            <Pressable
                style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
                onPress={() => navigation.navigate("ExpenseForm")}
            >
                <Ionicons name="add" size={32} color="#000" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg },
    header: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        paddingTop: 60, paddingHorizontal: theme.spacing.lg, marginBottom: 20 
    },
    title: { color: theme.colors.text, fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
    ocrBtn: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, 
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 6, borderWidth: 1, borderColor: theme.colors.border
    },
    ocrText: { color: theme.colors.primary, fontSize: 13, fontWeight: "800" },
    
    kpiRow: { flexDirection: 'row', paddingHorizontal: theme.spacing.lg, gap: 12, marginBottom: 24 },
    kpiCard: { flex: 1, backgroundColor: theme.colors.card, padding: 16, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border },
    kpiLabel: { color: theme.colors.muted, fontSize: 13, fontWeight: "600", marginBottom: 8 },
    kpiValue: { color: theme.colors.text, fontSize: 22, fontWeight: "900" },
    
    sectionTitle: { color: theme.colors.muted, fontSize: 13, fontWeight: "800", textTransform: 'uppercase', paddingHorizontal: theme.spacing.lg, marginBottom: 12, letterSpacing: 0.5 },
    list: { paddingHorizontal: theme.spacing.lg, paddingBottom: 20 },
    emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
    emptyText: { color: theme.colors.muted, fontSize: 15, fontWeight: "500" },

    fab: {
        position: "absolute",
        bottom: 30,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 20
    },
    fabPressed: { transform: [{ scale: 0.92 }] },
});