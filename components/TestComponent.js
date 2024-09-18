import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from './services/AuthContext'; // Ajusta la ruta

const TestComponent = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Text>AuthContext no está disponible</Text>;
  }

  const { token, logout } = authContext;

  return (
    <View>
      <Text>Token: {token}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default TestComponent;
