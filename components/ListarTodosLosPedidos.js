import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Toast from 'react-native-toast-message';
import { AuthContext } from "../services/AuthContext";
import DetallePedidoModal from "./DetallePedidosModal";

const ITEMS_PER_PAGE = 3;

export default function TabTodosbPedidos() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://batriaccesorios.pythonanywhere.com/consultar_pedidos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!data || data.length === 0) {
          Toast.show({
            type: 'info',
            text1: 'Sin Pedidos',
            text2: 'No hay pedidos disponibles.',
          });
        } else {
          setData(data);
        }
      } catch (error) {
        // Mostrar el error en un toast
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `Error al cargar los pedidos: ${error.message}`,
        });
      }
    };

    fetchData();
  }, [token]);

  const totalFilteredPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFilteredPageData = data.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalFilteredPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Todos los pedidos </Text>
      <View style={styles.buttonContainer}>
        <Button title="Anterior" onPress={handlePreviousPage} disabled={currentPage === 1} />
        <Button title="Siguiente" onPress={handleNextPage} disabled={currentPage === totalFilteredPages} />
      </View>
      <View>
  {data.length === 0 ? (
    <Text>No hay pedidos disponibles.</Text>
  ) : (
    currentFilteredPageData.map(({ id_gestion, nombre_cliente, fecha_gestion, total, estado }) => (
      <View key={id_gestion} style={styles.item}>
        <Text style={styles.itemText}>ID: {id_gestion}</Text>
        <Text style={styles.itemText}>Cliente: {nombre_cliente}</Text>
        <Text style={styles.itemText}>Fecha: {fecha_gestion}</Text>
        <Text style={styles.itemText}>Total: {total}</Text>
        <Text style={styles.itemText}>Estado: {estado}</Text>
        <DetallePedidoModal id_gestion={id_gestion} />
      </View>
    ))
  )}
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});
