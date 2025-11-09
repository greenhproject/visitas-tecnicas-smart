import { useEffect, useRef, useState } from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from "@heygen/streaming-avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";

interface InteractiveAvatarProps {
  onReady?: () => void;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
  apiKey: string;
}

export default function InteractiveAvatar({
  onReady,
  onSpeakingStart,
  onSpeakingEnd,
  apiKey,
}: InteractiveAvatarProps) {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [sessionData, setSessionData] = useState<any>();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);

  async function fetchAccessToken() {
    try {
      // En producción, esto debería venir del backend
      return apiKey;
    } catch (error) {
      console.error("Error al obtener access token:", error);
      return "";
    }
  }

  async function startSession() {
    setIsLoadingSession(true);
    const newToken = await fetchAccessToken();

    avatar.current = new StreamingAvatar({
      token: newToken,
    });

    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log("Avatar started talking", e);
      onSpeakingStart?.();
    });

    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log("Avatar stopped talking", e);
      onSpeakingEnd?.();
    });

    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      endSession();
    });

    avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
      console.log("Stream ready:", event.detail);
      setStream(event.detail);
      onReady?.();
    });

    try {
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: "0f97b240e94a491aa47e27c0a038c7de", // Avatar personalizado de GreenH Project
        voice: {
          voiceId: "es-MX-DaliaNeural", // Voz en español
        },
        language: "es",
      });

      setSessionData(res);
      toast.success("Sesión de avatar iniciada");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error al iniciar sesión de avatar");
    } finally {
      setIsLoadingSession(false);
    }
  }

  async function handleSpeak(text: string) {
    setIsLoadingRepeat(true);
    if (!avatar.current) {
      toast.error("Avatar no inicializado");
      return;
    }

    try {
      await avatar.current.speak({
        text: text,
        taskType: TaskType.REPEAT,
      });
    } catch (error) {
      console.error("Error al hablar:", error);
      toast.error("Error al hacer hablar al avatar");
    } finally {
      setIsLoadingRepeat(false);
    }
  }

  async function handleInterrupt() {
    if (!avatar.current) {
      toast.error("Avatar no inicializado");
      return;
    }

    try {
      await avatar.current.interrupt();
    } catch (error) {
      console.error("Error al interrumpir:", error);
      toast.error("Error al interrumpir al avatar");
    }
  }

  async function endSession() {
    if (!avatar.current) {
      return;
    }

    try {
      await avatar.current.stopAvatar();
      setStream(undefined);
      setSessionData(undefined);
    } catch (error) {
      console.error("Error al terminar sesión:", error);
    }
  }

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  // Exponer métodos para uso externo
  useEffect(() => {
    if (avatar.current) {
      (window as any).avatarSpeak = handleSpeak;
      (window as any).avatarInterrupt = handleInterrupt;
    }
  }, [avatar.current]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Video del Avatar */}
      <div className="relative flex-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg overflow-hidden">
        {stream ? (
          <video
            ref={mediaStream}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
          >
            <track kind="captions" />
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                <Video className="w-12 h-12 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Avatar no conectado
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Inicia la sesión para comenzar
                </p>
              </div>
            </div>
          </div>
        )}

        {isVideoOff && stream && (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <VideoOff className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Indicador de carga */}
        {(isLoadingSession || isLoadingRepeat) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="mt-4 flex gap-2 justify-center">
        {!stream ? (
          <Button
            onClick={startSession}
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
          <>
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="outline"
              size="icon"
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setIsVideoOff(!isVideoOff)}
              variant="outline"
              size="icon"
            >
              {isVideoOff ? (
                <VideoOff className="h-4 w-4" />
              ) : (
                <Video className="h-4 w-4" />
              )}
            </Button>
            <Button onClick={endSession} variant="destructive">
              Finalizar Sesión
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
