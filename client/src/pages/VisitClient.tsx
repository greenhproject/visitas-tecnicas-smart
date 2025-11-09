import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useState, useRef, useEffect } from "react";
import { useRoute } from "wouter";
import { toast } from "sonner";
import { Camera, Upload, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { APP_LOGO, APP_TITLE, KOALA_LOGO } from "@/const";
import InteractiveAvatar, { InteractiveAvatarRef } from "@/components/InteractiveAvatar";
import VoiceRecorder from "@/components/VoiceRecorder";

export default function VisitClient() {
  const [, params] = useRoute("/visit/:token");
  const token = params?.token || "";
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [photos, setPhotos] = useState<Record<number, File[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true); // Mostrar avatar por defecto

  // Obtener token de HeyGen
  const { data: heygenData } = trpc.heygen.getAccessToken.useQuery(undefined, {
    enabled: showAvatar,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const avatarRef = useRef<InteractiveAvatarRef>(null);
  const [avatarReady, setAvatarReady] = useState(false);

  const { data: visit, isLoading } = trpc.visits.getByToken.useQuery({ token });
  const { data: questions } = trpc.questions.listByQuestionnaire.useQuery(
    { questionnaireId: visit?.questionnaireId || 0 },
    { enabled: !!visit }
  );

  const createAnswerMutation = trpc.answers.create.useMutation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando visita técnica...</p>
        </div>
      </div>
    );
  }

  if (!visit || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Visita no encontrada</CardTitle>
            <CardDescription>
              El link de visita técnica no es válido o ha expirado.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <CardTitle>¡Visita Técnica Completada!</CardTitle>
            <CardDescription>
              Gracias por tu tiempo. Hemos recibido toda la información necesaria.
              Pronto recibirás un informe detallado por email.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Hacer que el avatar lea la pregunta actual cuando cambia
  useEffect(() => {
    if (avatarReady && avatarRef.current?.isConnected && currentQuestion) {
      const questionText = currentQuestion.questionText;
      const questionType = currentQuestion.questionType;
      
      let instruction = "";
      if (questionType === "photo") {
        instruction = "Por favor, toma una foto clara de esto.";
      } else if (questionType === "number") {
        instruction = "Responde con un número.";
      } else if (questionType === "boolean") {
        instruction = "Responde sí o no.";
      } else {
        instruction = "Puedes escribir tu respuesta o usar el botón de grabar.";
      }

      const fullMessage = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}: ${questionText}. ${instruction}`;
      avatarRef.current.speak(fullMessage);
    }
  }, [currentQuestionIndex, avatarReady, currentQuestion, questions]);

  const handleAnswerChange = (value: any) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const currentPhotos = photos[currentQuestion.id] || [];
      setPhotos({
        ...photos,
        [currentQuestion.id]: [...currentPhotos, ...Array.from(files)],
      });
      toast.success(`${files.length} foto(s) agregada(s)`);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast.error("No se pudo acceder a la cámara");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
            const currentPhotos = photos[currentQuestion.id] || [];
            setPhotos({
              ...photos,
              [currentQuestion.id]: [...currentPhotos, file],
            });
            toast.success("Foto capturada");
          }
        }, "image/jpeg");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const canProceed = () => {
    if (currentQuestion.isRequired === 1) {
      const hasAnswer = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== "";
      const hasPhoto = currentQuestion.requiresPhoto === 1 
        ? (photos[currentQuestion.id]?.length || 0) > 0 
        : true;
      return hasAnswer && hasPhoto;
    }
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      stopCamera();
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      stopCamera();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      toast.success("Procesando respuestas...");
      
      // Subir todas las fotos a S3 y guardar respuestas
      for (const question of questions) {
        const answer = answers[question.id];
        const questionPhotos = photos[question.id] || [];
        
        // Guardar la respuesta de texto/número/boolean
        if (answer !== undefined && answer !== "") {
          await createAnswerMutation.mutateAsync({
            visitId: visit.id,
            questionId: question.id,
            answerText: question.questionType === "text" ? answer : undefined,
            answerNumber: question.questionType === "number" ? parseFloat(answer) : undefined,
            answerBoolean: question.questionType === "boolean" ? parseInt(answer) : undefined,
          });
        }
        
        // Subir fotos si hay
        if (questionPhotos.length > 0) {
          for (const photo of questionPhotos) {
            const formData = new FormData();
            formData.append("file", photo);
            formData.append("visitId", visit.id.toString());
            formData.append("questionId", question.id.toString());
            
            // Subir a S3 mediante el endpoint
            const response = await fetch("/api/upload-photo", {
              method: "POST",
              body: formData,
            });
            
            if (!response.ok) {
              throw new Error(`Error al subir foto: ${photo.name}`);
            }
          }
        }
      }
      
      setIsCompleted(true);
    } catch (error) {
      toast.error("Error al enviar respuestas");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={APP_LOGO} alt="GreenH Project" className="h-12" />
          </div>
          <div className="flex items-center gap-2">
            <img src={KOALA_LOGO} alt="Koala" className="h-8 opacity-70" />
          </div>
          <div className="text-sm text-muted-foreground">
            Visita Técnica Virtual
          </div>
        </div>
      </header>

      {/* Avatar Section */}
      {showAvatar && heygenData?.token && (
        <div className="container py-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Tu Asesor Virtual</CardTitle>
                <CardDescription>
                  Nuestro asesor virtual te guiará a través de la visita técnica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full">
                  <InteractiveAvatar
                    ref={avatarRef}
                    autoConnect={true}
                    onReady={() => {
                      setAvatarReady(true);
                      // Saludo inicial
                      setTimeout(() => {
                        if (avatarRef.current?.isConnected) {
                          const greeting = `Hola ${visit?.clientName || ""}, bienvenido a tu visita técnica virtual con Green House Project. Soy tu asesor virtual y voy a guiarte a través de ${questions.length} preguntas sobre tu instalación solar. ¿Estás listo para comenzar?`;
                          avatarRef.current.speak(greeting);
                        }
                      }, 2000);
                    }}
                    onSpeakingStart={() => console.log("Avatar empezó a hablar")}
                    onSpeakingEnd={() => console.log("Avatar terminó de hablar")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="container py-6">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <div className="container pb-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {currentQuestion.questionText}
              </CardTitle>
              {currentQuestion.isRequired === 1 && (
                <CardDescription className="text-destructive">
                  * Campo obligatorio
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Answer Input */}
              {currentQuestion.questionType === "text" && (
                <div className="space-y-2">
                  <Label>Respuesta</Label>
                  <Textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    rows={4}
                  />
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm text-muted-foreground">O responde con tu voz:</span>
                    <VoiceRecorder
                      onTranscription={(text) => {
                        const currentAnswer = answers[currentQuestion.id] || "";
                        const newAnswer = currentAnswer ? `${currentAnswer} ${text}` : text;
                        handleAnswerChange(newAnswer);
                      }}
                    />
                  </div>
                </div>
              )}

              {currentQuestion.questionType === "number" && (
                <div className="space-y-2">
                  <Label>Respuesta</Label>
                  <Input
                    type="number"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Ingresa un número"
                  />
                </div>
              )}

              {currentQuestion.questionType === "boolean" && (
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString()}
                  onValueChange={(value) => handleAnswerChange(parseInt(value))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="yes" />
                    <Label htmlFor="yes" className="cursor-pointer">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="no" />
                    <Label htmlFor="no" className="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              )}

              {/* Photo Capture */}
              {(currentQuestion.questionType === "photo" || currentQuestion.requiresPhoto === 1) && (
                <div className="space-y-4">
                  <div>
                    <Label>Fotos {currentQuestion.requiresPhoto === 1 && "*"}</Label>
                    {currentQuestion.photoInstructions && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentQuestion.photoInstructions}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-24"
                    >
                      <div className="text-center">
                        <Upload className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm">Subir Foto</span>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={isCameraActive ? stopCamera : startCamera}
                      className="h-24"
                    >
                      <div className="text-center">
                        <Camera className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm">
                          {isCameraActive ? "Cerrar Cámara" : "Tomar Foto"}
                        </span>
                      </div>
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {isCameraActive && (
                    <div className="space-y-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg border"
                      />
                      <Button
                        type="button"
                        onClick={capturePhoto}
                        className="w-full"
                      >
                        Capturar Foto
                      </Button>
                    </div>
                  )}

                  <canvas ref={canvasRef} className="hidden" />

                  {/* Photo Preview */}
                  {(photos[currentQuestion.id]?.length || 0) > 0 && (
                    <div className="space-y-2">
                      <Label>Fotos capturadas ({photos[currentQuestion.id].length})</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {photos[currentQuestion.id].map((photo, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(photo)}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                >
                  {currentQuestionIndex === questions.length - 1 ? (
                    isSubmitting ? "Enviando..." : "Finalizar"
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
