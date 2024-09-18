import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image,  TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Reemplazo para Select
import { AuthContext } from '../services/AuthContext';  
import { StatusBar } from 'expo-status-bar';
import { MyDrawer_2 } from './MyDrawer_2'

export default function Catalogo() {
  const { token, tipoCliente } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('https://batriaccesorios.pythonanywhere.com/consultar_catalogo_productos');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Error fetching products.');
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch('https://batriaccesorios.pythonanywhere.com/consultar_catalogo_categorias');
      const data = await response.json();
      const categoriasActivas = data.filter(categoria => categoria.estado == 1);
      setCategorias(categoriasActivas);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Error fetching categories.');
    }
  };

  const productosFiltrados = productos.filter(producto => 
    (categoriaSeleccionada === 'all' || categoriaSeleccionada === '' || producto.nombre_categoria === categoriaSeleccionada) &&
    (searchTerm ? producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );
  
  
  
  

  const getPrice = (producto) => {
    return tipoCliente === 'mayorista' ? producto.valor_mayorista : producto.valor_unitario;
  };

  return (
   
    <View style={styles.container}>
      <StatusBar style="light-content" />
      
      <TextInput
        style={styles.searchInput}
        placeholder="Producto"
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />

      <Picker
        selectedValue={categoriaSeleccionada}
        onValueChange={(itemValue) => setCategoriaSeleccionada(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Todas las Categorías" value="all" />

        {categorias.map(({ id_categoria, nombre }) => (
          <Picker.Item key={id_categoria} label={nombre} value={nombre} />
        ))}
      </Picker>
      
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <FlatList
        data={productosFiltrados}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: `https://batriaccesorios.pythonanywhere.com/${item.foto}` }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.textContainer}>
              <Text style={styles.productName}>{item.nombre_producto}</Text>
              <Text style={styles.productCategory}>{item.nombre_categoria}</Text>
              <Text style={styles.price}>Precio: ${getPrice(item).toFixed(2)}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id_producto.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 10,
  },
  searchInput: {
    backgroundColor: '#444',
    color: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#444',
    color: '#fff',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#a9cf54',
  },
  productCategory: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#bbb',
    fontWeight: '600',
  },
  addButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#a9cf54',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
