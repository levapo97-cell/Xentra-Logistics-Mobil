import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { theme } from "../theme/theme";
import ERPButton from "../components/ERPButton";
import ERPSearchBar from "../components/ERPSearchBar";
import { RootState } from "../store";
import { clearProducts } from "../store/slices/inventorySlice";
import { InventoryStackParamList } from "../navigation/InventoryStack";

type Nav = NativeStackNavigationProp<InventoryStackParamList, "InventoryHome">;

export default function InventoryListScreen() {
    const navigation = useNavigation<Nav>();
    const dispatch = useDispatch();
    const { items, totalItems } = useSelector((state: RootState) => state.inventory);
    const [query, setQuery] = useState("");

    const filteredItems = items.filter(
        item => item.description.toLowerCase().includes(query.toLowerCase()) || 
                item.code.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Inventario</Text>
                    <Text style={styles.count}>{totalItems} ítems</Text>
                </View>
                <ERPSearchBar value={query} onChangeText={setQuery} placeholder="Buscar por código o producto..." />
            </View>

            {/* List */}
            {filteredItems.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Ionicons name="cube-outline" size={56} color={theme.colors.muted + "44"} />
                    <Text style={styles.emptyTitle}>Almacén vacío</Text>
                    <Text style={styles.emptyDesc}>
                        Usa la cámara para escanear y registrar productos.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredItems}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.leftInfo}>
                                <Text style={styles.code}>{item.code}</Text>
                                <Text style={styles.desc}>{item.description}</Text>
                            </View>
                            <View style={styles.rightInfo}>
                                <Text style={styles.stockLabel}>Stock</Text>
                                <Text style={styles.stockValue}>{item.stock}</Text>
                            </View>
                        </View>
                    )}
                />
            )}

            {/* Acciones base del Store */}
            <View style={styles.bottomBar}>
                {items.length > 0 && (
                    <ERPButton 
                        title="Purgar" 
                        variant="ghost" 
                        icon={<Ionicons name="trash-outline" size={16} color={theme.colors.danger} />}
                        onPress={() => dispatch(clearProducts())}
                    />
                )}
                
                <ERPButton 
                    title="Producto de Prueba" 
                    variant="primary" 
                    icon={<Ionicons name="add-circle-outline" size={16} color="#000" />}
                    onPress={() => dispatch(require('../store/slices/inventorySlice').addProduct({
                        id: Date.now().toString(),
                        code: `TEST-${Math.floor(Math.random() * 9000) + 1000}`,
                        description: `Producto de Prueba (Simulado)`,
                        price: 99.99,
                        stock: 5
                    }))}
                    style={{ marginTop: 12 }}
                />
            </View>

            {/* FAB Scanner */}
            <Pressable
                style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
                onPress={() => navigation.navigate("BarcodeScanner")}
            >
                <Ionicons name="barcode-outline" size={28} color="#000" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg },
    header: { paddingTop: 60, paddingHorizontal: theme.spacing.lg, marginBottom: 10 },
    titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 },
    title: { color: theme.colors.text, fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
    count: { color: theme.colors.primary, fontSize: 13, fontWeight: "700" },
    
    emptyWrap: { flex: 1, justifyContent: "center", alignItems: "center", padding: theme.spacing.xl },
    emptyTitle: { color: theme.colors.text, fontSize: 18, fontWeight: "800", marginTop: 16, marginBottom: 8 },
    emptyDesc: { color: theme.colors.muted, fontSize: 14, textAlign: "center", lineHeight: 22 },

    list: { paddingHorizontal: theme.spacing.lg, paddingBottom: 20 },
    card: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: theme.colors.card, 
        padding: 16, 
        borderRadius: theme.radius.lg, 
        borderWidth: 1, 
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.sm
    },
    leftInfo: { flex: 1, marginRight: 16 },
    code: { color: theme.colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
    desc: { color: theme.colors.text, fontSize: 15, fontWeight: '700' },
    
    rightInfo: { alignItems: 'flex-end', backgroundColor: '#050505', paddingHorizontal: 16, paddingVertical: 10, borderRadius: theme.radius.md },
    stockLabel: { color: theme.colors.muted, fontSize: 10, textTransform: 'uppercase', fontWeight: '800', marginBottom: 2 },
    stockValue: { color: theme.colors.success, fontSize: 16, fontWeight: '900' },

    bottomBar: { position: 'absolute', bottom: 30, left: 24, zIndex: 10 },
    
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
