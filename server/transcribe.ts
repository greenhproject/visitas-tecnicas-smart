import { Request, Response } from "express";
import multer from "multer";
import { storagePut } from "./storage";
import { transcribeAudio as whisperTranscribe } from "./_core/voiceTranscription";

// Configurar multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB límite
  },
});

/**
 * Middleware de multer para procesar el archivo de audio
 */
export const uploadAudioMiddleware = upload.single("audio");

/**
 * Handler para transcribir audio usando Whisper API
 */
export async function transcribeAudioHandler(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se proporcionó archivo de audio" });
    }

    // Subir audio a S3 temporalmente
    const fileName = `temp-audio/${Date.now()}-${req.file.originalname}`;
    const { url: audioUrl } = await storagePut(fileName, req.file.buffer, req.file.mimetype);

    // Transcribir usando Whisper
    const result = await whisperTranscribe({
      audioUrl,
      language: "es", // Español
      prompt: "Transcripción de respuesta de visita técnica para instalación solar",
    });

    // Verificar si hubo error
    if ("error" in result) {
      return res.status(500).json({ error: result.error });
    }

    // Devolver la transcripción
    res.json({
      text: result.text,
      language: result.language,
    });
  } catch (error) {
    console.error("Error al transcribir audio:", error);
    res.status(500).json({ error: "Error al transcribir audio" });
  }
}
