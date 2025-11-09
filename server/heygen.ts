/**
 * Funciones para integración con HeyGen Interactive Avatar API (v2)
 */

interface CreateSessionParams {
  quality: "high" | "medium" | "low";
  avatarId: string;
  voiceId: string;
}

interface SessionData {
  session_id: string;
  url: string;
  access_token: string;
  session_duration_limit: number;
  is_paid: boolean;
}

/**
 * Crea una nueva sesión de streaming con HeyGen
 */
export async function createHeyGenSession(params: CreateSessionParams): Promise<SessionData> {
  const apiKey = process.env.HEYGEN_API_KEY;
  
  if (!apiKey) {
    throw new Error("HEYGEN_API_KEY no está configurada");
  }

  try {
    const response = await fetch(
      "https://api.heygen.com/v1/streaming.new",
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quality: params.quality,
          avatar_id: params.avatarId,
          voice: {
            voice_id: params.voiceId,
            rate: 1,
          },
          video_encoding: "VP8",
          version: "v2",
          disable_idle_timeout: false,
          activity_idle_timeout: 120,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de HeyGen API:", errorData);
      throw new Error(`Error de HeyGen API: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.data) {
      throw new Error("Respuesta inválida de HeyGen API");
    }

    return data.data;
  } catch (error) {
    console.error("Error al crear sesión de HeyGen:", error);
    throw error;
  }
}

/**
 * Inicia una sesión de streaming existente
 */
export async function startHeyGenSession(sessionId: string): Promise<{ status: string }> {
  const apiKey = process.env.HEYGEN_API_KEY;
  
  if (!apiKey) {
    throw new Error("HEYGEN_API_KEY no está configurada");
  }

  try {
    const response = await fetch(
      "https://api.heygen.com/v1/streaming.start",
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al iniciar sesión:", errorData);
      throw new Error(`Error al iniciar sesión: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al iniciar sesión de HeyGen:", error);
    throw error;
  }
}

/**
 * Obtiene un token de acceso temporal (deprecado, usar createHeyGenSession)
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

/**
 * Hace que el avatar hable un texto específico
 */
export async function speakHeyGen(sessionId: string, text: string): Promise<{ status: string }> {
  const apiKey = process.env.HEYGEN_API_KEY;
  
  if (!apiKey) {
    throw new Error("HEYGEN_API_KEY no está configurada");
  }

  try {
    const response = await fetch(
      "https://api.heygen.com/v1/streaming.task",
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          text,
          task_type: "talk",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al hacer hablar al avatar:", errorData);
      throw new Error(`Error al hacer hablar al avatar: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en speakHeyGen:", error);
    throw error;
  }
}
