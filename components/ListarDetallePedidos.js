import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const ListarDetallePedidos = ({ route }) => {
  const { idPedido } = route.params;
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetallePedido();
  }, []);

  const fetchDetallePedido = async () => {
    try {
      const response = await fetch(`https://batriaccesorios.pythonanywhere.com/listarDetallePedidos/${idPedido}`);
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error('Error al obtener los detalles del pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <FlatList
      data={details}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.nombre_producto}</Text>
          <Text style={styles.details}>
            Cantidad: {item.cantidad_detallePedido}{'\n'}
            Valor del Producto: ${item.valor_producto}{'\n'}
            Subtotal: ${item.subtotal}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#404041',
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    color: '#FFFFFF',
    marginVertical: 10,
  },
});

export default ListarDetallePedidos;
