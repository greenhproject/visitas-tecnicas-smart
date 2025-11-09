/**
 * Servicio de integración con OpenSolar API
 * Documentación: https://developers.opensolar.com/
 */

const OPENSOLAR_API_URL = "https://api.opensolar.com/api/v2";
const OPENSOLAR_EMAIL = "greenhproject@gmail.com";
const OPENSOLAR_PASSWORD = "Ghp2025@";

interface OpenSolarAuthResponse {
  token: string;
  user: any;
}

/**
 * Obtiene un token de autenticación de OpenSolar
 */
async function getOpenSolarToken(): Promise<string> {
  try {
    const response = await fetch(`${OPENSOLAR_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: OPENSOLAR_EMAIL,
        password: OPENSOLAR_PASSWORD,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error de autenticación OpenSolar: ${response.statusText}`);
    }

    const data: OpenSolarAuthResponse = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error al obtener token de OpenSolar:", error);
    throw error;
  }
}

/**
 * Obtiene información de un proyecto en OpenSolar
 */
export async function getOpenSolarProject(projectId: string): Promise<any> {
  try {
    const token = await getOpenSolarToken();

    const response = await fetch(`${OPENSOLAR_API_URL}/projects/${projectId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener proyecto: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener proyecto de OpenSolar:", error);
    throw error;
  }
}

/**
 * Sube un documento al proyecto en OpenSolar
 */
export async function uploadDocumentToOpenSolar(
  projectId: string,
  documentUrl: string,
  documentName: string
): Promise<void> {
  try {
    const token = await getOpenSolarToken();

    // Primero descargamos el PDF
    const pdfResponse = await fetch(documentUrl);
    if (!pdfResponse.ok) {
      throw new Error("Error al descargar el PDF");
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });

    // Crear FormData para subir el archivo
    const formData = new FormData();
    formData.append("file", pdfBlob, documentName);
    formData.append("project_id", projectId);
    formData.append("document_type", "technical_report");

    const response = await fetch(`${OPENSOLAR_API_URL}/projects/${projectId}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error al subir documento a OpenSolar: ${errorData}`);
    }

    console.log("Documento subido exitosamente a OpenSolar");
  } catch (error) {
    console.error("Error al subir documento a OpenSolar:", error);
    throw error;
  }
}

/**
 * Actualiza las notas de un proyecto en OpenSolar
 */
export async function updateProjectNotes(projectId: string, notes: string): Promise<void> {
  try {
    const token = await getOpenSolarToken();

    const response = await fetch(`${OPENSOLAR_API_URL}/projects/${projectId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes: notes,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar notas del proyecto: ${response.statusText}`);
    }

    console.log("Notas del proyecto actualizadas en OpenSolar");
  } catch (error) {
    console.error("Error al actualizar notas en OpenSolar:", error);
    throw error;
  }
}
