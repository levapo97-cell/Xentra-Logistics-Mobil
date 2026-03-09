import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ViewStyle,
    StyleProp,
    Pressable,
} from "react-native";
import { theme } from "../theme/theme";

type Props = {
    /** Título principal de la card */
    title?: string;
    /** Subtítulo o descripción */
    subtitle?: string;
    /** Contenido personalizado dentro de la card */
    children?: React.ReactNode;
    /** Estilo adicional para el contenedor principal */
    style?: StyleProp<ViewStyle>;
    /** Acción al presionar la card (la hace interactiva) */
    onPress?: () => void;
};

export default function CustomCard({
    title,
    subtitle,
    children,
    style,
    onPress,
}: Props) {
    const Container = onPress ? Pressable : View;

    return (
        <Container
            onPress={onPress}
            style={({ pressed }: { pressed: boolean }) => [
                styles.card,
                style,
                onPress && pressed ? styles.pressed : null,
            ]}
        >
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            {children}
        </Container>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.sm,
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },
    title: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 4,
    },
    subtitle: {
        color: theme.colors.muted,
        fontSize: 13,
        lineHeight: 19,
    },
});
