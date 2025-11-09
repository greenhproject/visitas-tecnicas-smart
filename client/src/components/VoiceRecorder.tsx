import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onTranscription, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);

        // Detener todos los tracks del stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Grabación iniciada");
    } catch (error) {
      console.error("Error al iniciar grabación:", error);
      toast.error("No se pudo acceder al micrófono");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      // Crear FormData para enviar el audio
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      // Enviar al endpoint de transcripción
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al transcribir audio");
      }

      const data = await response.json();
      const transcription = data.text || "";

      if (transcription) {
        onTranscription(transcription);
        toast.success("Audio transcrito correctamente");
      } else {
        toast.error("No se pudo transcribir el audio");
      }
    } catch (error) {
      console.error("Error al transcribir:", error);
      toast.error("Error al procesar el audio");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!isRecording ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={startRecording}
          disabled={disabled || isProcessing}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Grabar respuesta
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={stopRecording}
          className="gap-2 animate-pulse"
        >
          <Square className="h-4 w-4" />
          Detener grabación
        </Button>
      )}
    </div>
  );
}
