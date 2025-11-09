import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface EmailMessage {
  to: string[];
  subject: string;
  content: string;
  attachments?: string[];
}

/**
 * Envía un email usando el MCP de Gmail
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  try {
    const emailData = {
      messages: [
        {
          to: message.to,
          subject: message.subject,
          content: message.content,
          attachments: message.attachments || [],
        },
      ],
    };

    const input = JSON.stringify(emailData).replace(/'/g, "\\'");
    const command = `manus-mcp-cli tool call gmail_send_messages --server gmail --input '${input}'`;

    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes("Tool call completed")) {
      console.error("Error al enviar email:", stderr);
      throw new Error(`Error al enviar email: ${stderr}`);
    }

    console.log("Email enviado exitosamente:", stdout);
  } catch (error) {
    console.error("Error al enviar email:", error);
    throw error;
  }
}

/**
 * Envía el informe de visita técnica al cliente
 */
export async function sendReportToClient(
  clientEmail: string,
  clientName: string,
  reportUrl: string
): Promise<void> {
  const subject = `✅ Informe de Visita Técnica - GreenH Project`;

  const content = `Hola ${clientName},

Gracias por completar la visita técnica virtual con GreenH Project.

Nos complace informarte que hemos generado el informe completo de tu visita técnica. En este documento encontrarás:

• Resumen de todas las respuestas proporcionadas
• Fotografías capturadas durante la visita
• Análisis preliminar de viabilidad
• Recomendaciones para tu instalación solar

Puedes descargar tu informe en el siguiente enlace:
${reportUrl}

Si tienes alguna pregunta sobre el informe o deseas programar una consulta con nuestro equipo de ingenieros, no dudes en contactarnos.

---
Atentamente,
Equipo GreenH Project

📧 Email: info@greenhproject.com
📞 Teléfono: +57 300 123 4567
🌐 Web: www.greenhproject.com

Este es un mensaje automático, por favor no respondas a este correo.`;

  await sendEmail({
    to: [clientEmail],
    subject,
    content,
  });
}

/**
 * Envía el informe de visita técnica al ingeniero asignado
 */
export async function sendReportToEngineer(
  engineerEmail: string,
  engineerName: string,
  clientName: string,
  reportUrl: string
): Promise<void> {
  const subject = `📋 Nuevo Informe de Visita Técnica - ${clientName}`;

  const content = `Hola ${engineerName},

Se ha completado una nueva visita técnica virtual y se ha generado el informe correspondiente.

Cliente: ${clientName}
Fecha: ${new Date().toLocaleDateString("es-CO")}

El informe completo está disponible en:
${reportUrl}

Por favor, revisa el informe y procede con el análisis de viabilidad y las siguientes etapas del proyecto.

---
Sistema de Visitas Técnicas Virtuales
GreenH Project

Este es un mensaje automático del sistema.`;

  await sendEmail({
    to: [engineerEmail],
    subject,
    content,
  });
}
