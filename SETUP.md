# Guía de Configuración - Visitas Técnicas Smart

## Variables de Entorno Requeridas

Este proyecto requiere las siguientes variables de entorno. En Manus Platform, estas se configuran automáticamente. Si despliegas en otro entorno, necesitarás configurarlas manualmente.

### Base de Datos
- `DATABASE_URL`: Cadena de conexión MySQL/TiDB

### Autenticación
- `JWT_SECRET`: Secreto para firmar tokens JWT
- `VITE_APP_ID`: ID de la aplicación Manus OAuth
- `OAUTH_SERVER_URL`: URL del servidor OAuth de Manus
- `VITE_OAUTH_PORTAL_URL`: URL del portal de login de Manus
- `OWNER_OPEN_ID`: OpenID del propietario del proyecto
- `OWNER_NAME`: Nombre del propietario

### APIs Externas
- `HEYGEN_API_KEY`: API key de HeyGen para avatar interactivo
- `BUILT_IN_FORGE_API_URL`: URL de APIs integradas de Manus
- `BUILT_IN_FORGE_API_KEY`: Token para APIs de Manus (servidor)
- `VITE_FRONTEND_FORGE_API_KEY`: Token para APIs de Manus (frontend)

### Aplicación
- `VITE_APP_TITLE`: Título de la aplicación (configurable en UI)
- `VITE_APP_LOGO`: Ruta del logo (configurable en UI)

### Opcional
- `VITE_ANALYTICS_ENDPOINT`: Endpoint de analytics
- `VITE_ANALYTICS_WEBSITE_ID`: ID del sitio para analytics

## Configuración de HeyGen

### 1. Obtener API Key
1. Crear cuenta en https://heygen.com
2. Ir a Settings → API Keys
3. Generar nueva API key
4. Copiar la key y configurarla en `HEYGEN_API_KEY`

### 2. Configurar Avatar
El proyecto usa el avatar público "Eric_public_pro2_20230608" por defecto.

Para usar un avatar personalizado:
1. Crear avatar en HeyGen dashboard
2. Obtener el `avatarId` del avatar creado
3. Actualizar en `client/src/components/InteractiveAvatar.tsx`:
   ```typescript
   const avatarId = "TU_AVATAR_ID_AQUI";
   ```

### 3. Configurar Voz (Opcional)
Para usar una voz clonada personalizada:
1. Clonar voz en HeyGen (Instant Voice Cloning)
2. Obtener el `voiceId`
3. Actualizar en `client/src/components/InteractiveAvatar.tsx`:
   ```typescript
   const voiceId = "TU_VOICE_ID_AQUI";
   ```

## Configuración de S3

El almacenamiento S3 está preconfigurado en Manus Platform. Si despliegas en otro entorno:

1. Crear bucket en AWS S3
2. Configurar permisos de acceso público para lectura
3. Obtener credenciales (Access Key ID y Secret Access Key)
4. Actualizar configuración en `server/storage.ts`

## Configuración de Gmail API

Para envío de emails, el proyecto usa Gmail API vía MCP (Model Context Protocol) de Manus.

Si despliegas fuera de Manus:
1. Configurar proyecto en Google Cloud Console
2. Habilitar Gmail API
3. Crear credenciales OAuth 2.0
4. Implementar autenticación OAuth en el código

## Configuración de OpenSolar

Para integración con OpenSolar:
1. Obtener API key de OpenSolar
2. Configurar en variables de entorno
3. Actualizar endpoint en el código si es necesario

## Base de Datos

### Migración Inicial
```bash
pnpm db:push
```

### Seed de Datos de Prueba
```bash
pnpm tsx scripts/seed-questionnaire.mjs
```

Esto creará:
- 1 cuestionario de ejemplo: "Visita Técnica Solar Residencial"
- 8 preguntas de diferentes tipos
- Datos listos para probar el sistema

## Despliegue

### En Manus Platform
1. El proyecto ya está configurado
2. Hacer clic en "Publish" para desplegar
3. El sitio estará disponible en `*.manus.space`

### En Otro Entorno
1. Configurar todas las variables de entorno
2. Instalar dependencias: `pnpm install`
3. Build: `pnpm build`
4. Iniciar servidor: `pnpm start`

## Verificación

### Verificar Avatar
1. Abrir una visita técnica
2. El avatar debe aparecer y conectarse automáticamente
3. Debe saludar y leer la primera pregunta

### Verificar Captura de Fotos
1. En móvil, abrir visita técnica
2. Llegar a pregunta que requiere foto
3. Hacer clic en "Tomar Foto"
4. La cámara nativa debe abrirse

### Verificar Generación de PDF
1. Completar una visita técnica
2. Verificar que se genera el PDF
3. Revisar que incluye todas las respuestas y fotos

### Verificar Envío de Emails
1. Completar una visita técnica
2. Verificar que se envía email al cliente
3. Verificar que se envía email al ingeniero

## Troubleshooting

### Avatar no se conecta
- Verificar que `HEYGEN_API_KEY` está configurada
- Verificar que el `avatarId` es válido
- Revisar logs del servidor para errores de HeyGen API
- Verificar límites de uso de HeyGen (concurrent sessions)

### Fotos no se suben
- Verificar configuración de S3
- Verificar permisos del bucket
- Revisar logs del servidor

### Emails no se envían
- Verificar configuración de Gmail API
- Verificar que el MCP de Gmail está configurado
- Revisar logs del servidor

### Base de datos no conecta
- Verificar `DATABASE_URL`
- Verificar que la base de datos está accesible
- Ejecutar `pnpm db:push` para crear tablas

## Contacto

Para soporte con Manus Platform:
- https://help.manus.im
