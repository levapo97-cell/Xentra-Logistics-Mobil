import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

export default function RegisterScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Register (Demo)</Text>
            <Text style={styles.muted}>En el entregable 1 basta con la pantalla y navegación.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg, alignItems: "center", justifyContent: "center" },
    text: { color: theme.colors.text, fontSize: 18, fontWeight: "700" },
    muted: { color: theme.colors.muted, marginTop: 10 },
});