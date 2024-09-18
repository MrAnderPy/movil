// src/api/fetchData2.js

const fetchData2 = async (url, token) => {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Obtener información adicional del error, si está disponible
        throw new Error(`Error en la solicitud: ${response.status} - ${errorData.message || 'No se pudo procesar la solicitud'}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('Error en la función fetchData2:', error);
      throw error; // Re-lanzar el error para que pueda ser manejado por el llamador
    }
  };
  
  export default fetchData2;
  