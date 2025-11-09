# Documentación del Sistema - Clínica Digital Solar

**Versión:** 2.0  
**Fecha:** Noviembre 2024  
**Desarrollado para:** GreenH Project

---

## Descripción General

La Clínica Digital Solar es una plataforma completa de automatización para visitas técnicas virtuales en instalaciones de sistemas solares. El sistema utiliza inteligencia artificial conversacional mediante avatares digitales de HeyGen para simular videollamadas reales con asesores, permitiendo recopilar información técnica, capturar fotografías y generar informes profesionales automáticamente.

---

## Arquitectura del Sistema

### Stack Tecnológico

**Frontend:**
- React 19 con TypeScript
- Tailwind CSS 4 para estilos
- tRPC 11 para comunicación type-safe con el backend
- Wouter para enrutamiento
- Shadcn/UI para componentes

**Backend:**
- Node.js con Express 4
- tRPC para API type-safe
- MySQL/TiDB como base de datos
- Drizzle ORM para gestión de datos
- PDFKit para generación de informes

**Integraciones Externas:**
- HeyGen Interactive Avatar API (videollamada con IA)
- Whisper API (transcripción de voz)
- Gmail API vía MCP (envío de emails)
- OpenSolar API (subida de informes)
- AWS S3 (almacenamiento de archivos)

### Diagrama de Flujo Principal

```
1. Admin crea cuestionario → 2. Admin programa visita técnica
                                        ↓
3. Cliente recibe link único → 4. Cliente accede a videollamada con avatar IA
                                        ↓
5. Avatar hace preguntas → 6. Cliente responde (texto/voz) y captura fotos
                                        ↓
7. Sistema genera informe PDF → 8. Envío automático a cliente e ingeniero
                                        ↓
9. Subida automática a OpenSolar
```

---

## Módulos del Sistema

### 1. Panel Administrativo

**Ubicación:** `/dashboard`

**Funcionalidades:**
- Gestión de cuestionarios configurables
- Gestión de preguntas con diferentes tipos:
  - Texto libre
  - Número
  - Sí/No (boolean)
  - Solo foto
- Configuración de preguntas obligatorias
- Configuración de fotos requeridas con instrucciones
- Programación de visitas técnicas
- Visualización de informes generados
- Gestión de ingenieros

**Roles de Usuario:**
- **Admin:** Acceso completo al sistema
- **Ingeniero:** Puede crear cuestionarios y programar visitas
- **Usuario:** Solo visualización (si aplica)

### 2. Sistema de Visitas Técnicas

**Ubicación:** `/visit/:token`

**Flujo de Trabajo:**

1. **Acceso del Cliente**
   - El cliente recibe un link único con token de seguridad
   - No requiere registro ni autenticación
   - Acceso válido durante la vigencia de la visita

2. **Videollamada con Avatar IA**
   - Avatar de HeyGen se presenta automáticamente
   - Saludo personalizado con nombre del cliente
   - Guía conversacional a través del cuestionario
   - Sincronización labial perfecta en español

3. **Captura de Respuestas**
   - Respuestas de texto con opción de transcripción de voz
   - Respuestas numéricas
   - Respuestas Sí/No
   - Captura de fotos desde cámara o galería

4. **Validación en Tiempo Real**
   - Verificación de preguntas obligatorias
   - Validación de fotos requeridas
   - Barra de progreso visual
   - Mensajes de error claros

5. **Finalización**
   - Confirmación de completitud
   - Mensaje de agradecimiento
   - Generación automática de informe

### 3. Generación de Informes PDF

**Características:**

**Encabezado Profesional:**
- Logo de GreenH Project
- Información de contacto
- NIT de la empresa

**Información del Cliente:**
- Nombre completo
- Email y teléfono
- Dirección de instalación

**Información de la Visita:**
- Cuestionario aplicado
- Fecha y hora
- Estado de la visita
- ID del proyecto en OpenSolar

**Análisis de Viabilidad:**
- Score automático (0-100)
- Código de colores:
  - Verde (90-100): Altamente viable
  - Naranja (70-89): Viable con observaciones
  - Rojo (<70): Requiere información adicional
- Notas detalladas sobre completitud

**Cuestionario con Respuestas:**
- Preguntas numeradas
- Respuestas del cliente
- Fotos embebidas directamente en el PDF
- Timestamp de captura de cada foto

**Firma Digital:**
- Espacio reservado para firma del técnico/ingeniero
- Fecha de generación del informe

### 4. Sistema de Envío Automatizado

**Email al Cliente:**
- Asunto personalizado
- Mensaje profesional con branding
- Informe PDF adjunto
- Información de contacto

**Email al Ingeniero:**
- Resumen de la visita
- Score de viabilidad
- Informe PDF adjunto
- Link al proyecto en OpenSolar

**Subida a OpenSolar:**
- Autenticación automática
- Asociación al proyecto correcto
- Metadatos del documento
- Confirmación de subida exitosa

### 5. Reconocimiento de Voz

**Tecnología:** Whisper API de OpenAI

**Funcionalidades:**
- Grabación de audio desde el navegador
- Transcripción automática en español
- Integración con campos de texto
- Feedback visual durante grabación
- Manejo de errores robusto

**Flujo:**
1. Cliente hace clic en "Grabar respuesta"
2. Navegador solicita permiso de micrófono
3. Grabación de audio (formato WebM)
4. Subida a servidor
5. Almacenamiento temporal en S3
6. Transcripción con Whisper
7. Inserción automática en campo de texto

---

## Base de Datos

### Esquema de Tablas

**users**
- id (PK)
- openId (unique)
- name
- email
- role (admin/user)
- createdAt
- updatedAt

**questionnaires**
- id (PK)
- title
- description
- isActive
- createdBy (FK → users)
- createdAt
- updatedAt

**questions**
- id (PK)
- questionnaireId (FK → questionnaires)
- questionText
- questionType (text/number/boolean/photo)
- orderIndex
- isRequired
- requiresPhoto
- photoInstructions
- createdAt

**technicalVisits**
- id (PK)
- questionnaireId (FK → questionnaires)
- clientName
- clientEmail
- clientPhone
- address
- openSolarProjectId
- token (unique)
- status (pending/in_progress/completed)
- assignedTo (FK → users)
- createdAt
- completedAt

**answers**
- id (PK)
- visitId (FK → technicalVisits)
- questionId (FK → questions)
- answerText
- answerNumber
- answerBoolean
- createdAt

**photos**
- id (PK)
- visitId (FK → technicalVisits)
- questionId (FK → questions)
- fileUrl
- fileKey
- createdAt

**reports**
- id (PK)
- visitId (FK → technicalVisits)
- fileUrl
- fileKey
- viabilityScore
- viabilityNotes
- createdAt

**engineers**
- id (PK)
- userId (FK → users)
- specialization
- isActive
- createdAt

---

## APIs y Endpoints

### tRPC Procedures

**auth.***
- `me`: Obtener usuario actual
- `logout`: Cerrar sesión

**questionnaires.***
- `list`: Listar cuestionarios
- `getById`: Obtener cuestionario por ID
- `create`: Crear cuestionario
- `update`: Actualizar cuestionario
- `delete`: Eliminar cuestionario

**questions.***
- `listByQuestionnaire`: Listar preguntas de un cuestionario
- `create`: Crear pregunta
- `update`: Actualizar pregunta
- `delete`: Eliminar pregunta

**visits.***
- `list`: Listar visitas técnicas
- `getByToken`: Obtener visita por token
- `create`: Crear visita técnica
- `updateStatus`: Actualizar estado

**answers.***
- `create`: Guardar respuesta
- `listByVisit`: Listar respuestas de una visita

**photos.***
- `listByVisit`: Listar fotos de una visita

**reports.***
- `generate`: Generar informe PDF
- `getByVisit`: Obtener informe de una visita
- `sendReport`: Enviar informe por email y subirlo a OpenSolar

**heygen.***
- `getAccessToken`: Obtener token de acceso para HeyGen SDK

### REST Endpoints

**POST /api/upload-photo**
- Subir foto desde el cliente
- Almacenamiento en S3
- Registro en base de datos

**POST /api/transcribe**
- Transcribir audio a texto
- Usa Whisper API
- Retorna transcripción en JSON

---

## Configuración y Despliegue

### Variables de Entorno

**Sistema (Pre-configuradas):**
- `DATABASE_URL`: Conexión a MySQL/TiDB
- `JWT_SECRET`: Secret para sesiones
- `VITE_APP_ID`: ID de la aplicación
- `OAUTH_SERVER_URL`: URL del servidor OAuth
- `BUILT_IN_FORGE_API_URL`: URL de APIs internas
- `BUILT_IN_FORGE_API_KEY`: Key para APIs internas

**Personalizadas (Configurar):**
- `HEYGEN_API_KEY`: API key de HeyGen
- Credenciales de Gmail (vía MCP)
- Credenciales de OpenSolar (greenhproject@gmail.com / Ghp2025@)

### Instalación Local

```bash
# Clonar repositorio
cd /home/ubuntu/clinica_digital_solar

# Instalar dependencias
pnpm install

# Aplicar migraciones de base de datos
pnpm db:push

# Iniciar servidor de desarrollo
pnpm dev
```

### Despliegue a Producción

1. **Guardar Checkpoint**
   ```bash
   # Desde el panel de Manus
   Click en "Save Checkpoint"
   ```

2. **Publicar**
   ```bash
   # Desde el panel de Manus
   Click en "Publish"
   ```

3. **Configurar Dominio** (Opcional)
   - Ir a Settings → Domains
   - Configurar dominio personalizado

---

## Guía de Uso

### Para Administradores

**1. Crear Cuestionario**
- Ir a Dashboard → Cuestionarios
- Click en "Crear Cuestionario"
- Ingresar título y descripción
- Guardar

**2. Agregar Preguntas**
- Abrir cuestionario creado
- Click en "Agregar Pregunta"
- Configurar:
  - Texto de la pregunta
  - Tipo de respuesta
  - Si es obligatoria
  - Si requiere foto
  - Instrucciones para la foto (opcional)
- Guardar

**3. Programar Visita Técnica**
- Ir a Dashboard → Visitas Técnicas
- Click en "Programar Visita Técnica"
- Ingresar:
  - Seleccionar cuestionario
  - Datos del cliente (nombre, email, teléfono)
  - Dirección de instalación
  - ID del proyecto en OpenSolar
  - Ingeniero asignado (opcional)
- Guardar
- Copiar link único generado
- Enviar link al cliente

**4. Revisar Informes**
- Ir a Dashboard → Informes
- Ver lista de informes generados
- Descargar PDF
- Ver score de viabilidad

### Para Clientes

**1. Acceder a la Visita**
- Abrir link recibido por email
- No requiere registro

**2. Interactuar con el Avatar**
- El avatar se presenta automáticamente
- Escuchar las preguntas
- Responder de forma clara

**3. Responder Preguntas**
- **Texto:** Escribir o usar grabación de voz
- **Número:** Ingresar valor numérico
- **Sí/No:** Seleccionar opción
- **Fotos:** Capturar desde cámara o subir archivo

**4. Finalizar**
- Revisar que todas las preguntas estén respondidas
- Click en "Finalizar Visita"
- Recibirás el informe por email

---

## Mantenimiento y Soporte

### Logs y Monitoreo

**Logs del Servidor:**
```bash
# Ver logs en tiempo real
pnpm dev

# Logs de producción
Ver en Dashboard de Manus
```

**Errores Comunes:**

1. **Avatar no se carga**
   - Verificar API key de HeyGen
   - Revisar consola del navegador
   - Verificar conexión a internet

2. **Fotos no se suben**
   - Verificar permisos de cámara
   - Revisar tamaño del archivo (<16MB)
   - Verificar conexión a S3

3. **Transcripción falla**
   - Verificar calidad del audio
   - Revisar formato del archivo
   - Verificar API de Whisper

### Actualizaciones

**Agregar Nuevo Tipo de Pregunta:**
1. Actualizar enum en `drizzle/schema.ts`
2. Agregar lógica en `VisitClient.tsx`
3. Actualizar generación de PDF en `pdfGenerator.ts`
4. Ejecutar `pnpm db:push`

**Cambiar Diseño del PDF:**
1. Editar `server/pdfGenerator.ts`
2. Modificar función `createPDF()`
3. Reiniciar servidor

---

## Seguridad

### Medidas Implementadas

1. **Tokens Únicos**
   - Cada visita tiene un token único
   - Tokens no predecibles (UUID)
   - Validación en cada request

2. **Autenticación Admin**
   - OAuth con Manus
   - Roles de usuario (admin/ingeniero)
   - Protección de rutas sensibles

3. **Validación de Datos**
   - Validación en frontend y backend
   - Sanitización de inputs
   - Límites de tamaño de archivos

4. **Almacenamiento Seguro**
   - S3 con URLs firmadas
   - Base de datos encriptada
   - Variables de entorno protegidas

### Mejores Prácticas

- Cambiar credenciales de OpenSolar periódicamente
- Rotar API keys de servicios externos
- Revisar logs de acceso regularmente
- Mantener dependencias actualizadas

---

## Roadmap Futuro

### Mejoras Planificadas

**Corto Plazo:**
- [ ] Notificaciones en tiempo real
- [ ] Dashboard de analytics
- [ ] Exportar informes en múltiples formatos
- [ ] Plantillas de cuestionarios predefinidas

**Mediano Plazo:**
- [ ] App móvil nativa
- [ ] Integración con más plataformas (Salesforce, HubSpot)
- [ ] IA para análisis predictivo de viabilidad
- [ ] Videollamadas grupales

**Largo Plazo:**
- [ ] Marketplace de cuestionarios
- [ ] API pública para integraciones
- [ ] Soporte multi-idioma completo
- [ ] Realidad aumentada para mediciones

---

## Contacto y Soporte

**Desarrollador:** Manus AI  
**Cliente:** GreenH Project  
**Email:** greenhproject@gmail.com  
**Documentación:** Este archivo

**Soporte Técnico:**
- HeyGen: https://help.heygen.com
- OpenSolar: https://help.opensolar.com
- Manus: https://help.manus.im

---

**Última actualización:** Noviembre 2024  
**Versión del documento:** 2.0
