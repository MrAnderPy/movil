import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Reemplazo para Select
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export default function Recuperar() {
  const [open, setOpen] = useState(false);
  const [correo, setCorreo] = useState('');
  const [tipo, setTipo] = useState('');
  const [isDisabled, setIsDisabled] = useState(false); // Estado para controlar el botón
  const navigation = useNavigation(); // Hook de navegación

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    if (!correo || !tipo) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error!',
        text2: 'Por favor, complete todos los campos.'
      });
      return;
    }

    setIsDisabled(true); // Deshabilitar el botón

    const data = { correo, tipo };

    try {
      const response = await fetch(`https://batriaccesorios.pythonanywhere.comrecuperar_cuenta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const respuesta = await response.json();
      console.log("Respuesta:", respuesta); // Agregado para ver la respuesta completa en la consola

      if (response.ok && respuesta.estado) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Éxito!',
          text2: respuesta.msg
        });
        setOpen(false); // Cerrar el modal
        navigation.navigate('IniciarSesion'); // Redirigir al login
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error!',
          text2: respuesta.msg || 'Error al enviar la solicitud.'
        });
      }

    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error!',
        text2: 'Error al enviar la solicitud.'
      });
    } finally {
      setIsDisabled(false); // Habilitar el botón en caso de error
    }
  };

  return (
    <>
      <Button title="Recuperar Contraseña" onPress={handleOpen} color="#000" />
      <Modal
        visible={open}
        transparent={true}
        animationType="slide"
        onRequestClose={handleOpen}
      >
        <View style={styles.modalContainer}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeButton} onPress={handleOpen}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Recuperar mi cuenta</Text>
            <Text style={styles.subtitle}>
              Para recuperar tu cuenta necesitamos tu correo para enviar una clave provisional con la cual podrás iniciar sesión
            </Text>
            <Text style={styles.label}>Tu correo</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={correo}
              onChangeText={setCorreo}
            />
            <Text style={styles.label}>Tipo de usuario</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipo}
                style={styles.picker}
                onValueChange={(itemValue) => setTipo(itemValue)}
              >
                <Picker.Item label="Interno" value="1" />
                <Picker.Item label="Cliente" value="2" />
              </Picker>
            </View>
            <Button
              title="Mandar clave de recuperación"
              onPress={handleSubmit}
              disabled={isDisabled}
              color="#000"
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo transparente
  },
  card: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});
