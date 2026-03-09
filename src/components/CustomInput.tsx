import React, { useMemo } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { theme } from "../theme/theme";
import { isEmailValid, isPhoneValid } from "../utils/validators";

type InputType = "text" | "email" | "password" | "phone";

type Props = {
    label?: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder?: string;
    type?: InputType;
    required?: boolean;
    touched?: boolean; // para mostrar error luego de intentar
};

export default function CustomInput({
    label,
    value,
    onChangeText,
    placeholder,
    type = "text",
    required = false,
    touched = false,
}: Props) {
    const { error, keyboardType, secureTextEntry } = useMemo(() => {
        let err = "";

        const trimmed = value.trim();

        if (required && touched && trimmed.length === 0) {
            err = "Este campo es obligatorio.";
        }

        if (!err && touched && trimmed.length > 0) {
            if (type === "email" && !isEmailValid(trimmed)) err = "Email inválido.";
            if (type === "phone" && !isPhoneValid(trimmed)) err = "Teléfono inválido (solo dígitos).";
        }

        return {
            error: err,
            keyboardType:
                type === "email" ? "email-address" : type === "phone" ? "phone-pad" : "default",
            secureTextEntry: type === "password",
        };
    }, [value, type, required, touched]);

    return (
        <View style={styles.wrapper}>
            {!!label && <Text style={styles.label}>{label}</Text>}

            <View style={[styles.inputContainer, !!error && styles.inputError]}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.muted}
                    keyboardType={keyboardType as any}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={type === "email" ? "none" : "sentences"}
                    style={styles.input}
                />
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginBottom: theme.spacing.md },
    label: { color: theme.colors.text, marginBottom: 6, fontSize: 13, opacity: 0.9 },
    inputContainer: {
        backgroundColor: theme.colors.input,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 12,
    },
    inputError: {
        borderColor: theme.colors.danger, // estilo condicional
    },
    input: { color: theme.colors.text, fontSize: 15 },
    errorText: { marginTop: 6, color: theme.colors.danger, fontSize: 12 },
});