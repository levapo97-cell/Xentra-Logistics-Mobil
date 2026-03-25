import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import ERPSearchBar from "../../components/ERPSearchBar";
import ERPDataTable from "../../components/ERPDataTable";
import ERPStatusBadge from "../../components/ERPStatusBadge";

// Datos de ejemplo según capturas
const CATEGORIAS_INICIAL = [
    { id: "1", nombre: "Papelería y Útiles", descripcion: "Material de oficina y consumibles", subcategorias: 2, estado: "Activa" },
    { id: "2", nombre: "Transporte", descripcion: "Combustible, peajes y logística", subcategorias: 2, estado: "Activa" },
    { id: "3", nombre: "Mantenimiento", descripcion: "Reparaciones de equipo e instalaciones", subcategorias: 2, estado: "Activa" },
    { id: "4", nombre: "Tecnología", descripcion: "Software, hardware y telecomunicaciones", subcategorias: 2, estado: "Activa" },
    { id: "5", nombre: "Capacitación", descripcion: "Formación y desarrollo del personal", subcategorias: 2, estado: "Activa" },
    { id: "6", nombre: "Publicidad", descripcion: "Marketing, publicidad y promociones", subcategorias: 2, estado: "Activa" },
];

export default function CategoriasScreen() {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const [categorias, setCategorias] = useState(CATEGORIAS_INICIAL);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<typeof CATEGORIAS_INICIAL[0] | null>(null);
    const [form, setForm] = useState({ nombre: "", descripcion: "", estado: "Activa" });

    const filteredData = categorias.filter(c =>
        c.nombre.toLowerCase().includes(search.toLowerCase()) ||
        c.descripcion.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { id: "nombre", label: "Nombre", flex: 1 },
        { id: "descripcion", label: "Descripción", flex: 1.5 },
        { id: "subcategorias", label: "Sub", width: 40, align: "center" as const },
        { id: "estado", label: "Estado", width: 60 },
        { id: "acciones", label: "", width: 36 },
    ];

    const openNew = () => {
        setEditingItem(null);
        setForm({ nombre: "", descripcion: "", estado: "Activa" });
        setModalVisible(true);
    };

    const openEdit = (item: typeof CATEGORIAS_INICIAL[0]) => {
        setEditingItem(item);
        setForm({ nombre: item.nombre, descripcion: item.descripcion, estado: item.estado });
        setModalVisible(true);
    };

    const handleSave = () => {
        if (editingItem) {
            setCategorias(prev => prev.map(c => c.id === editingItem.id ? { ...c, ...form, subcategorias: c.subcategorias } : c));
        } else {
            const newItem = { id: Date.now().toString(), ...form, subcategorias: 0 };
            setCategorias(prev => [...prev, newItem]);
        }
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={styles.title}>Categorías de Gasto</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search */}
                <ERPSearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Buscar categoría..."
                />

                {/* Table */}
                <ERPDataTable
                    columns={columns}
                    data={filteredData}
                    emptyMessage="No hay categorías registradas."
                    renderRow={(item) => (
                        <>
                            <Text style={[styles.cellText, { flex: 1 }]} numberOfLines={1}>{item.nombre}</Text>
                            <Text style={[styles.descText, { flex: 1.5 }]} numberOfLines={2}>{item.descripcion}</Text>
                            <View style={[styles.countBadge, { width: 40 }]}>
                                <Text style={styles.countText}>{item.subcategorias}</Text>
                            </View>
                            <View style={{ width: 60 }}>
                                <ERPStatusBadge status={item.estado === "Activa" ? "Aprobada" : "Rechazada"} />
                            </View>
                            <Pressable onPress={() => openEdit(item)} style={styles.editBtn}>
                                <Ionicons name="pencil" size={16} color={theme.colors.muted} />
                            </Pressable>
                        </>
                    )}
                />
            </ScrollView>

            {/* FAB */}
            <Pressable
                style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
                onPress={openNew}
            >
                <Ionicons name="add" size={24} color="#000" />
                <Text style={styles.fabText}>Nueva Categoría</Text>
            </Pressable>

            {/* Modal Form */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingItem ? "Editar Categoría" : "Nueva Categoría"}
                            </Text>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={theme.colors.text} />
                            </Pressable>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Nombre</Text>
                            <TextInput
                                style={styles.input}
                                value={form.nombre}
                                onChangeText={(t) => setForm({ ...form, nombre: t })}
                                placeholder="Nombre de la categoría"
                                placeholderTextColor={theme.colors.muted}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Descripción</Text>
                            <TextInput
                                style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                                value={form.descripcion}
                                onChangeText={(t) => setForm({ ...form, descripcion: t })}
                                placeholder="Descripción de la categoría"
                                placeholderTextColor={theme.colors.muted}
                                multiline
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Estado</Text>
                            <View style={styles.toggleRow}>
                                <Pressable
                                    style={[styles.toggleBtn, form.estado === "Activa" && styles.toggleActive]}
                                    onPress={() => setForm({ ...form, estado: "Activa" })}
                                >
                                    <Text style={[styles.toggleText, form.estado === "Activa" && styles.toggleTextActive]}>Activa</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.toggleBtn, form.estado === "Inactiva" && styles.toggleInactive]}
                                    onPress={() => setForm({ ...form, estado: "Inactiva" })}
                                >
                                    <Text style={[styles.toggleText, form.estado === "Inactiva" && styles.toggleTextActive]}>Inactiva</Text>
                                </Pressable>
                            </View>
                        </View>

                        <Pressable style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveBtnText}>Guardar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
        fontSize: 18,
        fontWeight: "800",
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },

    // Table cells
    cellText: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: "600",
    },
    descText: {
        color: theme.colors.muted,
        fontSize: 12,
    },
    countBadge: {
        backgroundColor: theme.colors.primary + "20",
        borderRadius: 12,
        paddingVertical: 4,
        alignItems: "center",
    },
    countText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: "800",
    },
    editBtn: {
        width: 36,
        alignItems: "center",
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

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: theme.colors.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    modalTitle: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: "800",
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        color: theme.colors.muted,
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.colors.input,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 14,
        color: theme.colors.text,
        fontSize: 15,
    },
    toggleRow: {
        flexDirection: "row",
        gap: 12,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: "center",
    },
    toggleActive: {
        backgroundColor: theme.colors.primary + "20",
        borderColor: theme.colors.primary,
    },
    toggleInactive: {
        backgroundColor: theme.colors.danger + "20",
        borderColor: theme.colors.danger,
    },
    toggleText: {
        color: theme.colors.muted,
        fontSize: 14,
        fontWeight: "600",
    },
    toggleTextActive: {
        color: theme.colors.text,
    },
    saveBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: theme.radius.md,
        alignItems: "center",
        marginTop: 8,
    },
    saveBtnText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "800",
    },
});
