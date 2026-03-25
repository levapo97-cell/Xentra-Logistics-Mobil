import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import ERPSearchBar from "../../components/ERPSearchBar";
import ERPDataTable from "../../components/ERPDataTable";
import ERPStatusBadge from "../../components/ERPStatusBadge";

// Datos de ejemplo según capturas
const DEPARTAMENTOS_INICIAL = [
    { id: "1", codigo: "ADM", nombre: "Administración", lider: "María González", estado: "Activo" },
    { id: "2", codigo: "LOG", nombre: "Logística y Distribución", lider: "Carlos Ramos", estado: "Activo" },
    { id: "3", codigo: "OPE", nombre: "Operaciones / Bodega", lider: "Roberto Mendez", estado: "Activo" },
    { id: "4", codigo: "RHH", nombre: "Recursos Humanos", lider: "Sonia García", estado: "Activo" },
    { id: "5", codigo: "VEN", nombre: "Ventas y Mercadeo", lider: "Juan Pérez", estado: "Activo" },
    { id: "6", codigo: "TEC", nombre: "Tecnología", lider: "Andrés Flores", estado: "Inactivo" },
];

export default function DepartamentosScreen() {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const [departamentos, setDepartamentos] = useState(DEPARTAMENTOS_INICIAL);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<typeof DEPARTAMENTOS_INICIAL[0] | null>(null);
    const [form, setForm] = useState({ codigo: "", nombre: "", lider: "", estado: "Activo" });

    const filteredData = departamentos.filter(d =>
        d.nombre.toLowerCase().includes(search.toLowerCase()) ||
        d.codigo.toLowerCase().includes(search.toLowerCase()) ||
        d.lider.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { id: "codigo", label: "Código", width: 60 },
        { id: "nombre", label: "Nombre", flex: 1.5 },
        { id: "lider", label: "Líder", flex: 1 },
        { id: "estado", label: "Estado", width: 70 },
        { id: "acciones", label: "", width: 40 },
    ];

    const openNew = () => {
        setEditingItem(null);
        setForm({ codigo: "", nombre: "", lider: "", estado: "Activo" });
        setModalVisible(true);
    };

    const openEdit = (item: typeof DEPARTAMENTOS_INICIAL[0]) => {
        setEditingItem(item);
        setForm({ codigo: item.codigo, nombre: item.nombre, lider: item.lider, estado: item.estado });
        setModalVisible(true);
    };

    const handleSave = () => {
        if (editingItem) {
            setDepartamentos(prev => prev.map(d => d.id === editingItem.id ? { ...d, ...form } : d));
        } else {
            const newItem = { id: Date.now().toString(), ...form };
            setDepartamentos(prev => [...prev, newItem]);
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
                <Text style={styles.title}>Departamentos</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search */}
                <ERPSearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Buscar departamento..."
                />

                {/* Table */}
                <ERPDataTable
                    columns={columns}
                    data={filteredData}
                    emptyMessage="No hay departamentos registrados."
                    renderRow={(item) => (
                        <>
                            <Text style={[styles.codeText, { width: 60 }]}>{item.codigo}</Text>
                            <Text style={[styles.cellText, { flex: 1.5 }]} numberOfLines={1}>{item.nombre}</Text>
                            <Text style={[styles.cellText, { flex: 1 }]} numberOfLines={1}>{item.lider}</Text>
                            <View style={{ width: 70 }}>
                                <ERPStatusBadge status={item.estado === "Activo" ? "Aprobada" : "Rechazada"} />
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
                <Text style={styles.fabText}>Nuevo Departamento</Text>
            </Pressable>

            {/* Modal Form */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingItem ? "Editar Departamento" : "Nuevo Departamento"}
                            </Text>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={theme.colors.text} />
                            </Pressable>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Código</Text>
                            <TextInput
                                style={styles.input}
                                value={form.codigo}
                                onChangeText={(t) => setForm({ ...form, codigo: t.toUpperCase() })}
                                placeholder="Ej: ADM"
                                placeholderTextColor={theme.colors.muted}
                                maxLength={4}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Nombre</Text>
                            <TextInput
                                style={styles.input}
                                value={form.nombre}
                                onChangeText={(t) => setForm({ ...form, nombre: t })}
                                placeholder="Nombre del departamento"
                                placeholderTextColor={theme.colors.muted}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Líder</Text>
                            <TextInput
                                style={styles.input}
                                value={form.lider}
                                onChangeText={(t) => setForm({ ...form, lider: t })}
                                placeholder="Nombre del líder"
                                placeholderTextColor={theme.colors.muted}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Estado</Text>
                            <View style={styles.toggleRow}>
                                <Pressable
                                    style={[styles.toggleBtn, form.estado === "Activo" && styles.toggleActive]}
                                    onPress={() => setForm({ ...form, estado: "Activo" })}
                                >
                                    <Text style={[styles.toggleText, form.estado === "Activo" && styles.toggleTextActive]}>Activo</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.toggleBtn, form.estado === "Inactivo" && styles.toggleInactive]}
                                    onPress={() => setForm({ ...form, estado: "Inactivo" })}
                                >
                                    <Text style={[styles.toggleText, form.estado === "Inactivo" && styles.toggleTextActive]}>Inactivo</Text>
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
        fontSize: 20,
        fontWeight: "800",
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },

    // Table cells
    codeText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: "800",
    },
    cellText: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: "600",
    },
    editBtn: {
        width: 40,
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
