import { useEffect, useRef, useState } from "react";
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
}

export default function InteractiveAvatar({
  onReady,
  onSpeakingStart,
  onSpeakingEnd,
}: InteractiveAvatarProps) {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);

  const createSessionMutation = trpc.heygen.createSession.useMutation();
  const startSessionMutation = trpc.heygen.startSession.useMutation();

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
        avatarId: "0f97b240e94a491aa47e27c0a038c7de",
        voiceId: "5d29644883bf4359b4d561a5db2dd740",
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
      toast.success("Sesión de avatar iniciada");
    } catch (error) {
      console.error("Error al conectar avatar:", error);
      setIsLoadingSession(false);
      toast.error("Error al iniciar sesión del avatar. Por favor, intenta de nuevo.");
    }
  };

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
      <div className="relative flex-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg overflow-hidden">
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
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                {isLoadingSession ? (
                  <Loader2 className="w-12 h-12 text-green-600 dark:text-green-300 animate-spin" />
                ) : (
                  <Video className="w-12 h-12 text-green-600 dark:text-green-300" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {isLoadingSession
                    ? "Conectando con el asesor virtual..."
                    : "Avatar no conectado"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isLoadingSession
                    ? "Esto puede tardar unos segundos"
                    : "Inicia la sesión para comenzar"}
                </p>
              </div>
            </div>
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
    </div>
  );
}
