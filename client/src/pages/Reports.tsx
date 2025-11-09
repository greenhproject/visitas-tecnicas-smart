import { useAuth } from "@/_core/hooks/useAuth";
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
import { FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Reports() {
  const { user, loading: authLoading } = useAuth();
  const { data: reports, isLoading } = trpc.reports.list.useQuery();

  const handleDownload = (reportUrl: string | null, clientName: string | null) => {
    if (!reportUrl) {
      toast.error("URL del informe no disponible");
      return;
    }
    window.open(reportUrl, "_blank");
    toast.success(`Descargando informe de ${clientName || "cliente"}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/";
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Reportes</h1>
          <p className="text-muted-foreground">
            Gestiona todos los informes de visitas técnicas
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Informes de Visitas Técnicas</CardTitle>
                <CardDescription>
                  Gestiona todos los informes de visitas técnicas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !reports || reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay informes generados</h3>
                <p className="text-muted-foreground">
                  Los informes aparecerán aquí cuando se completen las visitas técnicas
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Cliente</TableHead>
                      <TableHead className="hidden md:table-cell">Cuestionario</TableHead>
                      <TableHead className="hidden lg:table-cell">Estado</TableHead>
                      <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{report.clientName}</div>
                            <div className="text-sm text-muted-foreground md:hidden">
                              {report.questionnaireName || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {report.questionnaireName || "N/A"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant={
                              report.visitStatus === "completed"
                                ? "default"
                                : report.visitStatus === "in_progress"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {report.visitStatus === "completed"
                              ? "Completada"
                              : report.visitStatus === "in_progress"
                              ? "En Progreso"
                              : report.visitStatus === "cancelled"
                              ? "Cancelada"
                              : "Pendiente"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {new Date(report.createdAt).toLocaleDateString("es-CO")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(report.reportUrl, report.clientName)}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Descargar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
