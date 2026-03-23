import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";
import ERPProcessCard from "../components/ERPProcessCard";
import { SalesDocType, TYPE_LABELS, TYPE_DESC } from "../context/SalesContext";
import { SalesStackParamList } from "../navigation/SalesStack";

// Custom Redux Hooks
import { useAppSelector } from "../store/hooks";

type Nav = NativeStackNavigationProp<SalesStackParamList, "SalesHome">;

const PROCESS_STEPS: SalesDocType[] = ["quote", "order", "invoice"];
const ICONS = {
    quote: "document-text-outline" as const,
    order: "cube-outline" as const,
    invoice: "receipt-outline" as const,
};

export default function SalesHomeScreen() {
    const navigation = useNavigation<Nav>();
    
    // Lectura global concurrente! Mostrando persistencia entre pantallas
    const { userInfo, isAuthenticated } = useAppSelector(state => state.user);
    const { totalItems } = useAppSelector(state => state.inventory);

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
            {/* Cabecera persistente para evidencia de Redux */}
            <View style={styles.topInfoRow}>
                {isAuthenticated ? (
                    <Text style={styles.greetingText}>¡Hola, {userInfo?.name.split(' ')[0]}!</Text>
                ) : (
                    <Text style={styles.greetingText}>Modo Invitado</Text>
                )}
                <View style={styles.pillBox}>
                    <Ionicons name="cube" size={14} color={theme.colors.primary} />
                    <Text style={styles.pillText}>{totalItems} artículos locales</Text>
                </View>
            </View>

            <Text style={styles.title}>Ventas</Text>
            <Text style={styles.subtitle}>Proceso de ventas documental</Text>

            {PROCESS_STEPS.map((type) => (
                <ERPProcessCard
                    key={type}
                    title={TYPE_LABELS[type]}
                    description={TYPE_DESC[type]}
                    iconName={ICONS[type]}
                    onPress={() => navigation.navigate("SalesList", { type })}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: theme.colors.bg },
    container: { padding: theme.spacing.lg, paddingBottom: 40, paddingTop: 50 },
    topInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 12 },
    greetingText: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },
    pillBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary + '1A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
    pillText: { color: theme.colors.primary, fontSize: 12, fontWeight: '800' },
    title: {
        color: theme.colors.text,
        fontSize: 28,
        fontWeight: "900",
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    subtitle: {
        color: theme.colors.muted,
        fontSize: 14,
        marginBottom: theme.spacing.xl,
        fontWeight: "500",
    },
});
