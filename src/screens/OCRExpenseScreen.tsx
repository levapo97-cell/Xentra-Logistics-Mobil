import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function OCRExpenseScreen() {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const scanLineAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
                Animated.timing(scanLineAnim, { toValue: 0, duration: 1500, useNativeDriver: true })
            ])
        ).start();
    }, [scanLineAnim]);

    if (hasPermission === null) return <View style={styles.container} />;
    if (hasPermission === false) return (
        <View style={styles.container}>
            <Text style={{color: '#fff'}}>Sin acceso a la cámara</Text>
        </View>
    );

    const handleSimulateScan = () => {
        setScanned(true);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.goBack();
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
                    <Ionicons name="close" size={28} color="#fff" />
                </Pressable>
            </View>

            <CameraView style={StyleSheet.absoluteFillObject} facing="back" />
            
            <View style={styles.overlay}>
                <View style={styles.scanBoxWrap}>
                    <View style={styles.scanBoxCorners} />
                    <Animated.View style={[
                        styles.scanLine,
                        { transform: [{ translateY: scanLineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 240] }) }] }
                    ]} />
                </View>
                <Text style={styles.instruction}>Encuadra el recibo o factura para escanear</Text>
            </View>

            <View style={styles.bottomBar}>
                {loading ? (
                    <View style={styles.loaderWrap}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loaderText}>Procesando extracción IA...</Text>
                    </View>
                ) : (
                    <Pressable style={({ pressed }) => [styles.captureBtn, pressed && { opacity: 0.8 }]} onPress={handleSimulateScan}>
                        <View style={styles.captureInner} />
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
    backBtn: { padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scanBoxWrap: { width: width * 0.8, height: width * 1.1, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', position: 'relative', overflow: 'hidden' },
    scanBoxCorners: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 4, borderColor: theme.colors.primary, borderRadius: 12 },
    scanLine: { width: '100%', height: 3, backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, elevation: 4 },
    instruction: { color: '#fff', marginTop: 20, fontSize: 16, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, overflow: 'hidden' },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 },
    captureBtn: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.primary },
    loaderWrap: { alignItems: 'center' },
    loaderText: { color: '#fff', marginTop: 12, fontSize: 13, fontWeight: '600' }
});
