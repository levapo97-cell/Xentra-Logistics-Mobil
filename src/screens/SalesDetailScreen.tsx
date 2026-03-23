import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";
import ERPInfoCard, { ERPInfoRow } from "../components/ERPInfoCard";
import ERPDataTable from "../components/ERPDataTable";
import ERPButton from "../components/ERPButton";
import ERPStatusBadge from "../components/ERPStatusBadge";
import {
    TYPE_LABELS,
    TYPE_ICONS,
    SalesDocType,
    SalesDoc,
    SalesLine,
    calcTotal,
} from "../context/SalesContext";
import { SalesStackParamList } from "../navigation/SalesStack";

type Nav = NativeStackNavigationProp<SalesStackParamList, "SalesDetail">;
type Route = RouteProp<SalesStackParamList, "SalesDetail">;

export default function SalesDetailScreen() {
    const navigation = useNavigation<Nav>();
    const { params } = useRoute<Route>();
    const { doc, type } = params as { doc: SalesDoc; type: SalesDocType };

    const total = calcTotal(doc.lines ?? []);
    
    // UI State for Actions
    const [convertModalVisible, setConvertModalVisible] = useState(false);

    return (
        <>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
                    <Text style={styles.backText}>{TYPE_LABELS[type]}</Text>
                </Pressable>
                
                <View style={styles.titleRow}>
                    <Text style={styles.icon}>{TYPE_ICONS[type]}</Text>
                    <Text style={styles.title}>{doc.number}</Text>
                    <ERPStatusBadge status={doc.status} />
                </View>

                {/* Botón editar */}
                <ERPButton 
                    title="Editar documento"
                    icon={<Ionicons name="pencil" size={16} color={theme.colors.text} style={{marginRight: 4}}/>}
                    variant="outline"
                    onPress={() => navigation.navigate("SalesForm", { type, doc })}
                    style={{ alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16 }}
                />
            </View>

            {/* Datos cabecera */}
            <Text style={styles.sectionLabel}>Información general</Text>
            <ERPInfoCard>
                <ERPInfoRow label="Número" value={doc.number} />
                <ERPInfoRow label="Cliente" value={doc.client} />
                <ERPInfoRow label="Fecha" value={doc.date} />
                <ERPInfoRow label="Estado" value={<ERPStatusBadge status={doc.status} />} />
                {doc.notes && <ERPInfoRow label="Notas" value={doc.notes} />}
                <ERPInfoRow label="Creado" value={new Date(doc.createdAt).toLocaleString()} isLast />
            </ERPInfoCard>

            {/* Artículos */}
            <Text style={styles.sectionLabel}>
                Artículos ({(doc.lines ?? []).length})
            </Text>
            <ERPDataTable 
                columns={[
                    { id: "code", label: "Cód.", width: 50 },
                    { id: "desc", label: "Descripción", flex: 1 },
                    { id: "qty", label: "Cant.", width: 50, align: "center" },
                    { id: "total", label: "Total", width: 70, align: "right" },
                ]}
                data={doc.lines ?? []}
                totals={{ total }}
                renderRow={(item: SalesLine) => (
                    <>
                        <Text style={{width: 50, color: theme.colors.muted, fontSize: 11}}>{item.code}</Text>
                        <Text style={{flex: 1, color: theme.colors.text, fontSize: 12, paddingHorizontal: 4}} numberOfLines={2}>{item.description}</Text>
                        <Text style={{width: 50, textAlign: 'center', color: theme.colors.muted, fontSize: 13}}>{item.qty}</Text>
                        <Text style={{width: 70, textAlign: 'right', color: theme.colors.primary, fontSize: 13, fontWeight: '700'}}>${item.total.toFixed(2)}</Text>
                    </>
                )}
            />

            {/* Flujo Documental - Action Sheet Trigger */}
            {(type === "quote" || type === "order") && (
                <>
                    <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Convertir documento</Text>
                    <Pressable 
                        style={({ pressed }) => [styles.flowCard, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]} 
                        onPress={() => setConvertModalVisible(true)}
                    >
                        <View style={styles.flowIconBox}>
                            <Ionicons name="git-branch-outline" size={24} color="#050505" />
                        </View>
                        <View style={styles.flowContent}>
                            <Text style={styles.flowTitle}>Generar documento siguiente</Text>
                            <Text style={styles.flowDesc}>Continuar flujo de venta hacia adelante</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={theme.colors.muted} />
                    </Pressable>
                </>
            )}
        </ScrollView>

        {/* Action Sheet Modal */}
        <Modal
            visible={convertModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setConvertModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.sheetContent}>
                    <View style={styles.sheetHeaderRow}>
                        <Text style={styles.sheetTitle}>Siguiente paso</Text>
                        <Pressable hitSlop={15} onPress={() => setConvertModalVisible(false)} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={theme.colors.muted} />
                        </Pressable>
                    </View>
                    <Text style={styles.sheetSubtitle}>Selecciona el destino para continuar el ciclo de ventas.</Text>

                    <View style={styles.optionsList}>
                        {type === "quote" && (
                            <Pressable 
                                style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardActive]}
                                onPress={() => {
                                    setConvertModalVisible(false);
                                    navigation.navigate("SalesForm", { type: "order", doc: undefined });
                                }}
                            >
                                <View style={[styles.optIconWrap, { backgroundColor: "#FFC10722" }]}>
                                    <Text style={styles.optEmoji}>📦</Text>
                                </View>
                                <View style={styles.optTextBody}>
                                    <Text style={styles.optTitle}>Orden de Venta</Text>
                                    <Text style={styles.optDesc}>Convertir esta oferta en un pedido confirmado.</Text>
                                </View>
                            </Pressable>
                        )}

                        {(type === "quote" || type === "order") && (
                            <Pressable 
                                style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardActive]}
                                onPress={() => {
                                    setConvertModalVisible(false);
                                    navigation.navigate("SalesForm", { type: "invoice", doc: undefined });
                                }}
                            >
                                <View style={[styles.optIconWrap, { backgroundColor: theme.colors.primary + "22" }]}>
                                    <Text style={styles.optEmoji}>🧾</Text>
                                </View>
                                <View style={styles.optTextBody}>
                                    <Text style={styles.optTitle}>Factura Cliente</Text>
                                    <Text style={styles.optDesc}>Generar factura financiera a partir del documento.</Text>
                                </View>
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: theme.colors.bg },
    container: { padding: theme.spacing.lg, paddingBottom: 60 },
    header: { paddingTop: 60, marginBottom: theme.spacing.lg },
    backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    backText: { color: theme.colors.primary, fontSize: 16, fontWeight: "600", marginLeft: 4 },
    titleRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 },
    icon: { fontSize: 26 },
    title: { color: theme.colors.text, fontSize: 24, fontWeight: "900", flex: 1, letterSpacing: -0.5 },
    sectionLabel: { color: theme.colors.muted, fontSize: 12, fontWeight: "800", letterSpacing: 0.8, marginBottom: 10, textTransform: "uppercase" },
    
    // Flujo Documental Styles
    flowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.primary + "55",
        marginBottom: 20
    },
    flowIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    flowContent: { flex: 1 },
    flowTitle: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 2,
    },
    flowDesc: {
        color: theme.colors.muted,
        fontSize: 13,
        fontWeight: '500',
    },

    // Modal Action Sheet Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    sheetContent: {
        backgroundColor: theme.colors.bg,
        borderTopLeftRadius: theme.radius.xl,
        borderTopRightRadius: theme.radius.xl,
        padding: theme.spacing.lg,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderColor: theme.colors.border,
    },
    sheetHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sheetTitle: {
        color: theme.colors.text,
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    closeBtn: {
        padding: 6,
        backgroundColor: theme.colors.card,
        borderRadius: 20,
    },
    sheetSubtitle: {
        color: theme.colors.muted,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 24,
    },
    optionsList: {
        gap: 12,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        padding: 16,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    optionCardActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + "11",
    },
    optIconWrap: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    optEmoji: {
        fontSize: 24,
    },
    optTextBody: {
        flex: 1,
    },
    optTitle: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 4,
    },
    optDesc: {
        color: theme.colors.muted,
        fontSize: 13,
        lineHeight: 18,
    },
});
