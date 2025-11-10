import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import {
  Room,
  RoomEvent,
  Track,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteParticipant,
} from "livekit-client";
import { Button } from "./ui/button";
import { Loader2, Video, VideoOff } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface InteractiveAvatarProps {
  onReady?: () => void;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
  apiKey?: string;
  autoConnect?: boolean; // Nueva prop para auto-conectar
}

export interface InteractiveAvatarRef {
  speak: (text: string) => Promise<void>;
  isConnected: boolean;
}

const InteractiveAvatar = forwardRef<InteractiveAvatarRef, InteractiveAvatarProps>(
  ({ onReady, onSpeakingStart, onSpeakingEnd, autoConnect = false }, ref) => {
    const [isLoadingSession, setIsLoadingSession] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const roomRef = useRef<Room | null>(null);

    const createSessionMutation = trpc.heygen.createSession.useMutation();
    const startSessionMutation = trpc.heygen.startSession.useMutation();
    const speakMutation = trpc.heygen.speak.useMutation();

    // Auto-conectar al montar si autoConnect es true
    useEffect(() => {
      if (autoConnect && !isConnected && !isLoadingSession) {
        handleConnect();
      }
    }, [autoConnect]);

    useEffect(() => {
      return () => {
        // Cleanup al desmontar
        if (roomRef.current) {
          roomRef.current.disconnect();
        }
      };
    }, []);

    useEffect(() => {
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    const handleConnect = async () => {
      try {
        setIsLoadingSession(true);

        // 1. Crear nueva sesión
        const sessionData = await createSessionMutation.mutateAsync({
          quality: "medium",
          avatarId: "Silas_CustomerSupport_public", // Avatar público de HeyGen para atención al cliente
          voiceId: "1bd001e7e50f421d891986aad5158bc8", // Voz en español
        });

        if (!sessionData.session_id || !sessionData.url || !sessionData.access_token) {
          throw new Error("Datos de sesión incompletos");
        }

        setSessionId(sessionData.session_id);

        // 2. Conectar a LiveKit
        const room = new Room();
        roomRef.current = room;

        room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
        room.on(RoomEvent.Disconnected, handleDisconnect);

        await room.connect(sessionData.url, sessionData.access_token);

        // 3. Iniciar sesión del avatar
        await startSessionMutation.mutateAsync({
          sessionId: sessionData.session_id,
        });

        setIsConnected(true);
        setIsLoadingSession(false);
        onReady?.();
        toast.success("Asesor virtual conectado");
      } catch (error) {
        console.error("Error al conectar avatar:", error);
        setIsLoadingSession(false);
        toast.error("Error al conectar con el asesor virtual. Por favor, intenta de nuevo.");
      }
    };

    const speak = async (text: string) => {
      if (!sessionId || !isConnected) {
        console.warn("Avatar no conectado, no se puede hablar");
        return;
      }

      try {
        setIsSpeaking(true);
        onSpeakingStart?.();

        await speakMutation.mutateAsync({
          sessionId,
          text,
        });

        // Simular tiempo de habla basado en longitud del texto
        const estimatedDuration = (text.length / 15) * 1000; // ~15 caracteres por segundo
        await new Promise((resolve) => setTimeout(resolve, estimatedDuration));

        setIsSpeaking(false);
        onSpeakingEnd?.();
      } catch (error) {
        console.error("Error al hacer hablar al avatar:", error);
        setIsSpeaking(false);
        toast.error("Error al reproducir mensaje del asesor");
      }
    };

    // Exponer métodos al componente padre
    useImperativeHandle(ref, () => ({
      speak,
      isConnected,
    }));

    const handleTrackSubscribed = (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      if (track.kind === Track.Kind.Video) {
        const videoStream = new MediaStream([track.mediaStreamTrack]);
        setStream(videoStream);
      }

      if (track.kind === Track.Kind.Audio) {
        const audioElement = track.attach();
        document.body.appendChild(audioElement);
      }
    };

    const handleTrackUnsubscribed = (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      track.detach().forEach((element) => element.remove());
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setStream(null);
    };

    const handleDisconnectManual = () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
      setIsConnected(false);
      setStream(null);
      setSessionId(null);
      toast.info("Sesión finalizada");
    };

    return (
      <div className="w-full h-full flex flex-col">
        {/* Video del Avatar */}
        <div className="relative flex-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg overflow-hidden min-h-[300px]">
          {isConnected && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            >
              <track kind="captions" />
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                  {isLoadingSession ? (
                    <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 dark:text-green-300 animate-spin" />
                  ) : (
                    <Video className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 dark:text-green-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {isLoadingSession
                      ? "Conectando con el asesor virtual..."
                      : "Asesor Virtual"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {isLoadingSession
                      ? "Esto puede tardar unos segundos"
                      : "Esperando conexión..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Indicador de habla */}
          {isSpeaking && isConnected && (
            <div className="absolute bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Hablando...
            </div>
          )}

          {/* Indicador de carga */}
          {isLoadingSession && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Controles */}
        {!autoConnect && (
          <div className="mt-4 flex gap-2 justify-center">
            {!isConnected ? (
              <Button
                onClick={handleConnect}
                disabled={isLoadingSession}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoadingSession ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleDisconnectManual} variant="destructive" size="lg">
                <VideoOff className="mr-2 h-4 w-4" />
                Finalizar Sesión
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

InteractiveAvatar.displayName = "InteractiveAvatar";

export default InteractiveAvatar;
