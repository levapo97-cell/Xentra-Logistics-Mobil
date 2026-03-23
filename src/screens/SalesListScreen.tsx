import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";
import DocumentListItem from "../components/DocumentListItem";
import ERPSearchBar from "../components/ERPSearchBar";
import {
    useSales,
    SalesDoc,
    SalesDocType,
    TYPE_LABELS,
    calcTotal,
} from "../context/SalesContext";
import { SalesStackParamList } from "../navigation/SalesStack";

type Nav = NativeStackNavigationProp<SalesStackParamList, "SalesList">;
type Route = RouteProp<SalesStackParamList, "SalesList">;

export default function SalesListScreen() {
    const navigation = useNavigation<Nav>();
    const { params } = useRoute<Route>();
    const { type } = params as { type: SalesDocType };
    const { quotes, orders, invoices } = useSales();
    const [query, setQuery] = useState("");

    const docsMap: Record<SalesDocType, SalesDoc[]> = {
        quote: quotes,
        order: orders,
        invoice: invoices,
    };
    const allDocs: SalesDoc[] = docsMap[type];
    const label: string = TYPE_LABELS[type];

    const docs = useMemo(() => {
        if (!query.trim()) return allDocs;
        const q = query.toLowerCase();
        return allDocs.filter(
            (d) =>
                d.number.toLowerCase().includes(q) ||
                d.client.toLowerCase().includes(q) ||
                (d.notes ?? "").toLowerCase().includes(q)
        );
    }, [allDocs, query]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
                    <Text style={styles.backText}>Ventas</Text>
                </Pressable>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{label}</Text>
                    <Text style={styles.count}>{allDocs.length} doc{allDocs.length !== 1 ? "s" : ""}</Text>
                </View>
                {/* Buscador */}
                <ERPSearchBar value={query} onChangeText={setQuery} placeholder={`Buscar en ${label.toLowerCase()}...`} />
            </View>

            {/* Lista */}
            {docs.length === 0 ? (
                <View style={styles.empty}>
                    <Ionicons name="document-text-outline" size={48} color={theme.colors.muted + "55"} style={{marginBottom: 16}} />
                    <Text style={styles.emptyText}>
                        {allDocs.length === 0 ? "No hay documentos aún" : "Sin resultados"}
                    </Text>
                    <Text style={styles.emptyHint}>
                        {allDocs.length === 0
                            ? `Toca el botón + para crear el primer documento.`
                            : "Prueba con otro término de búsqueda."}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={docs}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <DocumentListItem
                            title={item.number}
                            subtitle={item.client}
                            status={item.status}
                            date={item.date}
                            amount={calcTotal(item.lines ?? [])}
                            onPress={() => navigation.navigate("SalesDetail", { doc: item, type })}
                        />
                    )}
                />
            )}

            {/* FAB */}
            <Pressable
                style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
                onPress={() => navigation.navigate("SalesForm", { type })}
            >
                <Ionicons name="add" size={30} color="#050505" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg },
    header: {
        paddingTop: 56,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
        backgroundColor: theme.colors.bg,
        zIndex: 10,
    },
    backBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    backText: { color: theme.colors.primary, fontSize: 16, fontWeight: "600", marginLeft: 4 },
    titleRow: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    title: { color: theme.colors.text, fontSize: 24, fontWeight: "900", letterSpacing: -0.5 },
    count: { color: theme.colors.muted, fontSize: 14, fontWeight: "600" },
    list: { padding: theme.spacing.lg, paddingBottom: 100 },
    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.xl,
    },
    emptyText: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 8,
    },
    emptyHint: {
        color: theme.colors.muted,
        fontSize: 14,
        textAlign: "center",
        lineHeight: 22,
    },
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
    },
    fabPressed: { transform: [{ scale: 0.92 }] },
});
