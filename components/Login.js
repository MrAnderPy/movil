import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Reemplazo para Select
import { AuthContext } from '../services/AuthContext'; // Asegúrate de que esta ruta sea correcta
import Toast from 'react-native-toast-message';

const IniciarSesion = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [tipo, setTipo] = useState('1'); // Valor predeterminado

  const handleLogin = async () => {
    const data = { correo, clave, tipo };
  
    try {
      const response = await fetch(`https://batriaccesorios.pythonanywhere.com/iniciar_sesion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.estado) {
          login(responseData.token, responseData.acceso, responseData.id_cliente, responseData.tipo, responseData.tipo_cliente);
          navigation.navigate('Catalogo');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: responseData.msg,
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'El servidor respondió con un estado no esperado.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Ocurrió un error al intentar iniciar sesión.',
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Bienvenido de nuevo</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Iniciar Sesión</Text>
        <TextInput
          style={styles.input}
          placeholder="pepe@gmail.com"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="*******"
          value={clave}
          onChangeText={setClave}
          secureTextEntry
        />
        <Picker
          selectedValue={tipo}
          style={styles.picker}
          onValueChange={(itemValue) => {
            console.log('Tipo seleccionado:', itemValue); // Verifica el valor seleccionado
            setTipo(itemValue);
          }}
        >
          <Picker.Item label="Interno" value="1" />
          <Picker.Item label="Cliente" value="2" />
        </Picker>

        <TouchableOpacity onPress={() => navigation.navigate('Recuperar')} style={styles.recoverLink}>
          <Text>Recuperar Contraseña</Text>
        </TouchableOpacity>
        <Button title="Login" onPress={handleLogin} color="#1E90FF" />
        <TouchableOpacity onPress={() => navigation.navigate('Registro')} style={styles.registerLink}>
          <Text style={styles.registerText}>Registro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  recoverLink: {
    marginBottom: 16,
    alignItems: 'center',
  },
  registerLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerText: {
    color: '#1E90FF',
  },
});

export default IniciarSesion;
