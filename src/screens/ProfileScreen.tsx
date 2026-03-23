import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import ERPButton from '../components/ERPButton';
import { setTheme } from '../store/slices/appSlice';
import { logoutUser } from '../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function ProfileScreen() {
    // 1. Instanciamos nuestros custom hooks tipados de Redux
    const dispatch = useAppDispatch();
    
    // 2. Leemos la data global: Tema Oscuro y Datos de Usuario
    const currentTheme = useAppSelector(state => state.app.theme);
    const { user, isAuthenticated } = useAppSelector(state => state.user);
    const { totalItems } = useAppSelector(state => state.inventory);
    
    const isDark = currentTheme === 'dark';
    const [language, setLanguage] = useState<'es' | 'en'>('es');

    const toggleTheme = () => {
        dispatch(setTheme(isDark ? 'light' : 'dark'));
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'es' ? 'en' : 'es');
    };

    // 3. Acciones de Autenticación
    const handleLogout = async () => {
        const { supabase } = require('../lib/supabase');
        await supabase.auth.signOut();
        dispatch(logoutUser());
    };

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
            <Text style={styles.title}>Perfil Global</Text>
            
            {/* Panel de Autenticación */}
            {!isAuthenticated ? (
                <View style={[styles.identityCard, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                    <Text style={[styles.sectionLabel, { marginLeft: 0, marginBottom: 12 }]}>ESTADO: NO AUTENTICADO</Text>
                    <Text style={{color: theme.colors.muted, marginBottom: 20}}>
                        Debes iniciar sesión para ver tu perfil corporativo.
                    </Text>
                </View>
            ) : (
                <View style={styles.identityCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <View style={styles.identityInfo}>
                        <Text style={styles.name}>{user?.email?.split('@')[0] || 'Usuario'}</Text>
                        <Text style={styles.role}>{user?.email}</Text>
                        <Text style={{color: theme.colors.primary, fontSize: 11, fontWeight: '800', marginTop: 4}}>
                            SESIÓN ACTIVA (SUPABASE)
                        </Text>
                    </View>
                </View>
            )}

            {/* Preferencias de Hardware y Redux */}
            <Text style={styles.sectionLabel}>PREFERENCIAS DE APLICACIÓN</Text>
            
            <View style={styles.settingsGroup}>
                <View style={[styles.settingRow, styles.borderBottom]}>
                    <View style={styles.settingIconText}>
                        <Ionicons name="moon" size={20} color={theme.colors.muted} />
                        <Text style={styles.settingLabel}>Modo Oscuro global</Text>
                    </View>
                    <Switch 
                        value={isDark} 
                        onValueChange={toggleTheme} 
                        trackColor={{ true: theme.colors.primary, false: '#333' }}
                        thumbColor="#fff"
                    />
                </View>

                {isAuthenticated && (
                     <View style={styles.settingRow}>
                        <View style={styles.settingIconText}>
                            <Ionicons name="cube-outline" size={20} color={theme.colors.muted} />
                            <Text style={styles.settingLabel}>Items globales en memoria:</Text>
                        </View>
                        <Text style={styles.versionText}>{totalItems} productos</Text>
                    </View>
                )}
            </View>

            {isAuthenticated && (
                <ERPButton 
                    title="Cerrar Sesión Segura" 
                    variant="danger" 
                    icon={<Ionicons name="log-out-outline" size={20} color="#000" />}
                    onPress={handleLogout} 
                    style={{ marginTop: 24, marginBottom: 40 }}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: theme.colors.bg },
    container: { padding: theme.spacing.lg, paddingTop: 60 },
    title: { color: theme.colors.text, fontSize: 28, fontWeight: '900', marginBottom: 24, letterSpacing: -0.5 },
    
    identityCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: theme.colors.card, 
        padding: 20, 
        borderRadius: theme.radius.lg, 
        borderWidth: 1, 
        borderColor: theme.colors.border,
        marginBottom: 30
    },
    avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    avatarText: { color: '#000', fontSize: 28, fontWeight: '900' },
    identityInfo: { flex: 1 },
    name: { color: theme.colors.text, fontSize: 20, fontWeight: '800', marginBottom: 2 },
    role: { color: theme.colors.muted, fontSize: 13, fontWeight: '600' },
    
    sectionLabel: { color: theme.colors.muted, fontSize: 12, fontWeight: "800", letterSpacing: 0.8, marginBottom: 10, textTransform: "uppercase", marginLeft: 4 },
    settingsGroup: {
        backgroundColor: theme.colors.card, 
        borderRadius: theme.radius.lg, 
        borderWidth: 1, 
        borderColor: theme.colors.border,
        marginBottom: 30,
        overflow: 'hidden'
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    settingIconText: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLabel: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: '600',
    },
    versionText: {
        color: theme.colors.muted,
        fontSize: 14,
        fontWeight: '500',
    }
});