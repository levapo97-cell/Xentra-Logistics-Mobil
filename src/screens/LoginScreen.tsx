import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { theme } from "../theme/theme";
import { isEmailValid } from "../utils/validators";

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [touched, setTouched] = useState(false);

    const canLogin = useMemo(() => {
        return isEmailValid(email) && password.trim().length >= 4;
    }, [email, password]);

    const handleLogin = () => {
        setTouched(true);

        if (!canLogin) {
            Alert.alert("Validación", "Revisá el email y la contraseña.");
            return;
        }

        // Simulación login offline (más adelante va supabase / sync)
        onLoginSuccess();
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>

                <Text style={styles.title}>Xentra Mobile</Text>
                <Text style={styles.subtitle}>Ventas offline + Gastos de proyecto</Text>

                <CustomInput
                    label="Email"
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
                    placeholder="••••••••"
                    type="password"
                    required
                    touched={touched}
                />

                <CustomButton
                    title="Ingresar"
                    onPress={handleLogin}
                    disabled={!canLogin}
                    variant="primary"
                />

                <CustomButton
                    title="Crear cuenta (demo)"
                    onPress={() => Alert.alert("Info", "Pantalla Register lista para el entregable.")}
                    outline
                    style={{ marginTop: theme.spacing.sm }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // flexbox
        backgroundColor: theme.colors.bg,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.lg,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    logo: { width: "100%", height: 70, marginBottom: theme.spacing.md },
    title: { color: theme.colors.text, fontSize: 22, fontWeight: "800", textAlign: "center" },
    subtitle: {
        color: theme.colors.muted,
        fontSize: 13,
        textAlign: "center",
        marginBottom: theme.spacing.lg,
    },
});