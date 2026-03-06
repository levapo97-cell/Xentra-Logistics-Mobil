import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

export default function SalesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales (Offline)</Text>
      <Text style={styles.desc}>
        Aquí irá el flujo: Oferta / Pedido / Orden → cola offline → sincroniza cuando haya señal.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing.lg },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: "800" },
  desc: { color: theme.colors.muted, marginTop: 10, lineHeight: 20 },
});