import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { theme } from "../theme/theme";
import ERPProcessCard from "../components/ERPProcessCard";
import { SalesDocType, TYPE_LABELS, TYPE_DESC } from "../context/SalesContext";
import { SalesStackParamList } from "../navigation/SalesStack";

type Nav = NativeStackNavigationProp<SalesStackParamList, "SalesHome">;

const PROCESS_STEPS: SalesDocType[] = ["quote", "order", "invoice"];
const ICONS = {
    quote: "document-text-outline" as const,
    order: "cube-outline" as const,
    invoice: "receipt-outline" as const,
};

export default function SalesHomeScreen() {
    const navigation = useNavigation<Nav>();

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
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
    container: { padding: theme.spacing.lg, paddingBottom: 40, paddingTop: 60 },
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
