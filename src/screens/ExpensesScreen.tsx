import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";
import { ExpensesStackParamList } from "../navigation/ExpensesStack";

type Nav = NativeStackNavigationProp<ExpensesStackParamList, "ExpensesHome">;

type MenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    onPress: () => void;
    badge?: number;
};

function MenuItem({ icon, title, subtitle, onPress, badge }: MenuItemProps) {
    return (
        <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={onPress}
        >
            <View style={styles.menuIconWrap}>
                <Ionicons name={icon} size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            {badge !== undefined && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                </View>
            )}
            <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
        </Pressable>
    );
}

export default function ExpensesScreen() {
    const navigation = useNavigation<Nav>();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Gastos</Text>
                <Pressable onPress={() => navigation.navigate("OCRExpense")} style={styles.ocrBtn}>
                    <Ionicons name="scan-outline" size={20} color="#000" />
                    <Text style={styles.ocrText}>Escanear</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <Pressable
                        style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.8 }]}
                        onPress={() => navigation.navigate("ExpenseForm")}
                    >
                        <View style={[styles.quickIconWrap, { backgroundColor: theme.colors.primary + "20" }]}>
                            <Ionicons name="add-circle" size={28} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.quickText}>Nuevo Gasto</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.8 }]}
                        onPress={() => navigation.navigate("OCRExpense")}
                    >
                        <View style={[styles.quickIconWrap, { backgroundColor: theme.colors.warning + "20" }]}>
                            <Ionicons name="camera" size={28} color={theme.colors.warning} />
                        </View>
                        <Text style={styles.quickText}>Escanear Factura</Text>
                    </Pressable>
                </View>

                {/* Menu Section */}
                <Text style={styles.sectionTitle}>Administración</Text>

                <View style={styles.menuSection}>
                    <MenuItem
                        icon="receipt-outline"
                        title="Gastos"
                        subtitle="Ver y procesar facturas de gastos"
                        onPress={() => navigation.navigate("GastosList")}
                    />

                    <MenuItem
                        icon="business-outline"
                        title="Departamentos"
                        subtitle="Gestionar departamentos de la empresa"
                        onPress={() => navigation.navigate("Departamentos")}
                        badge={6}
                    />

                    <MenuItem
                        icon="pricetags-outline"
                        title="Categorías"
                        subtitle="Categorías de clasificación de gastos"
                        onPress={() => navigation.navigate("Categorias")}
                        badge={6}
                    />

                    <MenuItem
                        icon="layers-outline"
                        title="Subcategorías"
                        subtitle="Subcategorías detalladas de gastos"
                        onPress={() => navigation.navigate("Subcategorias")}
                        badge={11}
                    />

                    <MenuItem
                        icon="git-branch-outline"
                        title="Divisiones"
                        subtitle="Sucursales y divisiones geográficas"
                        onPress={() => navigation.navigate("Divisiones")}
                        badge={4}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 60,
        paddingHorizontal: theme.spacing.lg,
        marginBottom: 20,
    },
    title: {
        color: theme.colors.text,
        fontSize: 28,
        fontWeight: "900",
        letterSpacing: -0.5,
    },
    ocrBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
    },
    ocrText: {
        color: "#000",
        fontSize: 13,
        fontWeight: "800",
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },

    // Quick Actions
    quickActions: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 28,
    },
    quickAction: {
        flex: 1,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    quickIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    quickText: {
        color: theme.colors.text,
        fontSize: 13,
        fontWeight: "700",
    },

    // Section
    sectionTitle: {
        color: theme.colors.muted,
        fontSize: 12,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 12,
    },

    // Menu
    menuSection: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: "hidden",
        marginBottom: 30,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    menuItemPressed: {
        backgroundColor: theme.colors.input,
    },
    menuIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: theme.colors.primary + "15",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 2,
    },
    menuSubtitle: {
        color: theme.colors.muted,
        fontSize: 12,
    },
    badge: {
        backgroundColor: theme.colors.primary + "20",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 8,
    },
    badgeText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: "800",
    },
});