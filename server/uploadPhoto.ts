import { Request, Response } from "express";
import multer from "multer";
import { storagePut } from "./storage";
import { getDb } from "./db";
import { photos } from "../drizzle/schema";

// Configurar multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"));
    }
  },
});

export const uploadPhotoMiddleware = upload.single("file");

export async function uploadPhotoHandler(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se proporcionó ningún archivo" });
    }

    const { visitId, questionId } = req.body;

    if (!visitId || !questionId) {
      return res.status(400).json({ error: "visitId y questionId son requeridos" });
    }

    // Generar un nombre único para el archivo
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileExtension = req.file.originalname.split(".").pop();
    const fileName = `visit-${visitId}/question-${questionId}/${timestamp}-${randomSuffix}.${fileExtension}`;

    // Subir a S3
    const { url, key } = await storagePut(
      fileName,
      req.file.buffer,
      req.file.mimetype
    );

    // Guardar en base de datos
    const db = await getDb();
    if (db) {
      await db.insert(photos).values({
        visitId: parseInt(visitId),
        questionId: parseInt(questionId),
        fileUrl: url,
        fileKey: key,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
      });
    }

    res.json({
      success: true,
      url,
      key,
    });
  } catch (error) {
    console.error("Error al subir foto:", error);
    res.status(500).json({
      error: "Error al subir la foto",
      message: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}
