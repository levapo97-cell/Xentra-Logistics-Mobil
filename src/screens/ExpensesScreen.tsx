import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

export default function ExpensesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses (Caja Chica)</Text>
      <Text style={styles.desc}>
        Registro de gasto con comprobante: proveedor, monto, fecha, foto/recibo (más adelante).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing.lg },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: "800" },
  desc: { color: theme.colors.muted, marginTop: 10, lineHeight: 20 },
});