import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    TextInput,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";
import CustomCard from "../components/CustomCard";
import {
    useSales,
    SalesDoc,
    SalesDocType,
    TYPE_LABELS,
    STATUS_COLORS,
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

    // Búsqueda por número, cliente o notas
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
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={22} color={theme.colors.primary} />
                    <Text style={styles.backText}>Ventas</Text>
                </Pressable>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{label}</Text>
                    <Text style={styles.count}>{allDocs.length} doc{allDocs.length !== 1 ? "s" : ""}</Text>
                </View>
            </View>

            {/* Buscador */}
            <View style={styles.searchBox}>
                <Ionicons name="search" size={16} color={theme.colors.muted} style={{ marginRight: 8 }} />
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Buscar por número, cliente..."
                    placeholderTextColor={theme.colors.muted}
                    style={styles.searchInput}
                    clearButtonMode="while-editing"
                />
            </View>

            {/* Lista */}
            {docs.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>🔍</Text>
                    <Text style={styles.emptyText}>
                        {allDocs.length === 0 ? "No hay documentos aún" : "Sin resultados"}
                    </Text>
                    <Text style={styles.emptyHint}>
                        {allDocs.length === 0
                            ? `Toca + para crear el primer ${label}.`
                            : "Prueba con otro término de búsqueda."}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={docs}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => {
                        const statusColor =
                            STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] ??
                            theme.colors.muted;
                        return (
                            <CustomCard
                                onPress={() =>
                                    navigation.navigate("SalesDetail", { doc: item, type })
                                }
                            >
                                {/* Fila superior: número y badge de estado */}
                                <View style={row.top}>
                                    <Text style={row.number}>{item.number}</Text>
                                    <View
                                        style={[
                                            row.badge,
                                            {
                                                backgroundColor: statusColor + "22",
                                                borderColor: statusColor,
                                            },
                                        ]}
                                    >
                                        <Text style={[row.badgeText, { color: statusColor }]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* Cliente y monto */}
                                <Text style={row.client}>{item.client}</Text>
                                <View style={row.bottom}>
                                    <Text style={row.date}>{item.date}</Text>
                                    <Text style={row.amount}>
                                        ${Number(item.amount).toFixed(2)}
                                    </Text>
                                </View>
                            </CustomCard>
                        );
                    }}
                />
            )}

            {/* FAB (+) */}
            <Pressable
                style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
                onPress={() => navigation.navigate("SalesForm", { type })}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </Pressable>
        </View>
    );
}

const row = StyleSheet.create({
    top: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    number: { color: theme.colors.text, fontWeight: "700", fontSize: 14 },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
    },
    badgeText: { fontSize: 11, fontWeight: "700" },
    client: { color: theme.colors.muted, fontSize: 13, marginBottom: 6 },
    bottom: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    date: { color: theme.colors.muted, fontSize: 12 },
    amount: {
        color: theme.colors.primary,
        fontWeight: "700",
        fontSize: 14,
    },
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg },
    header: {
        paddingTop: 56,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    backText: { color: theme.colors.primary, fontSize: 14, marginLeft: 2 },
    titleRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 8,
    },
    title: { color: theme.colors.text, fontSize: 20, fontWeight: "800" },
    count: { color: theme.colors.muted, fontSize: 13 },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.input,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginHorizontal: theme.spacing.lg,
        marginVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 10,
    },
    searchInput: { flex: 1, color: theme.colors.text, fontSize: 14 },
    list: { padding: theme.spacing.lg, paddingBottom: 100 },
    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.xl,
    },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: {
        color: theme.colors.text,
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 6,
    },
    emptyHint: {
        color: theme.colors.muted,
        fontSize: 13,
        textAlign: "center",
        lineHeight: 20,
    },
    fab: {
        position: "absolute",
        bottom: 30,
        right: 24,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    fabPressed: { transform: [{ scale: 0.94 }] },
});
