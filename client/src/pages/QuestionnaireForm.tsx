import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical } from "lucide-react";

type QuestionType = "text" | "number" | "boolean" | "photo";

interface Question {
  id?: number;
  questionText: string;
  questionType: QuestionType;
  isRequired: number;
  requiresPhoto: number;
  photoInstructions: string;
  orderIndex: number;
}

export default function QuestionnaireForm() {
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const createMutation = trpc.questionnaires.create.useMutation({
    onSuccess: async (result) => {
      const questionnaireId = result[0].insertId;
      
      // Crear todas las preguntas
      for (const question of questions) {
        await createQuestionMutation.mutateAsync({
          questionnaireId,
          ...question,
        });
      }
      
      toast.success("Cuestionario creado exitosamente");
      setLocation("/questionnaires");
    },
    onError: (error) => {
      toast.error(`Error al crear cuestionario: ${error.message}`);
    },
  });

  const createQuestionMutation = trpc.questions.create.useMutation();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "text",
        isRequired: 0,
        requiresPhoto: 0,
        photoInstructions: "",
        orderIndex: questions.length,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    
    if (questions.length === 0) {
      toast.error("Debes agregar al menos una pregunta");
      return;
    }
    
    const invalidQuestion = questions.find(q => !q.questionText.trim());
    if (invalidQuestion) {
      toast.error("Todas las preguntas deben tener texto");
      return;
    }

    createMutation.mutate({ title, description });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nuevo Cuestionario</h1>
          <p className="text-muted-foreground mt-2">
            Crea una plantilla de preguntas para visitas técnicas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Datos básicos del cuestionario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Visita Técnica Residencial"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el propósito de este cuestionario"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Preguntas</CardTitle>
                  <CardDescription>
                    Configura las preguntas del cuestionario
                  </CardDescription>
                </div>
                <Button type="button" onClick={handleAddQuestion} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Pregunta
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay preguntas. Haz clic en "Agregar Pregunta" para comenzar.
                </div>
              ) : (
                questions.map((question, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          <span className="font-semibold">Pregunta {index + 1}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveQuestion(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Texto de la pregunta *</Label>
                        <Input
                          value={question.questionText}
                          onChange={(e) =>
                            handleQuestionChange(index, "questionText", e.target.value)
                          }
                          placeholder="Ej: ¿Cuál es el área aproximada de la cubierta?"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo de respuesta</Label>
                          <Select
                            value={question.questionType}
                            onValueChange={(value) =>
                              handleQuestionChange(index, "questionType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Texto</SelectItem>
                              <SelectItem value="number">Número</SelectItem>
                              <SelectItem value="boolean">Sí/No</SelectItem>
                              <SelectItem value="photo">Solo Foto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4 pt-8">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`required-${index}`}
                              checked={question.isRequired === 1}
                              onCheckedChange={(checked) =>
                                handleQuestionChange(index, "isRequired", checked ? 1 : 0)
                              }
                            />
                            <Label htmlFor={`required-${index}`} className="cursor-pointer">
                              Obligatoria
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`photo-${index}`}
                              checked={question.requiresPhoto === 1}
                              onCheckedChange={(checked) =>
                                handleQuestionChange(index, "requiresPhoto", checked ? 1 : 0)
                              }
                            />
                            <Label htmlFor={`photo-${index}`} className="cursor-pointer">
                              Requiere foto
                            </Label>
                          </div>
                        </div>
                      </div>

                      {question.requiresPhoto === 1 && (
                        <div className="space-y-2">
                          <Label>Instrucciones para la foto</Label>
                          <Textarea
                            value={question.photoInstructions}
                            onChange={(e) =>
                              handleQuestionChange(index, "photoInstructions", e.target.value)
                            }
                            placeholder="Ej: Tomar foto desde el frente, asegurándose de capturar toda la estructura"
                            rows={2}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/questionnaires")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creando..." : "Crear Cuestionario"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
