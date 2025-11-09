/**
 * Funciones para integración con HeyGen Interactive Avatar API
 */

/**
 * Obtiene un token de acceso temporal para el Streaming Avatar SDK
 * Este token se genera en el servidor y se envía al cliente
 */
export async function getHeyGenAccessToken(): Promise<string> {
  const apiKey = process.env.HEYGEN_API_KEY;
  
  if (!apiKey) {
    throw new Error("HEYGEN_API_KEY no está configurada");
  }

  try {
    const response = await fetch(
      "https://api.heygen.com/v1/streaming.create_token",
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error de HeyGen API: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data.token) {
      throw new Error("Respuesta inválida de HeyGen API");
    }

    return data.data.token;
  } catch (error) {
    console.error("Error al obtener token de HeyGen:", error);
    throw error;
  }
}

/**
 * Lista los avatares disponibles en la cuenta de HeyGen
 */
export async function listHeyGenAvatars() {
  const apiKey = process.env.HEYGEN_API_KEY;
  
  if (!apiKey) {
    throw new Error("HEYGEN_API_KEY no está configurada");
  }

  try {
    const response = await fetch(
      "https://api.heygen.com/v2/avatars",
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al listar avatares: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.avatars || [];
  } catch (error) {
    console.error("Error al listar avatares:", error);
    throw error;
  }
}

/**
 * Lista las voces disponibles en HeyGen
 */
export async function listHeyGenVoices() {
  const apiKey = process.env.HEYGEN_API_KEY;
  
  if (!apiKey) {
    throw new Error("HEYGEN_API_KEY no está configurada");
  }

  try {
    const response = await fetch(
      "https://api.heygen.com/v2/voices",
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al listar voces: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.voices || [];
  } catch (error) {
    console.error("Error al listar voces:", error);
    throw error;
  }
}
