import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { theme } from "../theme/theme";
import CustomCard from "../components/CustomCard";
import {
    SalesDocType,
    TYPE_LABELS,
    TYPE_ICONS,
    TYPE_DESC,
} from "../context/SalesContext";
import { SalesStackParamList } from "../navigation/SalesStack";

type Nav = NativeStackNavigationProp<SalesStackParamList, "SalesHome">;

const PROCESS_STEPS: SalesDocType[] = ["quote", "order", "invoice"];

export default function SalesHomeScreen() {
    const navigation = useNavigation<Nav>();

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.container}
        >
            <Text style={styles.title}>Ventas</Text>
            <Text style={styles.subtitle}>Proceso de ventas</Text>

            {PROCESS_STEPS.map((type, index) => (
                <CustomCard
                    key={type}
                    onPress={() => navigation.navigate("SalesList", { type })}
                    style={styles.card}
                >
                    <View style={styles.row}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeNum}>{index + 1}</Text>
                        </View>
                        <View style={styles.textGroup}>
                            <Text style={styles.icon}>{TYPE_ICONS[type]}</Text>
                            <Text style={styles.cardTitle}>{TYPE_LABELS[type]}</Text>
                            <Text style={styles.cardDesc}>{TYPE_DESC[type]}</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </View>
                </CustomCard>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: theme.colors.bg },
    container: { padding: theme.spacing.lg, paddingBottom: 40 },
    title: {
        color: theme.colors.text,
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 2,
    },
    subtitle: {
        color: theme.colors.muted,
        fontSize: 13,
        marginBottom: theme.spacing.lg,
    },
    card: { marginBottom: theme.spacing.sm },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    badge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeNum: { color: "#fff", fontWeight: "800", fontSize: 15 },
    textGroup: { flex: 1 },
    icon: { fontSize: 20, marginBottom: 2 },
    cardTitle: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: "700",
    },
    cardDesc: {
        color: theme.colors.muted,
        fontSize: 12,
        marginTop: 2,
    },
    arrow: {
        color: theme.colors.muted,
        fontSize: 24,
        lineHeight: 28,
    },
});
