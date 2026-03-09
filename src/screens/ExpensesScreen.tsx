import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { theme } from "../theme/theme";
import CustomCard from "../components/CustomCard";
import { useExpenses } from "../context/ExpensesContext";

export default function ExpensesScreen() {
  const { expenses, total } = useExpenses();

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Text style={styles.title}>Gastos — Caja Chica</Text>
      <Text style={styles.desc}>
        Registro de gasto con comprobante: proveedor, monto, fecha, foto/recibo.
      </Text>

      {/* Resumen total */}
      <CustomCard style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total registrado</Text>
        <Text style={styles.summaryAmount}>
          ${total.toFixed(2)}
        </Text>
      </CustomCard>

      {/* Lista de gastos */}
      {expenses.length === 0 ? (
        <CustomCard subtitle="No hay gastos registrados aún." />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomCard
              title={item.description}
              subtitle={`${item.category}  •  ${item.date}  •  $${item.amount.toFixed(2)}`}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  desc: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  summaryCard: {
    marginBottom: theme.spacing.md,
    alignItems: "center",
  },
  summaryLabel: {
    color: theme.colors.muted,
    fontSize: 13,
    marginBottom: 4,
  },
  summaryAmount: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: "800",
  },
});