import PDFDocument from "pdfkit";
import { storagePut } from "./storage";
import { getDb } from "./db";
import { technicalVisits, answers, photos, questions, questionnaires } from "../drizzle/schema";
import { eq } from "drizzle-orm";

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

  // Guardar registro en base de datos
  const { reports } = await import("../drizzle/schema");
  await db.insert(reports).values({
    visitId,
    fileUrl: result.url,
    fileKey: result.key,
  });

  return result;
}

/**
 * Crea el PDF con el diseño profesional de GreenH Project
 */
async function createPDF(data: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
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

      // Encabezado con branding de GreenH Project
      doc.fontSize(24).fillColor("#6FB327").text("GreenH Project", { align: "center" });
      doc.fontSize(12).fillColor("#000000").text("Informe de Visita Técnica Virtual", { align: "center" });
      doc.moveDown();

      // Información de contacto
      doc.fontSize(10).fillColor("#666666");
      doc.text("Calle 123 #45-67, Bogotá, Colombia", { align: "center" });
      doc.text("Tel: +57 300 123 4567 | Email: info@greenhproject.com", { align: "center" });
      doc.text("NIT: 900.123.456-7", { align: "center" });
      doc.moveDown(2);

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

      // Línea divisoria
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#6FB327");
      doc.moveDown();

      // Cuestionario y respuestas
      doc.fontSize(16).fillColor("#6FB327").text("Cuestionario", { underline: true });
      doc.moveDown(1);

      data.questions.forEach((question, index) => {
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

        // Fotos asociadas a esta pregunta
        const questionPhotos = data.photos.filter((p) => p.questionId === question.id);
        if (questionPhotos.length > 0) {
          doc.fontSize(10).fillColor("#666666").text(`Fotos adjuntas: ${questionPhotos.length}`);
          questionPhotos.forEach((photo, photoIndex) => {
            doc.fontSize(9).fillColor("#999999").text(`  - Foto ${photoIndex + 1}: ${photo.fileUrl}`);
          });
        }

        doc.moveDown(1.5);

        // Nueva página si es necesario
        if (doc.y > 700) {
          doc.addPage();
        }
      });

      // Galería de fotos al final
      if (data.photos.length > 0) {
        doc.addPage();
        doc.fontSize(16).fillColor("#6FB327").text("Galería de Fotos", { underline: true });
        doc.moveDown(1);

        doc.fontSize(10).fillColor("#666666").text(`Total de fotos capturadas: ${data.photos.length}`);
        doc.moveDown(1);

        data.photos.forEach((photo, index) => {
          doc.fontSize(9).fillColor("#333333");
          doc.text(`${index + 1}. ${photo.fileUrl}`);
          doc.moveDown(0.3);
        });
      }

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
