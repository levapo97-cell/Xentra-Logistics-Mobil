import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { theme } from "../theme/theme";
import { isEmailValid } from "../utils/validators";
import { AuthStackParamList } from "../navigation/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [touched, setTouched] = useState(false);

    const passwordsMatch = password === confirmPassword;

    const canRegister = useMemo(
        () =>
            name.trim().length >= 2 &&
            isEmailValid(email) &&
            password.trim().length >= 4 &&
            passwordsMatch,
        [name, email, password, confirmPassword]
    );

    const handleRegister = () => {
        setTouched(true);
        if (!canRegister) return;
        Alert.alert(
            "¡Cuenta creada!",
            "Tu cuenta fue registrada correctamente. Ahora puedes iniciar sesión.",
            [{ text: "Ir al login", onPress: () => navigation.navigate("Login") }]
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {/* Back button */}
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={20} color={theme.colors.muted} />
                    <Text style={styles.backText}>Volver al login</Text>
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoMark}>
                        <Ionicons name="person-add-outline" size={28} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.brand}>Crear cuenta</Text>
                    <Text style={styles.tagline}>Únete a Xentra Logistics</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <CustomInput
                        label="Nombre completo"
                        value={name}
                        onChangeText={setName}
                        placeholder="Juan Pérez"
                        type="text"
                        required
                        touched={touched}
                    />

                    <CustomInput
                        label="Correo electrónico"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="correo@empresa.com"
                        type="email"
                        required
                        touched={touched}
                    />

                    <CustomInput
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Mínimo 4 caracteres"
                        type="password"
                        required
                        touched={touched}
                    />

                    <CustomInput
                        label="Confirmar contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Repite tu contraseña"
                        type="password"
                        required
                        touched={touched}
                    />

                    {/* Passwords mismatch error */}
                    {touched && password.length > 0 && !passwordsMatch && (
                        <Text style={styles.errorMsg}>Las contraseñas no coinciden.</Text>
                    )}

                    <CustomButton
                        title="Crear cuenta"
                        onPress={handleRegister}
                        disabled={touched && !canRegister}
                        variant="success"
                        style={{ marginTop: 8 }}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: theme.colors.bg },
    container: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 56,
        paddingBottom: 40,
    },
    // Back
    backBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 28,
    },
    backText: { color: theme.colors.muted, fontSize: 14 },
    // Header
    header: { alignItems: "center", marginBottom: 32 },
    logoMark: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: "rgba(25,195,125,0.10)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(25,195,125,0.25)",
    },
    brand: {
        color: theme.colors.text,
        fontSize: 24,
        fontWeight: "800",
    },
    tagline: {
        color: theme.colors.muted,
        fontSize: 13,
        marginTop: 4,
    },
    // Form
    form: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    errorMsg: {
        color: theme.colors.danger,
        fontSize: 12,
        marginBottom: theme.spacing.sm,
        marginTop: -theme.spacing.sm,
    },
});