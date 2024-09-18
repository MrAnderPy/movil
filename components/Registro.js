import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Reemplazo para Select
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

const enviarDatos = async (url, datos) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  });
  return response.json();
};

export function Registro() {
  const navigation = useNavigation(); // Usa useNavigation para obtener el objeto de navegación
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('natural');
  const [tipoIdentificacion, setTipoIdentificacion] = useState('CC');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (datos) => {
    datos.clave = clave;
    datos.confirmar_clave = confirmarClave;
    datos.tipo_identificacion = tipoIdentificacion;
    datos.tipo_usuario = tipoUsuario;
    datos.estado = '1';

    if (clave !== confirmarClave) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: 'Las contraseñas no coinciden'
      });
      return;
    }

    try {
      const response = await fetch('https://batriaccesorios.pythonanywhere.comregistro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });

      const responseText = await response.text();
      console.log('Response Text:', responseText);
      const respuesta = JSON.parse(responseText);

      if (response.ok) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Agregado!',
          text2: respuesta.msg
        });

        // Redirige a la pantalla de inicio de sesión después de un registro exitoso
        navigation.navigate('IniciarSesion');
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error',
          text2: respuesta.msg || 'Ocurrió un error desconocido'
        });
      }
    } catch (error) {
      console.log('Error:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: 'No se pudo conectar con el servidor'
      });
    }
  };

  const handleTipoUsuarioChange = (itemValue) => {
    setTipoUsuario(itemValue);
    setTipoIdentificacion(itemValue === 'juridico' ? 'NIT' : 'CC');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Crea una cuenta en Batri 😊</Text>
      </View>
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="tipo_usuario"
          defaultValue={tipoUsuario}
          render={({ field: { onChange, value } }) => (
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => {
                onChange(itemValue);
                handleTipoUsuarioChange(itemValue);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Natural" value="natural" />
              <Picker.Item label="Jurídico" value="juridico" />
            </Picker>
          )}
        />
        <Controller
          control={control}
          name="tipo_identificacion"
          defaultValue={tipoIdentificacion}
          render={({ field: { onChange, value } }) => (
            tipoUsuario === 'natural' ?
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
              >
                <Picker.Item label="Cédula" value="CC" />
                <Picker.Item label="Cédula de Extranjería" value="CE" />
                <Picker.Item label="Tarjeta de Identidad" value="TI" />
              </Picker> :
              <TextInput
                value={value}
                style={styles.input}
                editable={false}
              />
          )}
        />
        <Controller
          control={control}
          name="id"
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={tipoUsuario === 'juridico' ? 'NIT' : 'Ingresa tu cédula'}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.id && <Text style={styles.errorText}>{errors.id.message}</Text>}
        <Controller
          control={control}
          name="nombre_cliente"
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nombre"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.nombre_cliente && <Text style={styles.errorText}>{errors.nombre_cliente.message}</Text>}
        <Controller
          control={control}
          name="telefono"
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu número de teléfono"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="phone-pad"
            />
          )}
        />
        {errors.telefono && <Text style={styles.errorText}>{errors.telefono.message}</Text>}
        {tipoUsuario === 'juridico' && (
          <Controller
            control={control}
            name="contacto"
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu contacto"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        )}
        {errors.contacto && <Text style={styles.errorText}>{errors.contacto.message}</Text>}
        <Controller
          control={control}
          name="correo"
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu correo"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
            />
          )}
        />
        {errors.correo && <Text style={styles.errorText}>{errors.correo.message}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          secureTextEntry={!passwordVisible}
          onChangeText={setClave}
          value={clave}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text style={styles.toggleText}>{passwordVisible ? 'Ocultar' : 'Mostrar'}</Text>
        </TouchableOpacity>
        {errors.clave && <Text style={styles.errorText}>{errors.clave.message}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Confirma tu contraseña"
          secureTextEntry={!passwordVisible}
          onChangeText={setConfirmarClave}
          value={confirmarClave}
        />
        {errors.confirmar_clave && <Text style={styles.errorText}>{errors.confirmar_clave.message}</Text>}
        <Button title="Registrarse" onPress={handleSubmit(onSubmit)} />
        <TouchableOpacity onPress={() => navigation.navigate('IniciarSesion')}>
          <Text style={styles.linkText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
  },
  toggleText: {
    color: 'blue',
    textAlign: 'right',
    marginVertical: 10,
  },
  linkText: {
    color: 'blue',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default Registro;

