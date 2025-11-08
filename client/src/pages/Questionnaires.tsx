import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Questionnaires() {
  const utils = trpc.useUtils();
  const { data: questionnaires, isLoading } = trpc.questionnaires.list.useQuery();
  
  const deleteMutation = trpc.questionnaires.delete.useMutation({
    onSuccess: () => {
      toast.success("Cuestionario eliminado exitosamente");
      utils.questionnaires.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });

  const handleDelete = (id: number, title: string) => {
    if (confirm(`¿Estás seguro de eliminar el cuestionario "${title}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cuestionarios</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona las plantillas de preguntas para visitas técnicas
            </p>
          </div>
          <Link href="/questionnaires/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cuestionario
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Plantillas de Cuestionarios</CardTitle>
            <CardDescription>
              Lista de todos los cuestionarios configurados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Cargando cuestionarios...
              </div>
            ) : !questionnaires || questionnaires.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No hay cuestionarios creados aún
                </p>
                <Link href="/questionnaires/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primer Cuestionario
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionnaires.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">{q.title}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {q.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={q.isActive === 1 ? "default" : "secondary"}>
                          {q.isActive === 1 ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link href={`/questionnaires/${q.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/questionnaires/${q.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(q.id, q.title)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
