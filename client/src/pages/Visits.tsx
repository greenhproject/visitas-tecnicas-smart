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
import { Plus, Eye, Link as LinkIcon, Copy, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Visits() {
  const utils = trpc.useUtils();
  const { data: visits, isLoading } = trpc.visits.list.useQuery();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; visitId: number | null; clientName: string }>({ 
    open: false, 
    visitId: null, 
    clientName: "" 
  });
  
  const deleteVisit = trpc.visits.delete.useMutation({
    onSuccess: () => {
      toast.success("Visita eliminada exitosamente");
      utils.visits.list.invalidate();
      setDeleteDialog({ open: false, visitId: null, clientName: "" });
    },
    onError: (error) => {
      toast.error(`Error al eliminar visita: ${error.message}`);
      setDeleteDialog({ open: false, visitId: null, clientName: "" });
    },
  });

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/visit/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado al portapapeles");
  };

  const handleDelete = (visitId: number, clientName: string) => {
    setDeleteDialog({ open: true, visitId, clientName });
  };

  const confirmDelete = () => {
    if (deleteDialog.visitId) {
      deleteVisit.mutate({ id: deleteDialog.visitId });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      in_progress: "default",
      completed: "outline",
      cancelled: "destructive",
    };
    
    const labels: Record<string, string> = {
      pending: "Pendiente",
      in_progress: "En Progreso",
      completed: "Completada",
      cancelled: "Cancelada",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Visitas Técnicas</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona las visitas técnicas programadas
            </p>
          </div>
          <Link href="/visits/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Visita
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Visitas</CardTitle>
            <CardDescription>
              Lista de todas las visitas técnicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Cargando visitas...
              </div>
            ) : !visits || visits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No hay visitas técnicas programadas
                </p>
                <Link href="/visits/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Programar Primera Visita
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Cuestionario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Creada</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">
                        {visit.clientName || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {visit.questionnaireName || "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {visit.clientEmail || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {visit.address || "-"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(visit.status)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(visit.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyLink(visit.uniqueToken)}
                          title="Copiar link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Link href={`/visits/${visit.id}`}>
                          <Button variant="ghost" size="sm" title="Ver detalles">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(visit.id, visit.clientName || "este cliente")}
                          className="text-destructive hover:text-destructive"
                          title="Eliminar visita"
                        >
                          <Trash2 className="h-4 w-4" />
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

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar visita técnica?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar la visita de {deleteDialog.clientName}? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
