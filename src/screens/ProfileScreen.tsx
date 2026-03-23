import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import ERPButton from '../components/ERPButton';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>L</Text>
        </View>
        <Text style={styles.name}>Leonel</Text>
        <Text style={styles.role}>Administrador Financiero</Text>
      </View>

      <ERPButton 
        title="Cerrar Sesión" 
        variant="danger" 
        onPress={() => {
            if (logout) logout();
        }} 
        style={{ marginTop: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing.lg, paddingTop: 60 },
  title: { color: theme.colors.text, fontSize: 28, fontWeight: '900', marginBottom: 24, letterSpacing: -0.5 },
  card: { backgroundColor: theme.colors.card, padding: 30, borderRadius: theme.radius.lg, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { color: '#000', fontSize: 32, fontWeight: '900' },
  name: { color: theme.colors.text, fontSize: 20, fontWeight: '800', marginBottom: 4 },
  role: { color: theme.colors.muted, fontSize: 14, fontWeight: '500' }
});