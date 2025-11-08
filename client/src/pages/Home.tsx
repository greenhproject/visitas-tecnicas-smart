import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { ArrowRight, Video, ClipboardCheck, FileText } from "lucide-react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="Logo" className="h-10" />
            <span className="font-bold text-xl">{APP_TITLE}</span>
          </div>
          <a href={getLoginUrl()}>
            <Button>Iniciar Sesión</Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Visitas Técnicas Virtuales con{" "}
            <span className="text-primary">IA Conversacional</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Automatiza tus visitas técnicas para instalaciones solares con un asesor virtual
            impulsado por inteligencia artificial. Captura información, genera informes y envía
            resultados automáticamente.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <a href={getLoginUrl()}>
              <Button size="lg" className="gap-2">
                Comenzar Ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Videollamada con IA</h3>
            <p className="text-muted-foreground">
              Asesor virtual que interactúa naturalmente con tus clientes, haciendo preguntas y
              capturando información clave.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cuestionarios Configurables</h3>
            <p className="text-muted-foreground">
              Crea plantillas personalizadas de preguntas con captura de fotos y respuestas
              estructuradas.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Informes Automáticos</h3>
            <p className="text-muted-foreground">
              Genera PDFs profesionales y envía automáticamente a clientes, ingenieros y OpenSolar.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container py-8 text-center text-muted-foreground">
          <p>© 2025 {APP_TITLE}. Powered by GreenH Project.</p>
        </div>
      </footer>
    </div>
  );
}
