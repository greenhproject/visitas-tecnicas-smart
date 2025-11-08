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
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function NewVisit() {
  const [, setLocation] = useLocation();
  const [questionnaireId, setQuestionnaireId] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [openSolarProjectId, setOpenSolarProjectId] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const { data: questionnaires } = trpc.questionnaires.list.useQuery();
  const { data: engineers } = trpc.engineers.list.useQuery();

  const createMutation = trpc.visits.create.useMutation({
    onSuccess: (result) => {
      const url = `${window.location.origin}/visit/${result.uniqueToken}`;
      setGeneratedLink(url);
      toast.success("Visita técnica creada exitosamente");
    },
    onError: (error) => {
      toast.error(`Error al crear visita: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionnaireId) {
      toast.error("Debes seleccionar un cuestionario");
      return;
    }

    createMutation.mutate({
      questionnaireId: parseInt(questionnaireId),
      clientName: clientName || undefined,
      clientEmail: clientEmail || undefined,
      clientPhone: clientPhone || undefined,
      address: address || undefined,
      openSolarProjectId: openSolarProjectId || undefined,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nueva Visita Técnica</h1>
          <p className="text-muted-foreground mt-2">
            Programa una visita técnica virtual para un cliente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
              <CardDescription>Datos del cliente y proyecto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nombre del Cliente</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej: Carlos Echavarría"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="cliente@ejemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Teléfono</Label>
                  <Input
                    id="clientPhone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+57 300 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openSolarProjectId">ID Proyecto OpenSolar</Label>
                  <Input
                    id="openSolarProjectId"
                    value={openSolarProjectId}
                    onChange={(e) => setOpenSolarProjectId(e.target.value)}
                    placeholder="Ej: 12345"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección completa del proyecto"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Visita</CardTitle>
              <CardDescription>Selecciona el cuestionario a utilizar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="questionnaire">Cuestionario *</Label>
                <Select value={questionnaireId} onValueChange={setQuestionnaireId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un cuestionario" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionnaires?.filter(q => q.isActive === 1).map((q) => (
                      <SelectItem key={q.id} value={q.id.toString()}>
                        {q.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {generatedLink && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Link Generado</CardTitle>
                <CardDescription>
                  Comparte este link con el cliente para iniciar la visita técnica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input value={generatedLink} readOnly className="font-mono text-sm" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                      toast.success("Link copiado al portapapeles");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/visits")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creando..." : "Crear Visita"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
