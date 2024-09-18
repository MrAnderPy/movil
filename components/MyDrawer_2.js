import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../services/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asegúrate de tener instalado este paquete

const MyDrawer_2 = (props) => {
  const navigation = useNavigation();
  const { token, logout, idCliente } = useContext(AuthContext) || {};




  return (
    <DrawerContentScrollView {...props} style={styles.drawer}>
      <View style={styles.drawerHeader} />
      <DrawerItem
        label="Catalogo"
        onPress={() => navigation.navigate('Catalogo')}
      />
      {!token ? (
        <>
          <DrawerItem
            label="Iniciar sesión"
            onPress={() => navigation.navigate('IniciarSesion')}
          />
          <DrawerItem
            label="Recuperar Cuenta"
            onPress={() => navigation.navigate('Recuperar')}
          />
          <DrawerItem
            label="Registro Cuenta"
            onPress={() => navigation.navigate('Registro')}
          />
        </>
      ) : (
        <>
          {/* Mostrar "Pedidos" solo si el usuario es administrador (no tiene idCliente) */}
          {!idCliente && (
            <DrawerItem
            label="Pedidos"
            onPress={() => navigation.navigate('TabTodosbPedidos')}
          />
          )}

          {/* Mostrar "Mis pedidos" si idCliente existe (es un cliente) */}
          {idCliente && (
            <DrawerItem
              label="Mis pedidos"
              onPress={() => navigation.navigate('ListarPedidos')}
            />
          )}

          {/* Solo mostrar el perfil si idCliente existe */}
          {idCliente && (
            <DrawerItem
              label="Mi Perfil"
              onPress={() => navigation.navigate('Perfil')}
            />
          )}

          <DrawerItem
            label="Cerrar sesión"
            onPress={async () => {
              await logout();
              navigation.navigate('IniciarSesion');
            }}
          />
        </>
      )}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
  },
  drawerHeader: {
    height: 150,
    backgroundColor: '#444',
    shadowColor: '#000',
  },
});

export default MyDrawer_2;
