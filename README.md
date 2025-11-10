# Visitas Técnicas Smart - GreenH Project

Sistema completo de gestión de visitas técnicas virtuales con avatar interactivo de IA para instalaciones solares residenciales.

## 📋 Descripción

Este proyecto reemplaza las visitas técnicas tradicionales con un sistema automatizado que utiliza un avatar interactivo de HeyGen para guiar a los clientes a través de un cuestionario personalizado, capturar fotos del sitio, y generar informes profesionales en PDF.

## ✨ Características Principales

### 🤖 Avatar Interactivo con IA
- Avatar de HeyGen que habla y guía al cliente en tiempo real
- Saludo personalizado y presentación como técnico de Green House Project
- Lee cada pregunta en voz alta con instrucciones específicas
- Conexión automática al cargar la página de visita

### 📝 Sistema de Cuestionarios
- Creación y gestión de cuestionarios personalizados
- Múltiples tipos de preguntas:
  - Texto libre
  - Numérico
  - Selección múltiple (Sí/No)
  - Captura de fotos
  - Combinación foto + texto
- Configuración de preguntas obligatorias
- Progreso visual del cuestionario

### 📸 Captura de Fotos
- Soporte para cámara móvil con `capture="environment"`
- Subida de fotos desde galería
- Almacenamiento en S3
- Vista previa de fotos capturadas
- Múltiples fotos por pregunta

### 📄 Generación de Informes PDF
- Informes profesionales con branding de GreenH Project
- Incluye todas las respuestas del cliente
- Galería de fotos capturadas
- Análisis de viabilidad automático
- Firma digital del técnico/ingeniero

### 📧 Envío Automático de Emails
- Envío del informe PDF al cliente
- Envío del informe PDF al ingeniero asignado
- Integración con Gmail API vía MCP
- Plantillas de email profesionales

### 🔗 Integración con OpenSolar
- Subida automática del informe a OpenSolar
- Vinculación con proyectos existentes
- API REST de OpenSolar

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos
- **shadcn/ui** - Componentes UI
- **Wouter** - Enrutamiento
- **tRPC** - Cliente API type-safe
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express 4** - Servidor HTTP
- **tRPC 11** - API type-safe
- **Drizzle ORM** - ORM para base de datos
- **MySQL/TiDB** - Base de datos

### Servicios Externos
- **HeyGen API** - Avatar interactivo
- **AWS S3** - Almacenamiento de archivos
- **Gmail API** - Envío de emails
- **OpenSolar API** - Integración con plataforma solar
- **Manus OAuth** - Autenticación

## 📁 Estructura del Proyecto

```
clinica_digital_solar/
├── client/                    # Frontend React
│   ├── public/               # Assets estáticos
│   │   ├── logo.png         # Logo principal
│   │   └── koala.png        # Logo koala
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── ui/         # Componentes shadcn/ui
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── InteractiveAvatar.tsx
│   │   │   └── Map.tsx
│   │   ├── pages/          # Páginas de la aplicación
│   │   │   ├── Home.tsx
│   │   │   ├── Visits.tsx
│   │   │   ├── VisitClient.tsx
│   │   │   └── CreateVisit.tsx
│   │   ├── lib/
│   │   │   └── trpc.ts     # Cliente tRPC
│   │   ├── const.ts        # Constantes (APP_TITLE, APP_LOGO)
│   │   └── App.tsx         # Rutas principales
│   └── index.html
├── server/                   # Backend Node.js
│   ├── _core/              # Infraestructura del framework
│   │   ├── llm.ts         # Integración LLM
│   │   ├── voiceTranscription.ts
│   │   ├── imageGeneration.ts
│   │   └── notification.ts
│   ├── db.ts               # Funciones de base de datos
│   └── routers.ts          # Rutas tRPC
├── drizzle/                 # Esquemas de base de datos
│   └── schema.ts
├── storage/                 # Helpers de S3
│   └── index.ts
├── scripts/                 # Scripts de utilidad
│   ├── seed-questionnaire.mjs
│   └── create-test-visit.mjs
└── shared/                  # Código compartido
    └── const.ts

```

## 🗄️ Esquema de Base de Datos

### Tablas Principales

#### `users`
- Usuarios del sistema (administradores)
- Autenticación vía Manus OAuth
- Roles: `admin` | `user`

#### `questionnaires`
- Plantillas de cuestionarios
- Nombre, descripción, estado activo

#### `questions`
- Preguntas de los cuestionarios
- Tipos: `text`, `number`, `boolean`, `photo`, `photo_text`
- Configuración de obligatoriedad
- Opciones predefinidas para selección múltiple

#### `technical_visits`
- Visitas técnicas programadas
- Token único para acceso del cliente
- Estado: `pending`, `in_progress`, `completed`, `cancelled`
- Vinculación con cuestionario y cliente

#### `answers`
- Respuestas del cliente a las preguntas
- Soporte para texto, números y booleanos

#### `photos`
- Fotos capturadas durante la visita
- URL de S3 y metadata
- Vinculación con pregunta y visita

#### `reports`
- Informes PDF generados
- URL del PDF en S3
- Análisis de viabilidad

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 22.x
- MySQL/TiDB
- Cuenta de HeyGen con API key
- Cuenta de AWS S3
- Gmail API configurado

### Variables de Entorno

El proyecto utiliza variables de entorno inyectadas automáticamente por Manus:

```env
# Base de datos
DATABASE_URL=mysql://...

# Autenticación
JWT_SECRET=...
VITE_APP_ID=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...

# HeyGen
HEYGEN_API_KEY=...

# S3 Storage (configurado automáticamente)
# Las credenciales se inyectan vía server/storage.ts

# LLM (configurado automáticamente)
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...

# Aplicación
VITE_APP_TITLE="Visitas Técnicas Smart"
VITE_APP_LOGO=/logo.png
```

### Instalación

```bash
# Instalar dependencias
pnpm install

# Ejecutar migraciones de base de datos
pnpm db:push

# Seed de datos de prueba (opcional)
pnpm tsx scripts/seed-questionnaire.mjs

# Iniciar servidor de desarrollo
pnpm dev
```

## 📖 Guía de Uso

### Para Administradores

1. **Crear Cuestionario**
   - Ir a Dashboard → Cuestionarios
   - Crear nuevo cuestionario
   - Agregar preguntas con tipos específicos

2. **Programar Visita Técnica**
   - Ir a Visitas Técnicas → Nueva Visita
   - Seleccionar cuestionario
   - Ingresar datos del cliente
   - Copiar link único generado

3. **Enviar Link al Cliente**
   - El cliente recibirá un link único
   - No requiere login
   - Acceso directo al cuestionario

4. **Revisar Informes**
   - Ver informes generados en Dashboard
   - Descargar PDF
   - Revisar análisis de viabilidad

### Para Clientes

1. **Acceder al Link**
   - Abrir link recibido por email/WhatsApp
   - No requiere registro

2. **Interactuar con Avatar**
   - El avatar saluda y se presenta
   - Lee cada pregunta en voz alta
   - Proporciona instrucciones específicas

3. **Responder Cuestionario**
   - Responder preguntas de texto/número
   - Tomar fotos cuando se solicite
   - Seguir instrucciones del avatar

4. **Finalizar Visita**
   - Revisar respuestas
   - Enviar cuestionario
   - Recibir confirmación

## 🔧 Configuración del Avatar

El avatar está configurado en `client/src/components/InteractiveAvatar.tsx`:

```typescript
const avatarId = "Eric_public_pro2_20230608"; // Avatar público de HeyGen
const voiceId = "TU_VOICE_ID"; // Configurar voz personalizada
```

Para personalizar el avatar:
1. Crear avatar personalizado en HeyGen
2. Obtener el `avatarId` del avatar creado
3. Clonar voz en español (opcional)
4. Actualizar `avatarId` y `voiceId` en el código

## 📝 Funcionalidades Implementadas

### ✅ Completadas
- [x] Sistema de cuestionarios con CRUD completo
- [x] Avatar interactivo con HeyGen
- [x] Captura de fotos desde móvil
- [x] Generación de informes PDF
- [x] Envío de emails con Gmail API
- [x] Integración con OpenSolar
- [x] Almacenamiento en S3
- [x] Autenticación con Manus OAuth
- [x] Panel administrativo completo
- [x] Validación de respuestas obligatorias
- [x] Progreso visual del cuestionario
- [x] Botón eliminar con diálogo de confirmación
- [x] Columna "Cuestionario" en tabla de visitas

### 🚧 Pendientes
- [ ] Reconocimiento de voz para respuestas del cliente
- [ ] Confirmaciones y feedback del avatar cuando el usuario responde
- [ ] Guía del avatar para captura de fotos
- [ ] Despedida del avatar al finalizar el cuestionario

## 🐛 Problemas Conocidos

### Error de Publicación
- **Problema**: Error "[internal] failed to get checkpoint: record not found"
- **Causa**: Problema de sincronización del sistema Manus
- **Solución**: Contactar soporte de Manus en https://help.manus.im

### Avatar en Producción
- **Problema**: El avatar no aparece en el sitio público (visitasghp.manus.space)
- **Causa**: El sitio público usa una versión antigua del código
- **Solución**: Publicar el checkpoint una vez resuelto el error anterior

## 📞 Soporte

Para problemas técnicos con el sistema Manus:
- https://help.manus.im

Para preguntas sobre el código:
- Revisar la documentación en este README
- Consultar los comentarios en el código
- Revisar el archivo `todo.md` para el historial de desarrollo

## 📄 Licencia

Proyecto privado de GreenH Project.

## 👥 Créditos

- **Cliente**: GreenH Project
- **Desarrollo**: Manus AI
- **Avatar IA**: HeyGen
- **Infraestructura**: Manus Platform


---

**Última actualización:** 9 de noviembre de 2025
**Versión:** 1.0.0 - Sistema completamente funcional
