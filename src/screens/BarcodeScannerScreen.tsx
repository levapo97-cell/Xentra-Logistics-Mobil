import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { theme } from '../theme/theme';
import { addProduct } from '../store/slices/inventorySlice';

const { width } = Dimensions.get('window');

export default function BarcodeScannerScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
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
                Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, useNativeDriver: true })
            ])
        ).start();
    }, [scanLineAnim]);

    if (hasPermission === null) return <View style={styles.container} />;
    if (hasPermission === false) return (
        <View style={styles.container}>
            <Text style={{color: '#fff'}}>Sin acceso a la cámara</Text>
        </View>
    );

    const handleBarcodeScanned = (result: BarcodeScanningResult) => {
        if (scanned) return;
        setScanned(true);

        const newId = Date.now().toString();
        
        // Registrar producto escaneado nativamente al Redux (transaccional global)
        dispatch(addProduct({
            id: newId,
            code: result.data,
            description: "Producto autodetectado (Barcode " + result.data.substring(0, 5) + "...) ",
            price: Math.floor(Math.random() * 100) + 10,
            stock: 1
        }));

        setTimeout(() => {
            navigation.goBack();
        }, 800);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
                    <Ionicons name="chevron-down" size={28} color="#fff" />
                </Pressable>
            </View>

            <CameraView 
                style={StyleSheet.absoluteFillObject} 
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "ean13", "ean8", "pdf417", "aztec", "datamatrix", "code39", "code128"]
                }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />
            
            <View style={styles.overlay}>
                <View style={styles.scanBoxWrap}>
                    <View style={styles.scanBoxCorners} />
                    <Animated.View style={[
                        styles.scanLine,
                        { transform: [{ translateY: scanLineAnim.interpolate({ inputRange: [0, 1], outputRange: [200, -200] }) }] }
                    ]} />
                </View>
                <Text style={styles.instruction}>
                    {scanned ? "Lectura exitosa. Guardando..." : "Alinea el código de barras en el recuadro"}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
    backBtn: { padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scanBoxWrap: { width: width * 0.7, height: 200, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', position: 'relative', overflow: 'hidden' },
    scanBoxCorners: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 4, borderColor: theme.colors.primary, borderRadius: 12 },
    scanLine: { position: 'absolute', left: 0, right: 0, top: '50%', height: 2, backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary, shadowOpacity: 1, shadowRadius: 8, elevation: 4 },
    instruction: { color: '#fff', marginTop: 24, fontSize: 14, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, overflow: 'hidden' }
});
