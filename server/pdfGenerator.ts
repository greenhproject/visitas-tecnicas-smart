import PDFDocument from "pdfkit";
import { storagePut } from "./storage";
import { getDb } from "./db";
import { technicalVisits, answers, photos, questions, questionnaires } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import fetch from "node-fetch";

interface ReportData {
  visit: any;
  questionnaire: any;
  questions: any[];
  answers: any[];
  photos: any[];
}

/**
 * Genera un informe PDF profesional de la visita técnica
 */
export async function generateVisitReport(visitId: number): Promise<{ url: string; key: string }> {
  const db = await getDb();
  if (!db) {
    throw new Error("Base de datos no disponible");
  }

  // Obtener datos de la visita
  const visitData = await db.select().from(technicalVisits).where(eq(technicalVisits.id, visitId)).limit(1);
  if (visitData.length === 0) {
    throw new Error("Visita no encontrada");
  }
  const visit = visitData[0];

  // Obtener cuestionario
  const questionnaireData = await db
    .select()
    .from(questionnaires)
    .where(eq(questionnaires.id, visit.questionnaireId))
    .limit(1);
  const questionnaire = questionnaireData[0];

  // Obtener preguntas
  const questionsData = await db.select().from(questions).where(eq(questions.questionnaireId, visit.questionnaireId));

  // Obtener respuestas
  const answersData = await db.select().from(answers).where(eq(answers.visitId, visitId));

  // Obtener fotos
  const photosData = await db.select().from(photos).where(eq(photos.visitId, visitId));

  const reportData: ReportData = {
    visit,
    questionnaire,
    questions: questionsData,
    answers: answersData,
    photos: photosData,
  };

  // Generar PDF
  const pdfBuffer = await createPDF(reportData);

  // Subir a S3
  const fileName = `reports/visit-${visitId}-${Date.now()}.pdf`;
  const result = await storagePut(fileName, pdfBuffer, "application/pdf");

  // Calcular score de viabilidad
  const viabilityScore = calculateViabilityScore(reportData);
  const viabilityNotes = generateViabilityNotes(reportData, viabilityScore);

  // Guardar registro en base de datos
  const { reports } = await import("../drizzle/schema");
  await db.insert(reports).values({
    visitId,
    fileUrl: result.url,
    fileKey: result.key,
    viabilityScore,
    viabilityNotes,
  });

  return result;
}

/**
 * Calcula un score de viabilidad basado en las respuestas
 */
function calculateViabilityScore(data: ReportData): number {
  let score = 100;
  let totalQuestions = data.questions.length;
  let answeredQuestions = data.answers.length;

  // Penalizar por preguntas sin responder
  if (answeredQuestions < totalQuestions) {
    score -= ((totalQuestions - answeredQuestions) / totalQuestions) * 20;
  }

  // Penalizar si faltan fotos requeridas
  const requiredPhotos = data.questions.filter((q) => q.requiresPhoto === 1).length;
  const uploadedPhotos = data.photos.length;
  if (uploadedPhotos < requiredPhotos) {
    score -= ((requiredPhotos - uploadedPhotos) / requiredPhotos) * 30;
  }

  // Bonus por completitud
  if (answeredQuestions === totalQuestions && uploadedPhotos >= requiredPhotos) {
    score += 10;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Genera notas de viabilidad basadas en el análisis
 */
function generateViabilityNotes(data: ReportData, score: number): string {
  const notes: string[] = [];

  if (score >= 90) {
    notes.push("✅ Proyecto altamente viable. Toda la información necesaria está completa.");
  } else if (score >= 70) {
    notes.push("⚠️ Proyecto viable con observaciones menores.");
  } else if (score >= 50) {
    notes.push("⚠️ Proyecto requiere información adicional para evaluación completa.");
  } else {
    notes.push("❌ Proyecto requiere visita técnica presencial o información complementaria.");
  }

  const totalQuestions = data.questions.length;
  const answeredQuestions = data.answers.length;
  if (answeredQuestions < totalQuestions) {
    notes.push(`- Faltan ${totalQuestions - answeredQuestions} preguntas por responder.`);
  }

  const requiredPhotos = data.questions.filter((q) => q.requiresPhoto === 1).length;
  const uploadedPhotos = data.photos.length;
  if (uploadedPhotos < requiredPhotos) {
    notes.push(`- Faltan ${requiredPhotos - uploadedPhotos} fotografías requeridas.`);
  }

  if (uploadedPhotos > 0) {
    notes.push(`- Se capturaron ${uploadedPhotos} fotografías durante la visita.`);
  }

  return notes.join("\n");
}

/**
 * Descarga una imagen desde una URL
 */
async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error al descargar imagen: ${url}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`Error al descargar imagen ${url}:`, error);
    return null;
  }
}

/**
 * Crea el PDF con el diseño profesional de GreenH Project
 */
async function createPDF(data: ReportData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Encabezado con logo de GreenH Project
      const logoPath = "./server/assets/greenhproject-logo.png";
      try {
        doc.image(logoPath, {
          fit: [200, 60],
          align: "center",
        });
        doc.moveDown(0.5);
      } catch (error) {
        // Si falla la carga del logo, mostrar texto
        doc.fontSize(24).fillColor("#6FB327").text("GreenH Project", { align: "center" });
        doc.moveDown(0.5);
      }

      doc.fontSize(14).fillColor("#000000").text("Informe de Visita Técnica Virtual", { align: "center" });
      doc.fontSize(10).fillColor("#666666").text("Revoluciona el concepto de vivir", { align: "center" });
      doc.moveDown(1);

      // Información de contacto
      doc.fontSize(9).fillColor("#666666");
      doc.text("Cra 1 Este # 2-26 local 2, Mosquera, Colombia", { align: "center" });
      doc.text("Cel: (57) 321 456 76 44 | Email: info@greenhproject.com", { align: "center" });
      doc.moveDown(1.5);

      // Línea divisoria
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#6FB327");
      doc.moveDown();

      // Información del cliente
      doc.fontSize(14).fillColor("#6FB327").text("Información del Cliente", { underline: true });
      doc.moveDown(0.5);

      const clientInfo = [
        ["Nombre:", data.visit.clientName || "N/A"],
        ["Email:", data.visit.clientEmail || "N/A"],
        ["Teléfono:", data.visit.clientPhone || "N/A"],
        ["Dirección:", data.visit.address || "N/A"],
      ];

      doc.fontSize(10).fillColor("#000000");
      clientInfo.forEach(([label, value]) => {
        doc.text(label, { continued: true, width: 150 });
        doc.fillColor("#333333").text(value);
        doc.fillColor("#000000");
      });

      doc.moveDown(1.5);

      // Información de la tarea
      doc.fontSize(14).fillColor("#6FB327").text("Información de la Visita", { underline: true });
      doc.moveDown(0.5);

      const visitInfo = [
        ["Cuestionario:", data.questionnaire?.title || "N/A"],
        ["Fecha:", data.visit.createdAt ? new Date(data.visit.createdAt).toLocaleDateString("es-CO") : "N/A"],
        ["Estado:", data.visit.status || "N/A"],
        ["ID Proyecto OpenSolar:", data.visit.openSolarProjectId || "N/A"],
      ];

      doc.fontSize(10).fillColor("#000000");
      visitInfo.forEach(([label, value]) => {
        doc.text(label, { continued: true, width: 200 });
        doc.fillColor("#333333").text(value);
        doc.fillColor("#000000");
      });

      doc.moveDown(2);

      // Análisis de Viabilidad
      const viabilityScore = calculateViabilityScore(data);
      const viabilityNotes = generateViabilityNotes(data, viabilityScore);

      doc.fontSize(14).fillColor("#6FB327").text("Análisis de Viabilidad", { underline: true });
      doc.moveDown(0.5);

      // Score de viabilidad con color
      const scoreColor = viabilityScore >= 90 ? "#00AA00" : viabilityScore >= 70 ? "#FFA500" : "#FF0000";
      doc.fontSize(12).font("Helvetica-Bold").fillColor(scoreColor).text(`Score: ${viabilityScore}/100`);
      doc.font("Helvetica");
      doc.moveDown(0.5);

      doc.fontSize(10).fillColor("#333333").text(viabilityNotes);
      doc.moveDown(2);

      // Línea divisoria
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#6FB327");
      doc.moveDown();

      // Cuestionario y respuestas
      doc.fontSize(16).fillColor("#6FB327").text("Cuestionario", { underline: true });
      doc.moveDown(1);

      for (let index = 0; index < data.questions.length; index++) {
        const question = data.questions[index];

        // Pregunta
        doc.fontSize(12).fillColor("#6FB327").text(`${index + 1}. ${question.questionText}`, { underline: false });
        doc.moveDown(0.5);

        // Respuesta
        const answer = data.answers.find((a) => a.questionId === question.id);
        let answerText = "Sin respuesta";

        if (answer) {
          if (answer.answerText) answerText = answer.answerText;
          else if (answer.answerNumber !== null) answerText = answer.answerNumber.toString();
          else if (answer.answerBoolean !== null) answerText = answer.answerBoolean === 1 ? "Sí" : "No";
        }

        doc.fontSize(10).fillColor("#333333").text(`Respuesta: ${answerText}`);
        doc.moveDown(0.5);

        // Fotos asociadas a esta pregunta (embebidas)
        const questionPhotos = data.photos.filter((p) => p.questionId === question.id);
        if (questionPhotos.length > 0) {
          doc.fontSize(10).fillColor("#666666").text(`Fotografías (${questionPhotos.length}):`, { underline: true });
          doc.moveDown(0.5);

          for (const photo of questionPhotos) {
            try {
              const imageBuffer = await downloadImage(photo.fileUrl);
              if (imageBuffer) {
                // Verificar si hay espacio suficiente en la página
                if (doc.y > 600) {
                  doc.addPage();
                }

                // Agregar imagen al PDF (máximo 400px de ancho)
                doc.image(imageBuffer, {
                  fit: [400, 300],
                  align: "center",
                });
                doc.moveDown(0.5);

                // Caption de la foto
                doc.fontSize(8).fillColor("#999999").text(`Capturada: ${new Date(photo.createdAt).toLocaleString("es-CO")}`, {
                  align: "center",
                });
                doc.moveDown(1);
              }
            } catch (error) {
              console.error("Error al embeber imagen:", error);
              // Si falla, mostrar solo la URL
              doc.fontSize(9).fillColor("#999999").text(`  - ${photo.fileUrl}`);
            }
          }
        }

        doc.moveDown(1.5);

        // Nueva página si es necesario
        if (doc.y > 700) {
          doc.addPage();
        }
      }

      // Firma digital (espacio reservado)
      doc.addPage();
      doc.fontSize(14).fillColor("#6FB327").text("Firma Digital", { underline: true });
      doc.moveDown(1);

      doc.fontSize(10).fillColor("#333333").text("Técnico/Ingeniero responsable:");
      doc.moveDown(2);

      // Línea para firma
      doc.moveTo(100, doc.y).lineTo(400, doc.y).stroke("#000000");
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor("#666666").text("Firma y fecha", { align: "center" });

      // Pie de página
      doc.fontSize(8).fillColor("#999999");
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.text(
          `Página ${i + 1} de ${pages.count} - Generado el ${new Date().toLocaleDateString("es-CO")}`,
          50,
          doc.page.height - 50,
          { align: "center" }
        );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
