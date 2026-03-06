import { View, Text, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import { theme } from "../theme/theme";

export default function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.desc}>Configuraciones básicas del usuario (demo).</Text>

      <CustomButton title="Cerrar sesión" onPress={onLogout} variant="danger" style={{ marginTop: 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing.lg },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: "800" },
  desc: { color: theme.colors.muted, marginTop: 10 },
});