import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";
import {
    TYPE_LABELS,
    TYPE_ICONS,
    STATUS_COLORS,
    SalesDocType,
    SalesDoc,
    SalesLine,
    calcTotal,
} from "../context/SalesContext";
import { SalesStackParamList } from "../navigation/SalesStack";

type Nav = NativeStackNavigationProp<SalesStackParamList, "SalesDetail">;
type Route = RouteProp<SalesStackParamList, "SalesDetail">;

function Row({ label, value }: { label: string; value: string }) {
    return (
        <View style={dr.wrapper}>
            <Text style={dr.label}>{label}</Text>
            <Text style={dr.value}>{value}</Text>
        </View>
    );
}

const dr = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    label: { color: theme.colors.muted, fontSize: 13, flex: 1 },
    value: { color: theme.colors.text, fontSize: 13, fontWeight: "600", flex: 1.5, textAlign: "right" },
});

export default function SalesDetailScreen() {
    const navigation = useNavigation<Nav>();
    const { params } = useRoute<Route>();
    const { doc, type } = params as { doc: SalesDoc; type: SalesDocType };

    const statusColor = STATUS_COLORS[doc.status] ?? theme.colors.muted;
    const total = calcTotal(doc.lines ?? []);

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={22} color={theme.colors.primary} />
                    <Text style={styles.backText}>{TYPE_LABELS[type]}</Text>
                </Pressable>
                <View style={styles.titleRow}>
                    <Text style={styles.icon}>{TYPE_ICONS[type]}</Text>
                    <Text style={styles.title}>{doc.number}</Text>
                    <View style={[styles.badge, { backgroundColor: statusColor + "22", borderColor: statusColor }]}>
                        <Text style={[styles.badgeText, { color: statusColor }]}>{doc.status}</Text>
                    </View>
                </View>

                {/* Botón editar */}
                <Pressable
                    style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.7 }]}
                    onPress={() => navigation.navigate("SalesForm", { type, doc })}
                >
                    <Ionicons name="pencil" size={15} color={theme.colors.primary} />
                    <Text style={styles.editTxt}>Editar documento</Text>
                </Pressable>
            </View>

            {/* Datos cabecera */}
            <Text style={styles.sectionLabel}>Información general</Text>
            <View style={styles.card}>
                <Row label="Número" value={doc.number} />
                <Row label="Cliente" value={doc.client} />
                <Row label="Fecha" value={doc.date} />
                <Row label="Estado" value={doc.status} />
                {doc.notes && <Row label="Notas" value={doc.notes} />}
                <Row label="Creado" value={new Date(doc.createdAt).toLocaleString()} />
            </View>

            {/* Artículos */}
            <Text style={[styles.sectionLabel, { marginTop: theme.spacing.md }]}>
                Artículos ({(doc.lines ?? []).length})
            </Text>
            <View style={styles.linesCard}>
                {/* Cabecera de tabla */}
                <View style={[styles.tableRow, styles.tableHead]}>
                    <Text style={[styles.colCode, styles.headTxt]}>Código</Text>
                    <Text style={[styles.colDesc, styles.headTxt]}>Descripción</Text>
                    <Text style={[styles.colNum, styles.headTxt]}>Cant.</Text>
                    <Text style={[styles.colNum, styles.headTxt]}>P.Unit</Text>
                    <Text style={[styles.colNum, styles.headTxt]}>Total</Text>
                </View>

                {(doc.lines ?? []).length === 0 ? (
                    <Text style={styles.noLines}>Sin artículos registrados.</Text>
                ) : (
                    (doc.lines ?? []).map((l: SalesLine) => (
                        <View key={l.id} style={styles.tableRow}>
                            <Text style={styles.colCode}>{l.code}</Text>
                            <Text style={[styles.colDesc, { color: theme.colors.text }]} numberOfLines={2}>{l.description}</Text>
                            <Text style={styles.colNum}>{l.qty}</Text>
                            <Text style={styles.colNum}>${l.unitPrice.toFixed(2)}</Text>
                            <Text style={[styles.colNum, { color: theme.colors.primary, fontWeight: "700" }]}>
                                ${l.total.toFixed(2)}
                            </Text>
                        </View>
                    ))
                )}

                {/* Subtotales */}
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmt}>${total.toFixed(2)}</Text>
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: theme.colors.bg },
    container: { padding: theme.spacing.lg, paddingBottom: 40 },
    header: { paddingTop: 52, marginBottom: theme.spacing.lg },
    backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    backText: { color: theme.colors.primary, fontSize: 14, marginLeft: 2 },
    titleRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 },
    icon: { fontSize: 22 },
    title: { color: theme.colors.text, fontSize: 20, fontWeight: "800", flex: 1 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
    badgeText: { fontSize: 12, fontWeight: "700" },
    editBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.primary + "55",
        borderRadius: theme.radius.md,
        paddingHorizontal: 14,
        paddingVertical: 8,
        alignSelf: "flex-start",
    },
    editTxt: { color: theme.colors.primary, fontWeight: "700", fontSize: 13 },
    sectionLabel: { color: theme.colors.muted, fontSize: 12, fontWeight: "700", letterSpacing: 0.8, marginBottom: 8, textTransform: "uppercase" },
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        overflow: "hidden",
    },
    linesCard: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: "hidden",
    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 9,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    tableHead: { backgroundColor: "#0d1526" },
    headTxt: { color: theme.colors.muted, fontSize: 10, fontWeight: "700" },
    colCode: { width: 58, color: theme.colors.muted, fontSize: 11 },
    colDesc: { flex: 1, color: theme.colors.muted, fontSize: 12, paddingHorizontal: 4 },
    colNum: { width: 58, textAlign: "right", color: theme.colors.muted, fontSize: 12 },
    noLines: { color: theme.colors.muted, fontSize: 13, textAlign: "center", padding: 16 },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#0d1526",
    },
    totalLabel: { color: theme.colors.muted, fontWeight: "600", fontSize: 13 },
    totalAmt: { color: theme.colors.primary, fontWeight: "800", fontSize: 16 },
});
