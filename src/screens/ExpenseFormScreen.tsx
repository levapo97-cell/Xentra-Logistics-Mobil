import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import ERPButton from '../components/ERPButton';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createExpense, clearExpenseError } from '../store/slices/expenseSlice';

export default function ExpenseFormScreen() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { loading, error: reduxError } = useAppSelector(state => state.expenses);

    // Contexto de tiempo
    const today = new Date().toISOString().split('T')[0];

    // Datos Fiscales SAR
    const [fecha, setFecha] = useState(today);
    const [cai, setCai] = useState('');
    const [fechaLimiteCai, setFechaLimiteCai] = useState('');
    const [rtnProveedor, setRtnProveedor] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [numeroFactura, setNumeroFactura] = useState('');

    // Detalle Operativo
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('Viáticos');

    // Array de líneas
    const [details, setDetails] = useState<any[]>([]);

    // Línea Actual Form
    const [lineDesc, setLineDesc] = useState('');
    const [lineQty, setLineQty] = useState('1');
    const [linePrice, setLinePrice] = useState('');
    const [lineIsv, setLineIsv] = useState('');

    // UI Local Error State
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        if (reduxError) {
            Alert.alert('Fallo del Servidor', reduxError);
            dispatch(clearExpenseError());
        }
    }, [reduxError, dispatch]);

    // Calcular Totales Head
    let subtotal = 0;
    let isv = 0;
    details.forEach(d => {
        subtotal += d.subtotal;
        isv += d.isv;
    });
    const total = subtotal + isv;

    const isSavable = cai.length > 5 && rtnProveedor.length >= 13 && total > 0 && descripcion.length > 0 && details.length > 0;

    const handleAddLine = () => {
        if (!lineDesc || !linePrice) return;
        const q = parseFloat(lineQty) || 1;
        const p = parseFloat(linePrice) || 0;
        const i = parseFloat(lineIsv) || 0;
        const s = q * p;
        
        setDetails([...details, {
            description: lineDesc,
            quantity: q,
            unit_price: p,
            subtotal: s,
            isv: i,
            total: s + i
        }]);

        // Reset
        setLineDesc('');
        setLineQty('1');
        setLinePrice('');
        setLineIsv('');
    };

    const handleRemoveLine = (index: number) => {
        const d = [...details];
        d.splice(index, 1);
        setDetails(d);
    };

    const handleSave = async () => {
        if (!isSavable) {
            setLocalError("Faltan datos fiscales, descripción o ítems de compra.");
            return;
        }

        const payload = {
            fecha,
            tipo_documento: 'Factura',
            numero_factura: numeroFactura,
            cai,
            fecha_limite_cai: fechaLimiteCai,
            rtn_proveedor: rtnProveedor,
            proveedor,
            descripcion,
            categoria,
            metodo_pago: 'Efectivo',
            subtotal,
            isv,
            total,
            estado: 'Pendiente',
            created_by: 'Móvil App',
            details
        };

        const resultAction = await dispatch(createExpense(payload));
        if (createExpense.fulfilled.match(resultAction)) {
            Alert.alert("✅ Excelente", "Gasto fiscal SAR guardado en bóveda con desglose.");
            navigation.goBack();
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </Pressable>
                    <Text style={styles.headerTitle}>SAR: Nueva Factura (Con Detalle)</Text>
                    <View style={{width: 24}} />
                </View>

                <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
                    
                    {localError && (
                        <View style={styles.errorBox}>
                            <Ionicons name="warning-outline" size={18} color={theme.colors.danger} />
                            <Text style={styles.errorText}>{localError}</Text>
                        </View>
                    )}

                    {/* SECCIÓN 1: DATOS FISCALES */}
                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="document-text" size={20} color={theme.colors.primary} />
                            <Text style={styles.sectionTitle}>1. Datos Fiscales (SAR)</Text>
                        </View>

                        <Text style={styles.label}>CAI Autorizado *</Text>
                        <TextInput style={styles.input} placeholder="XXXXX-XXXXX-..." placeholderTextColor={theme.colors.muted} value={cai} onChangeText={setCai} autoCapitalize="characters" />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <Text style={styles.label}>Fecha Gasto</Text>
                                <TextInput style={styles.input} value={fecha} onChangeText={setFecha} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Text style={styles.label}>Vence CAI</Text>
                                <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={theme.colors.muted} value={fechaLimiteCai} onChangeText={setFechaLimiteCai} />
                            </View>
                        </View>

                        <Text style={styles.label}>RTN Proveedor *</Text>
                        <TextInput style={styles.input} placeholder="14 dígitos obligatorios" placeholderTextColor={theme.colors.muted} keyboardType="numeric" value={rtnProveedor} onChangeText={setRtnProveedor} />

                        <Text style={styles.label}>Razón Social</Text>
                        <TextInput style={styles.input} placeholder="Nombre de quien emite" placeholderTextColor={theme.colors.muted} value={proveedor} onChangeText={setProveedor} />

                        <Text style={styles.label}>Nº Correlativo Factura</Text>
                        <TextInput style={styles.input} placeholder="000-000-00000000" placeholderTextColor={theme.colors.muted} value={numeroFactura} onChangeText={setNumeroFactura} />
                    </View>

                    {/* SECCIÓN 2: MOTIVOS */}
                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="briefcase-outline" size={20} color={theme.colors.warning} />
                            <Text style={styles.sectionTitle}>2. Motivo Global</Text>
                        </View>
                        <Text style={styles.label}>Descripción de la Erogación *</Text>
                        <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="¿Para qué es el gasto?" placeholderTextColor={theme.colors.muted} multiline value={descripcion} onChangeText={setDescripcion} />
                        <Text style={styles.label}>Categoría</Text>
                        <View style={styles.categoryWrap}>
                            {['Viáticos', 'Combustible', 'Logística', 'Oficina'].map(cat => (
                                <Pressable key={cat} style={[styles.catBtn, categoria === cat && styles.catBtnActive]} onPress={() => setCategoria(cat)}>
                                    <Text style={[styles.catText, categoria === cat && styles.catTextActive]}>{cat}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* SECCIÓN 3: DETALLE DE ARTICULOS */}
                    <View style={styles.sectionCard}>
                         <View style={styles.sectionHeader}>
                            <Ionicons name="cart" size={20} color={theme.colors.success} />
                            <Text style={styles.sectionTitle}>3. ¿Qué se compró?</Text>
                        </View>

                        {/* Fila Múltiple Móbile */}
                        <View style={styles.addItemBox}>
                            <TextInput style={[styles.input, { marginBottom: 8 }]} placeholder="Nombre del ítem..." placeholderTextColor={theme.colors.muted} value={lineDesc} onChangeText={setLineDesc} />
                            <View style={styles.row}>
                                <TextInput style={[styles.input, { flex: 1, marginRight: 4 }]} placeholder="Cant. (1)" placeholderTextColor={theme.colors.muted} keyboardType="numeric" value={lineQty} onChangeText={setLineQty} />
                                <TextInput style={[styles.input, { flex: 2, marginHorizontal: 4 }]} placeholder="Precio U." placeholderTextColor={theme.colors.muted} keyboardType="decimal-pad" value={linePrice} onChangeText={setLinePrice} />
                                <TextInput style={[styles.input, { flex: 2, marginLeft: 4 }]} placeholder="ISV L." placeholderTextColor={theme.colors.muted} keyboardType="decimal-pad" value={lineIsv} onChangeText={setLineIsv} />
                            </View>
                            <Pressable style={styles.addLineBtn} onPress={handleAddLine}>
                                <Ionicons name="add" size={20} color="#fff" />
                                <Text style={styles.addLineTxt}>Agregar a Factura</Text>
                            </Pressable>
                        </View>

                        {details.map((d, i) => (
                            <View key={i} style={styles.itemRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemDesc}>{d.description} (x{d.quantity})</Text>
                                    <Text style={styles.itemValues}>P.U: L {d.unit_price.toFixed(2)} | ISV: L {d.isv.toFixed(2)}</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end', marginLeft: 10 }}>
                                    <Text style={styles.itemTotal}>L {d.total.toFixed(2)}</Text>
                                    <Pressable onPress={() => handleRemoveLine(i)} style={{ marginTop: 4 }}>
                                        <Ionicons name="trash" size={18} color={theme.colors.danger} />
                                    </Pressable>
                                </View>
                            </View>
                        ))}

                        <View style={styles.totalBox}>
                            <View>
                                <Text style={styles.totalLabel}>Subtotal: L {subtotal.toFixed(2)}</Text>
                                <Text style={styles.totalLabel}>Impuesto: L {isv.toFixed(2)}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.totalText}>TOTAL A PAGAR</Text>
                                <Text style={styles.totalAmount}>L. {total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    <ERPButton 
                        title={loading ? "Registrando Bóveda..." : "Salvar Factura Deducible"} 
                        variant={isSavable ? "primary" : "outline"} 
                        onPress={handleSave} 
                        style={{ marginVertical: 20 }}
                    />
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingBottom: 20, paddingHorizontal: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    headerTitle: { color: theme.colors.text, fontSize: 18, fontWeight: '800' },
    formContainer: { padding: theme.spacing.lg, paddingBottom: 40 },
    errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.danger + '20', padding: 12, borderRadius: theme.radius.md, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.danger + '50' },
    errorText: { color: theme.colors.danger, fontSize: 13, fontWeight: '700', marginLeft: 8 },
    sectionCard: { backgroundColor: theme.colors.card, padding: theme.spacing.md, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.lg, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: theme.spacing.sm, marginBottom: theme.spacing.sm },
    sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '800', marginLeft: 8, letterSpacing: 0.5 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    label: { color: theme.colors.text, fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 12 },
    input: { backgroundColor: theme.colors.bg, color: theme.colors.text, padding: 14, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, fontSize: 15 },
    categoryWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
    catBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border },
    catBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    catText: { color: theme.colors.muted, fontSize: 12, fontWeight: '600' },
    catTextActive: { color: '#000', fontWeight: '800' },
    addItemBox: { backgroundColor: theme.colors.bg, padding: 12, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 16, marginTop: 8 },
    addLineBtn: { backgroundColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: theme.radius.md, marginTop: 8 },
    addLineTxt: { color: '#fff', fontWeight: '800', marginLeft: 6 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 10, marginBottom: 10 },
    itemDesc: { color: theme.colors.text, fontSize: 14, fontWeight: '700' },
    itemValues: { color: theme.colors.muted, fontSize: 12, marginTop: 2 },
    itemTotal: { color: theme.colors.text, fontSize: 14, fontWeight: '900' },
    totalBox: { marginTop: 16, padding: 16, backgroundColor: theme.colors.primary + '10', borderRadius: theme.radius.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.primary + '50' },
    totalLabel: { color: theme.colors.text, fontSize: 12, fontWeight: '600', opacity: 0.7 },
    totalText: { color: theme.colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
    totalAmount: { color: theme.colors.primary, fontSize: 24, fontWeight: '900' }
});
