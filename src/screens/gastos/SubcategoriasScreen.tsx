import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";
import ERPSearchBar from "../../components/ERPSearchBar";
import ERPDataTable from "../../components/ERPDataTable";
import ERPStatusBadge from "../../components/ERPStatusBadge";

// Datos de ejemplo según capturas
const CATEGORIAS = [
    "Todas las categorías",
    "Papelería y Útiles",
    "Transporte",
    "Mantenimiento",
    "Tecnología",
    "Capacitación",
    "Publicidad",
];

const SUBCATEGORIAS_INICIAL = [
    { id: "1", nombre: "Papelería General", categoria: "Papelería y Útiles", descripcion: "Hojas, lapiceros, folders", estado: "Activa" },
    { id: "2", nombre: "Tóneres e Impresión", categoria: "Papelería y Útiles", descripcion: "Cartuchos y consumibles de impresora", estado: "Activa" },
    { id: "3", nombre: "Combustible", categoria: "Transporte", descripcion: "Gasolina y diésel", estado: "Activa" },
    { id: "4", nombre: "Peajes y Vialidad", categoria: "Transporte", descripcion: "Tasas de circulación y peajes", estado: "Activa" },
    { id: "5", nombre: "Mantenimiento Instalaciones", categoria: "Mantenimiento", descripcion: "Pintura, plomería, electricidad", estado: "Activa" },
    { id: "6", nombre: "Mantenimiento de Maquinaria", categoria: "Mantenimiento", descripcion: "Reparación de equipos y montacargas", estado: "Activa" },
    { id: "7", nombre: "Software y Licencias", categoria: "Tecnología", descripcion: "Suscripciones y licencias de software", estado: "Activa" },
    { id: "8", nombre: "Telecomunicaciones", categoria: "Tecnología", descripcion: "Internet, telefonía y datos", estado: "Activa" },
    { id: "9", nombre: "Talleres Internos", categoria: "Capacitación", descripcion: "Capacitaciones dentro de la empresa", estado: "Activa" },
    { id: "10", nombre: "Cursos Externos", categoria: "Capacitación", descripcion: "Formación fuera de la empresa", estado: "Activa" },
    { id: "11", nombre: "Redes Sociales", categoria: "Publicidad", descripcion: "Publicidad digital y social media", estado: "Activa" },
];

export default function SubcategoriasScreen() {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const [selectedCategoria, setSelectedCategoria] = useState(0);
    const [subcategorias, setSubcategorias] = useState(SUBCATEGORIAS_INICIAL);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<typeof SUBCATEGORIAS_INICIAL[0] | null>(null);
    const [form, setForm] = useState({ nombre: "", categoria: "Papelería y Útiles", descripcion: "", estado: "Activa" });

    const filteredData = subcategorias.filter(s => {
        const matchesSearch = s.nombre.toLowerCase().includes(search.toLowerCase()) ||
            s.descripcion.toLowerCase().includes(search.toLowerCase());
        const matchesCategoria = selectedCategoria === 0 || s.categoria === CATEGORIAS[selectedCategoria];
        return matchesSearch && matchesCategoria;
    });

    const columns = [
        { id: "nombre", label: "Nombre", flex: 1 },
        { id: "categoria", label: "Categoría", flex: 0.8 },
        { id: "estado", label: "Estado", width: 60 },
        { id: "acciones", label: "", width: 36 },
    ];

    const openNew = () => {
        setEditingItem(null);
        setForm({ nombre: "", categoria: "Papelería y Útiles", descripcion: "", estado: "Activa" });
        setModalVisible(true);
    };

    const openEdit = (item: typeof SUBCATEGORIAS_INICIAL[0]) => {
        setEditingItem(item);
        setForm({ nombre: item.nombre, categoria: item.categoria, descripcion: item.descripcion, estado: item.estado });
        setModalVisible(true);
    };

    const handleSave = () => {
        if (editingItem) {
            setSubcategorias(prev => prev.map(s => s.id === editingItem.id ? { ...s, ...form } : s));
        } else {
            const newItem = { id: Date.now().toString(), ...form };
            setSubcategorias(prev => [...prev, newItem]);
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
                <Text style={styles.title}>Subcategorías de Gasto</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search */}
                <ERPSearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Buscar subcategoría..."
                />

                {/* Filter Chip */}
                <Pressable style={styles.filterChip} onPress={() => setFilterModalVisible(true)}>
                    <Text style={styles.filterChipText}>{CATEGORIAS[selectedCategoria]}</Text>
                    <Ionicons name="chevron-down" size={16} color={theme.colors.muted} />
                </Pressable>

                {/* Table */}
                <ERPDataTable
                    columns={columns}
                    data={filteredData}
                    emptyMessage="No hay subcategorías registradas."
                    renderRow={(item) => (
                        <>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cellText} numberOfLines={1}>{item.nombre}</Text>
                                <Text style={styles.descText} numberOfLines={1}>{item.descripcion}</Text>
                            </View>
                            <View style={{ flex: 0.8 }}>
                                <Text style={styles.categoryTag}>{item.categoria}</Text>
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
                <Text style={styles.fabText}>Nueva Subcategoría</Text>
            </Pressable>

            {/* Filter Modal */}
            <Modal visible={filterModalVisible} animationType="fade" transparent>
                <Pressable style={styles.filterModalOverlay} onPress={() => setFilterModalVisible(false)}>
                    <View style={styles.filterModalContent}>
                        <Text style={styles.filterModalTitle}>Filtrar por categoría</Text>
                        {CATEGORIAS.map((cat, i) => (
                            <Pressable
                                key={cat}
                                style={[styles.filterOption, selectedCategoria === i && styles.filterOptionActive]}
                                onPress={() => {
                                    setSelectedCategoria(i);
                                    setFilterModalVisible(false);
                                }}
                            >
                                <Text style={[styles.filterOptionText, selectedCategoria === i && styles.filterOptionTextActive]}>
                                    {cat}
                                </Text>
                                {selectedCategoria === i && (
                                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                                )}
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>

            {/* Form Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingItem ? "Editar Subcategoría" : "Nueva Subcategoría"}
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
                                placeholder="Nombre de la subcategoría"
                                placeholderTextColor={theme.colors.muted}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Categoría</Text>
                            <Pressable
                                style={styles.selectInput}
                                onPress={() => {
                                    // Simple toggle para demo
                                    const cats = CATEGORIAS.slice(1);
                                    const idx = cats.indexOf(form.categoria);
                                    const nextIdx = (idx + 1) % cats.length;
                                    setForm({ ...form, categoria: cats[nextIdx] });
                                }}
                            >
                                <Text style={styles.selectText}>{form.categoria}</Text>
                                <Ionicons name="chevron-down" size={20} color={theme.colors.muted} />
                            </Pressable>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Descripción</Text>
                            <TextInput
                                style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                                value={form.descripcion}
                                onChangeText={(t) => setForm({ ...form, descripcion: t })}
                                placeholder="Descripción de la subcategoría"
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
        fontSize: 17,
        fontWeight: "800",
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },

    // Filter chip
    filterChip: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: theme.colors.card,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 16,
        gap: 6,
    },
    filterChipText: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: "600",
    },

    // Table cells
    cellText: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: "600",
    },
    descText: {
        color: theme.colors.muted,
        fontSize: 11,
        marginTop: 2,
    },
    categoryTag: {
        color: theme.colors.primary,
        fontSize: 11,
        fontWeight: "700",
        backgroundColor: theme.colors.primary + "15",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        overflow: "hidden",
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

    // Filter Modal
    filterModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },
    filterModalContent: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: 20,
        width: "100%",
    },
    filterModalTitle: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 16,
    },
    filterOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    filterOptionActive: {
        backgroundColor: theme.colors.primary + "10",
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    filterOptionText: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: "500",
    },
    filterOptionTextActive: {
        color: theme.colors.primary,
        fontWeight: "700",
    },

    // Form Modal
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
    selectInput: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.colors.input,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 14,
    },
    selectText: {
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
