import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const PerfilScreen = () => {
    const [perfil, setPerfil] = useState({});
    const [tipo, setTipo] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [token, setToken] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        correo: '',
        clave: '',  // Este campo empezará vacío
        nombre_cliente: '',
        telefono: '',
        estado: '',
        // Agrega más campos según tu API
    });

    const loadInitialData = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedIdCliente = await AsyncStorage.getItem('id_cliente');
            const storedTipo = await AsyncStorage.getItem('tipo');
console.log(storedIdCliente)
            if (storedToken && storedIdCliente && storedTipo) {
                setToken(storedToken);
                setIdCliente(storedIdCliente);
                setTipo(storedTipo);
            } else {
                Toast.show({ type: 'error', text1: 'Error', text2: 'Faltan datos de autenticación.' });
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    };
    
    const fetchPerfil = async () => {
        try {
            const response = await fetch(`https://batriaccesorios.pythonanywhere.com/consultar_perfil/${idCliente}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ tipo })
            });
            const data = await response.json();
            if (data.estado) {
                setPerfil(data);
                setForm({
                    ...data,
                    clave: ''  // No llenar la clave con el valor encriptado del backend
                });
            } else {
                Toast.show({ type: 'error', text1: 'Error', text2: data.msg });
            }
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Hubo un problema al conectar con el servidor.' });
        }
    };

    const handleUpdatePerfil = async () => {
        // Validar que la clave no esté vacía antes de enviar
        if (!form.clave) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'La clave no puede estar vacía.' });
            return;
        }

        try {
            const response = await fetch(`https://batriaccesorios.pythonanywhere.com/actualizar_perfil/${idCliente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...form,
                    tipo
                })
            });
            const data = await response.json();

            if (data.estado) {
                Toast.show({ type: 'success', text1: 'Éxito', text2: data.msg });
                setIsEditing(false);
                fetchPerfil(); // Vuelve a cargar el perfil actualizado
            } else {
                Toast.show({ type: 'error', text1: 'Error', text2: data.msg || 'Error desconocido' });
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Hubo un problema al conectar con el servidor.' });
        }
    };
    
    const handleDeactivatePerfil = async () => {
        try {
            const response = await fetch(`https://batriaccesorios.pythonanywhere.com/desactivar_perfil/${idCliente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    tipo, 
                    estado: '0'  // Estado 0 significa desactivado
                })
            });
            const data = await response.json();
    
            if (data.estado) {
                Toast.show({ type: 'success', text1: 'Éxito', text2: data.msg });
                // Puedes añadir lógica adicional aquí, como cerrar sesión o redirigir al usuario
                // Eliminar datos de sesión
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('id_cliente');
                await AsyncStorage.removeItem('tipo');

                // Redirigir al catálogo y cerrar sesión
                navigation.navigate('Catalogo');
            } else {
                Toast.show({ type: 'error', text1: 'Error', text2: data.msg || 'Error desconocido' });
            }
        } catch (error) {
            console.error('Error al desactivar perfil:', error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Hubo un problema al conectar con el servidor.' });
        }
    };
    

    const handleChangeText = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (token && idCliente && tipo) {
            console.log('Token:', token);
            console.log('ID Cliente:', idCliente);
            console.log('Tipo:', tipo);
            fetchPerfil();
        }
    }, [token, idCliente, tipo]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            {isEditing ? (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Correo"
                        value={form.correo}
                        onChangeText={value => handleChangeText('correo', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Clave"
                        secureTextEntry
                        onChangeText={value => handleChangeText('clave', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={form.nombre_cliente}
                        onChangeText={value => handleChangeText('nombre_cliente', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Teléfono"
                        value={form.telefono}
                        onChangeText={value => handleChangeText('telefono', value)}
                    />
                    <Button title="Guardar" onPress={handleUpdatePerfil} />
                    <Button title="Cancelar" onPress={() => setIsEditing(false)} />
                </View>
            ) : (
                <View>
                    <Text>Correo: {perfil.correo}</Text>
                    <Text>Nombre: {perfil.nombre_cliente}</Text>
                    <Text>Identificación: {perfil.tipo_identificacion} {perfil.id}</Text>
                    <Text>Teléfono: {perfil.telefono}</Text>
                    <Button title="Editar" onPress={() => setIsEditing(true)} />
                    <Button title="Desactivar Perfil" onPress={handleDeactivatePerfil} color="red" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
});

export default PerfilScreen;
