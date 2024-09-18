import React, { useState, useEffect, useContext } from "react";
import { Modal, Text, View, Button, FlatList, StyleSheet } from "react-native";
import { AuthContext } from "../services/AuthContext";
import fetchData2 from "../services/fetchData2";


export default function DetallePedidoModal({ id_gestion }) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const { token } = useContext(AuthContext);

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchData2(`https://batriaccesorios.pythonanywhere.com/consultar_detalle_pedido/${id_gestion}`, token);
        setData(data);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };

    fetchData();
  }, [token, id_gestion]);

  return (
    <>
      <Button title="Ver Pedido" onPress={handleOpen} />
      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ver pedido</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id_producto.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>Producto: {item.nombre_producto}</Text>
                <Text style={styles.itemText}>Precio: {item.precio_unitario}</Text>
                <Text style={styles.itemText}>Cantidad: {item.cantidad}</Text>
                <Text style={styles.itemText}>Subtotal: ${item.precio_unitario * item.cantidad}</Text>
              </View>
            )}
          />
          <Button title="Cerrar" onPress={handleClose} />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
  },
});
