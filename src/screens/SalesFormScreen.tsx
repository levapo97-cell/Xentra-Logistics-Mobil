import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";
import CustomButton from "../components/CustomButton";
import {
    useSales,
    SalesDocType,
    SalesDoc,
    SalesLine,
    SalesDocStatus,
    TYPE_LABELS,
    ALL_STATUSES,
    STATUS_COLORS,
    calcTotal,
} from "../context/SalesContext";
import { SalesStackParamList } from "../navigation/SalesStack";

type Nav = NativeStackNavigationProp<SalesStackParamList, "SalesForm">;
type Route = RouteProp<SalesStackParamList, "SalesForm">;

// ─── Field helper ─────────────────────────────────────────────────────────────

function Field({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    multiline = false,
}: {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder?: string;
    keyboardType?: "default" | "decimal-pad" | "numbers-and-punctuation" | "numeric";
    multiline?: boolean;
}) {
    return (
        <View style={fs.wrapper}>
            <Text style={fs.label}>{label}</Text>
            <View style={[fs.box, multiline && { height: 72 }]}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.muted}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    textAlignVertical={multiline ? "top" : "center"}
                    style={[fs.input, multiline && { paddingTop: 4 }]}
                    autoCapitalize="sentences"
                />
            </View>
        </View>
    );
}

const fs = StyleSheet.create({
    wrapper: { marginBottom: theme.spacing.sm },
    label: { color: theme.colors.text, fontSize: 13, opacity: 0.85, marginBottom: 6 },
    box: {
        backgroundColor: theme.colors.input,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 12,
    },
    input: { color: theme.colors.text, fontSize: 14 },
});

// ─── Line item modal ──────────────────────────────────────────────────────────

type LineModalProps = {
    visible: boolean;
    initial?: SalesLine;
    onSave: (l: SalesLine) => void;
    onClose: () => void;
};

function LineModal({ visible, initial, onSave, onClose }: LineModalProps) {
    const [code, setCode] = useState(initial?.code ?? "");
    const [desc, setDesc] = useState(initial?.description ?? "");
    const [qty, setQty] = useState(initial ? String(initial.qty) : "");
    const [price, setPrice] = useState(initial ? String(initial.unitPrice) : "");

    // reset when modal opens
    React.useEffect(() => {
        if (visible) {
            setCode(initial?.code ?? "");
            setDesc(initial?.description ?? "");
            setQty(initial ? String(initial.qty) : "");
            setPrice(initial ? String(initial.unitPrice) : "");
        }
    }, [visible]);

    const handleSave = () => {
        if (!code.trim() || !desc.trim() || !qty.trim() || !price.trim()) {
            Alert.alert("Campos incompletos", "Completa todos los campos del artículo.");
            return;
        }
        const q = parseFloat(qty.replace(",", "."));
        const p = parseFloat(price.replace(",", "."));
        if (isNaN(q) || isNaN(p) || q <= 0 || p < 0) {
            Alert.alert("Valores inválidos", "Cantidad y precio deben ser números positivos.");
            return;
        }
        onSave({
            id: initial?.id ?? Date.now().toString(),
            code: code.trim(),
            description: desc.trim(),
            qty: q,
            unitPrice: p,
            total: q * p,
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Pressable style={modal.backdrop} onPress={onClose} />
                <View style={modal.sheet}>
                    <Text style={modal.title}>{initial ? "Editar artículo" : "Agregar artículo"}</Text>
                    <Field label="Código" value={code} onChangeText={setCode} placeholder="PRD-001" />
                    <Field label="Descripción" value={desc} onChangeText={setDesc} placeholder="Descripción del artículo" />
                    <View style={{ flexDirection: "row", gap: 8 }}>
                        <View style={{ flex: 1 }}>
                            <Field label="Cantidad" value={qty} onChangeText={setQty} placeholder="0" keyboardType="numeric" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Field label="Precio unitario" value={price} onChangeText={setPrice} placeholder="0.00" keyboardType="decimal-pad" />
                        </View>
                    </View>
                    <View style={{ gap: 8, marginTop: 8 }}>
                        <CustomButton title="Guardar artículo" onPress={handleSave} variant="success" />
                        <CustomButton title="Cancelar" onPress={onClose} variant="danger" outline />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const modal = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
    sheet: {
        backgroundColor: theme.colors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderColor: theme.colors.border,
    },
    title: { color: theme.colors.text, fontSize: 17, fontWeight: "800", marginBottom: theme.spacing.md },
});

// ─── Status picker ────────────────────────────────────────────────────────────

function StatusPicker({
    value,
    onChange,
}: {
    value: SalesDocStatus;
    onChange: (s: SalesDocStatus) => void;
}) {
    return (
        <View style={sp.wrapper}>
            <Text style={sp.label}>Estado</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sp.row}>
                {ALL_STATUSES.map((s) => {
                    const color = STATUS_COLORS[s];
                    const active = s === value;
                    return (
                        <Pressable
                            key={s}
                            onPress={() => onChange(s)}
                            style={[sp.chip, { borderColor: color }, active && { backgroundColor: color + "33" }]}
                        >
                            <Text style={[sp.chipText, { color }]}>{s}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const sp = StyleSheet.create({
    wrapper: { marginBottom: theme.spacing.sm },
    label: { color: theme.colors.text, fontSize: 13, opacity: 0.85, marginBottom: 8 },
    row: { gap: 8, paddingVertical: 4 },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: "transparent",
    },
    chipText: { fontSize: 12, fontWeight: "700" },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SalesFormScreen() {
    const navigation = useNavigation<Nav>();
    const { params } = useRoute<Route>();
    const { type, doc: existingDoc } = params as { type: SalesDocType; doc?: SalesDoc };
    const { addDocument, updateDocument } = useSales();
    const isEdit = !!existingDoc;
    const label = TYPE_LABELS[type];

    // Header fields
    const [number, setNumber] = useState(existingDoc?.number ?? "");
    const [client, setClient] = useState(existingDoc?.client ?? "");
    const [date, setDate] = useState(existingDoc?.date ?? new Date().toISOString().split("T")[0]);
    const [notes, setNotes] = useState(existingDoc?.notes ?? "");
    const [status, setStatus] = useState<SalesDocStatus>(existingDoc?.status ?? "Borrador");

    // Lines
    const [lines, setLines] = useState<SalesLine[]>(existingDoc?.lines ?? []);
    const [lineModal, setLineModal] = useState<{ open: boolean; editing?: SalesLine }>({ open: false });

    const total = calcTotal(lines);

    const openAddLine = () => setLineModal({ open: true, editing: undefined });
    const openEditLine = (l: SalesLine) => setLineModal({ open: true, editing: l });
    const closeLineModal = () => setLineModal({ open: false });

    const saveLine = useCallback((l: SalesLine) => {
        setLines((prev) => {
            const exists = prev.findIndex((x) => x.id === l.id);
            if (exists >= 0) {
                const updated = [...prev];
                updated[exists] = l;
                return updated;
            }
            return [...prev, l];
        });
        closeLineModal();
    }, []);

    const removeLine = (id: string) => {
        Alert.alert("Eliminar artículo", "¿Deseas quitar este artículo?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Eliminar", style: "destructive", onPress: () => setLines((p) => p.filter((l) => l.id !== id)) },
        ]);
    };

    const handleSave = () => {
        if (!number.trim() || !client.trim()) {
            Alert.alert("Campos requeridos", "Completa Número y Cliente.");
            return;
        }
        if (lines.length === 0) {
            Alert.alert("Sin artículos", "Agrega al menos un artículo al documento.");
            return;
        }
        if (isEdit && existingDoc) {
            updateDocument(type, existingDoc.id, { number: number.trim(), client: client.trim(), date, notes: notes.trim() || undefined, status, lines });
        } else {
            addDocument(type, { number: number.trim(), client: client.trim(), date, notes: notes.trim() || undefined, status, lines });
        }
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={22} color={theme.colors.primary} />
                        <Text style={styles.backText}>{isEdit ? TYPE_LABELS[type] : "Lista"}</Text>
                    </Pressable>
                    <Text style={styles.title}>{isEdit ? `Editar ${label}` : `Nuevo ${label}`}</Text>
                </View>

                {/* Cabecera del documento */}
                <Text style={styles.section}>Datos del documento</Text>
                <Field label="Número *" value={number} onChangeText={setNumber} placeholder="OFV-2026-001" />
                <Field label="Cliente *" value={client} onChangeText={setClient} placeholder="Nombre del cliente" />
                <Field label="Fecha (YYYY-MM-DD)" value={date} onChangeText={setDate} placeholder="2026-03-08" keyboardType="numbers-and-punctuation" />
                <Field label="Notas (opcional)" value={notes} onChangeText={setNotes} placeholder="Observaciones..." multiline />

                {/* Estado */}
                <StatusPicker value={status} onChange={setStatus} />

                {/* Artículos */}
                <View style={styles.linesHeader}>
                    <Text style={styles.section}>Artículos</Text>
                    <Pressable onPress={openAddLine} style={styles.addLineBtn}>
                        <Ionicons name="add-circle" size={18} color={theme.colors.primary} />
                        <Text style={styles.addLineTxt}>Añadir</Text>
                    </Pressable>
                </View>

                {lines.length === 0 ? (
                    <Pressable onPress={openAddLine} style={styles.emptyLines}>
                        <Text style={styles.emptyLinesText}>Toca para añadir el primer artículo</Text>
                    </Pressable>
                ) : (
                    <View style={styles.linesTable}>
                        {/* Cabecera tabla */}
                        <View style={[styles.tableRow, styles.tableHead]}>
                            <Text style={[styles.colCode, styles.headText]}>Código</Text>
                            <Text style={[styles.colDesc, styles.headText]}>Descripción</Text>
                            <Text style={[styles.colNum, styles.headText]}>Cant.</Text>
                            <Text style={[styles.colNum, styles.headText]}>Precio</Text>
                            <Text style={[styles.colNum, styles.headText]}>Total</Text>
                            <Text style={[styles.colAct, styles.headText]}> </Text>
                        </View>
                        {lines.map((l) => (
                            <View key={l.id} style={styles.tableRow}>
                                <Text style={styles.colCode}>{l.code}</Text>
                                <Text style={[styles.colDesc, { color: theme.colors.text }]} numberOfLines={2}>{l.description}</Text>
                                <Text style={styles.colNum}>{l.qty}</Text>
                                <Text style={styles.colNum}>${l.unitPrice.toFixed(2)}</Text>
                                <Text style={[styles.colNum, { color: theme.colors.primary, fontWeight: "700" }]}>${l.total.toFixed(2)}</Text>
                                <View style={styles.colAct}>
                                    <Pressable onPress={() => openEditLine(l)} hitSlop={8}>
                                        <Ionicons name="pencil" size={15} color={theme.colors.primary} />
                                    </Pressable>
                                    <Pressable onPress={() => removeLine(l.id)} hitSlop={8} style={{ marginTop: 6 }}>
                                        <Ionicons name="trash" size={15} color={theme.colors.danger} />
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                        {/* Total */}
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total documento</Text>
                            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
                        </View>
                    </View>
                )}

                {/* Botones */}
                <View style={{ marginTop: theme.spacing.lg, gap: 10 }}>
                    <CustomButton title="Guardar" onPress={handleSave} variant="primary" />
                    <CustomButton title="Cancelar" onPress={() => navigation.goBack()} variant="danger" outline />
                </View>

            </ScrollView>

            {/* Modal para líneas */}
            <LineModal
                visible={lineModal.open}
                initial={lineModal.editing}
                onSave={saveLine}
                onClose={closeLineModal}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: theme.colors.bg },
    container: { padding: theme.spacing.lg, paddingBottom: 60 },
    header: { paddingTop: 52, marginBottom: theme.spacing.lg },
    backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    backText: { color: theme.colors.primary, fontSize: 14, marginLeft: 2 },
    title: { color: theme.colors.text, fontSize: 20, fontWeight: "800" },
    section: { color: theme.colors.text, fontSize: 14, fontWeight: "700", marginBottom: theme.spacing.sm, marginTop: 4 },
    linesHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: theme.spacing.sm, marginTop: 4 },
    addLineBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
    addLineTxt: { color: theme.colors.primary, fontSize: 14, fontWeight: "600" },
    emptyLines: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderStyle: "dashed",
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        alignItems: "center",
        marginBottom: theme.spacing.md,
    },
    emptyLinesText: { color: theme.colors.muted, fontSize: 13 },
    linesTable: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: "hidden",
        marginBottom: theme.spacing.md,
    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    tableHead: { backgroundColor: "#0d1526" },
    headText: { color: theme.colors.muted, fontSize: 11, fontWeight: "700" },
    colCode: { width: 60, color: theme.colors.muted, fontSize: 11 },
    colDesc: { flex: 1, color: theme.colors.muted, fontSize: 12, paddingHorizontal: 4 },
    colNum: { width: 58, textAlign: "right", color: theme.colors.muted, fontSize: 12 },
    colAct: { width: 24, alignItems: "center", marginLeft: 6 },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#0d1526",
    },
    totalLabel: { color: theme.colors.muted, fontSize: 13, fontWeight: "600" },
    totalAmount: { color: theme.colors.primary, fontSize: 16, fontWeight: "800" },
});
