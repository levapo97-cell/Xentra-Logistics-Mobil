import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { theme } from "../theme/theme";
import { isEmailValid } from "../utils/validators";
import { AuthStackParamList } from "../navigation/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "Login"> & {
    onLoginSuccess: () => void;
};

export default function LoginScreen({ navigation, onLoginSuccess }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [touched, setTouched] = useState(false);

    const canLogin = useMemo(
        () => isEmailValid(email) && password.trim().length >= 4,
        [email, password]
    );

    const handleLogin = () => {
        setTouched(true);
        if (!canLogin) return;
        onLoginSuccess();
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
                {/* Header / Brand */}
                <View style={styles.header}>
                    <Image
                        source={require("../../assets/icon.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.brand}>Xentra</Text>
                    <Text style={styles.tagline}>Logística sin límites</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Text style={styles.formTitle}>Iniciar sesión</Text>

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
                        placeholder="••••••••"
                        type="password"
                        required
                        touched={touched}
                    />

                    <CustomButton
                        title="Ingresar"
                        onPress={handleLogin}
                        disabled={touched && !canLogin}
                        variant="primary"
                        style={{ marginTop: 8 }}
                    />

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>o</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.registerLink}
                        onPress={() => navigation.navigate("Register")}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.registerText}>
                            ¿No tienes cuenta?{" "}
                            <Text style={styles.registerAccent}>Regístrate</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: theme.colors.bg },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: 40,
    },
    // Header
    header: { alignItems: "center", marginBottom: 40 },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        marginBottom: 12,
    },
    brand: {
        color: theme.colors.text,
        fontSize: 28,
        fontWeight: "800",
        letterSpacing: 1,
    },
    tagline: {
        color: theme.colors.muted,
        fontSize: 13,
        marginTop: 4,
        letterSpacing: 0.3,
    },
    // Form
    form: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    formTitle: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: theme.spacing.lg,
    },
    // Divider
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: theme.spacing.md,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
    dividerText: {
        color: theme.colors.muted,
        marginHorizontal: 12,
        fontSize: 12,
    },
    // Register link
    registerLink: { alignItems: "center", paddingVertical: 4 },
    registerText: { color: theme.colors.muted, fontSize: 14 },
    registerAccent: { color: theme.colors.primary, fontWeight: "700" },
});