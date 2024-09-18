// services/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const parseJSON = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);  // Inicializa como null
  const [access, setAccess] = useState({});
  const [idCliente, setIdCliente] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [tipoCliente, setTipoCliente] = useState(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      const savedAccess = await AsyncStorage.getItem("access");
      const savedIdCliente = await AsyncStorage.getItem("id_cliente");
      const savedTipo = await AsyncStorage.getItem("tipo");
      const savedTipoCliente = await AsyncStorage.getItem("tipoCliente");

      setToken(savedToken || null); // Si no hay token, asigna null
      setAccess(parseJSON(savedAccess) || {});
      setIdCliente(parseJSON(savedIdCliente));
      setTipo(parseJSON(savedTipo));
      setTipoCliente(parseJSON(savedTipoCliente));
    };

    loadAuthData();
  }, []);

  const login = async (newToken, accessData, idCliente, tipo, tipoCliente) => {
    setToken(newToken);
    await AsyncStorage.setItem("token", newToken);

    setAccess(accessData);
    await AsyncStorage.setItem("access", JSON.stringify(accessData));

    setIdCliente(idCliente);
    await AsyncStorage.setItem("id_cliente", JSON.stringify(idCliente));

    setTipo(tipo);
    await AsyncStorage.setItem("tipo", JSON.stringify(tipo));

    setTipoCliente(tipoCliente);
    await AsyncStorage.setItem("tipoCliente", JSON.stringify(tipoCliente));
  };

  const logout = async () => {
    setToken(null); // Establecer token como null al cerrar sesión
    await AsyncStorage.removeItem("token");

    setAccess({});
    await AsyncStorage.removeItem("access");

    setIdCliente(null);
    await AsyncStorage.removeItem("id_cliente");

    setTipo(null);
    await AsyncStorage.removeItem("tipo");

    setTipoCliente(null);
    await AsyncStorage.removeItem("tipoCliente");
  };

  return (
    <AuthContext.Provider value={{ token, access, idCliente, tipo, tipoCliente, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
