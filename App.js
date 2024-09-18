import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Toast from 'react-native-toast-message';
import Catalogo from './components/Catalogo';
import MyDrawer_2 from './components/MyDrawer_2';
import IniciarSesion from './components/Login';
import Perfil from './components/Perfil';
import { AuthProvider } from './services/AuthContext';
import TabPedidos from './components/ListarPedidos';
import TabTodosbPedidos from './components/ListarTodosLosPedidos';
import ListarDetallePedidos from './components/ListarDetallePedidos';
import Recuperar from './components/recuperar';
import Registro from './components/Registro';
import { RegistroSchema } from './services/RegistroSchema';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <MyDrawer_2 {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#444',
            },
            headerTintColor: '#fff',
            drawerLabelStyle: {
              color: '#fff',
            },
          }}
        >
          <Drawer.Screen name="Catalogo" component={Catalogo} />
          <Drawer.Screen name="IniciarSesion" component={IniciarSesion} />
          <Drawer.Screen name="Perfil" component={Perfil}  />
          
          <Drawer.Screen name="ListarPedidos" component={TabPedidos} />

          <Drawer.Screen name="TabTodosbPedidos" component={TabTodosbPedidos} />


          <Drawer.Screen name="ListarDetallePedidos" component={ListarDetallePedidos} />

          <Drawer.Screen name="Recuperar" component={Recuperar} />
          <Drawer.Screen name="Registro" component={Registro}/>
        </Drawer.Navigator>
      </NavigationContainer>
      <Toast />
    </AuthProvider>
  );
};

export default App;
