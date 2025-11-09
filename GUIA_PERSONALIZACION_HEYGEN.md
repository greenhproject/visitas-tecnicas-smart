# Guía de Personalización de Avatar y Voz en HeyGen

Esta guía te ayudará a crear un avatar personalizado con tu propia imagen y voz clonada en español para usar en el sistema de visitas técnicas virtuales.

---

## 📋 Requisitos Previos

- Cuenta de HeyGen (ya configurada con API key)
- Video o foto de alta calidad del asesor/ingeniero
- Grabación de audio de la voz a clonar (mínimo 2 minutos)
- Acceso a la plataforma web de HeyGen

---

## 🎭 Paso 1: Crear Avatar Personalizado

### Opción A: Photo Avatar (Más Rápido)

1. **Acceder a HeyGen**
   - Ir a https://app.heygen.com
   - Iniciar sesión con greenhproject@gmail.com

2. **Crear Photo Avatar**
   - En el menú lateral, hacer clic en **"Avatares"**
   - Seleccionar **"Photo Avatar"**
   - Subir una foto de alta calidad (requisitos):
     - Resolución mínima: 1024x1024 píxeles
     - Formato: JPG o PNG
     - Fondo limpio y uniforme
     - Iluminación frontal y uniforme
     - Persona mirando directamente a la cámara
     - Rostro claramente visible sin obstrucciones

3. **Configurar el Avatar**
   - Nombre: "Asesor GreenH Project"
   - Descripción: "Avatar para visitas técnicas virtuales"
   - Estilo: Profesional
   - Hacer clic en **"Crear Avatar"**

4. **Esperar Procesamiento**
   - El proceso toma entre 5-15 minutos
   - Recibirás un email cuando esté listo

### Opción B: Video Avatar (Más Realista)

1. **Grabar Video de Referencia**
   - Duración: 2-5 minutos
   - Resolución: 1080p o superior
   - Formato: MP4
   - Requisitos de grabación:
     - Fondo limpio y uniforme (preferiblemente verde o blanco)
     - Iluminación profesional (frontal y uniforme)
     - Cámara estable (usar trípode)
     - Persona mirando a la cámara
     - Hablar de forma natural y clara
     - Incluir diferentes expresiones faciales
     - Mover ligeramente las manos

2. **Subir Video a HeyGen**
   - En **"Avatares"** → **"Video Avatar"**
   - Subir el video grabado
   - Esperar procesamiento (30-60 minutos)

---

## 🎤 Paso 2: Clonar Voz en Español

### Preparar Grabación de Voz

1. **Requisitos de Audio**
   - Duración: 2-10 minutos
   - Formato: MP3, WAV o M4A
   - Calidad: Alta (sin ruido de fondo)
   - Idioma: Español (acento colombiano preferiblemente)
   - Contenido: Texto variado con diferentes entonaciones

2. **Recomendaciones para Grabar**
   - Usar micrófono de buena calidad
   - Grabar en ambiente silencioso
   - Hablar de forma natural y clara
   - Incluir diferentes emociones (alegría, seriedad, entusiasmo)
   - Evitar pausas muy largas

### Subir Voz a HeyGen

1. **Acceder a Voice Cloning**
   - En el menú lateral, ir a **"Medios"** → **"Voces"**
   - Hacer clic en **"Crear Voz"**

2. **Configurar Voz Clonada**
   - Nombre: "Voz Asesor GreenH"
   - Idioma: Español (es-ES o es-LA)
   - Subir archivo de audio
   - Aceptar términos de uso

3. **Esperar Procesamiento**
   - El proceso toma 10-30 minutos
   - La voz estará disponible en tu biblioteca

---

## 🔧 Paso 3: Configurar Avatar en el Sistema

### Obtener ID del Avatar

1. **Listar Avatares Disponibles**
   - En HeyGen, ir a **"Avatares"**
   - Copiar el **Avatar ID** de tu avatar personalizado
   - Ejemplo: `avatar_abc123xyz`

2. **Obtener ID de la Voz**
   - En **"Voces"**, copiar el **Voice ID**
   - Ejemplo: `voice_def456uvw`

### Actualizar Código del Sistema

1. **Editar InteractiveAvatar.tsx**
   ```typescript
   // Línea ~40-50
   const avatarId = "TU_AVATAR_ID_AQUI"; // Reemplazar con tu Avatar ID
   const voiceId = "TU_VOICE_ID_AQUI";  // Reemplazar con tu Voice ID
   ```

2. **Reiniciar Servidor**
   ```bash
   pnpm dev
   ```

---

## 🎨 Paso 4: Personalizar Apariencia y Comportamiento

### Configurar Expresiones y Gestos

En el archivo `InteractiveAvatar.tsx`, puedes personalizar:

```typescript
// Configuración de avatar
const avatarConfig = {
  avatarId: "TU_AVATAR_ID",
  voiceId: "TU_VOICE_ID",
  language: "es",
  quality: "high",
  // Personalización adicional
  emotion: "friendly", // friendly, professional, enthusiastic
  gesture: "natural",  // natural, minimal, expressive
};
```

### Personalizar Mensajes del Avatar

Editar los mensajes en `VisitClient.tsx`:

```typescript
// Saludo inicial personalizado
const greeting = `Hola ${clientName}, soy [NOMBRE DEL ASESOR], 
tu asesor virtual de GreenH Project. Voy a guiarte a través de 
esta visita técnica para evaluar la viabilidad de tu instalación 
solar. ¿Estás listo para comenzar?`;
```

---

## 📊 Paso 5: Probar el Avatar

### Realizar Prueba Completa

1. **Crear Visita de Prueba**
   - Ir al panel administrativo
   - Crear un cuestionario de prueba
   - Programar una visita técnica

2. **Acceder como Cliente**
   - Copiar el link único de la visita
   - Abrir en navegador
   - Verificar que el avatar se carga correctamente
   - Probar la conversación

3. **Verificar Funcionalidades**
   - ✅ Avatar se muestra correctamente
   - ✅ Voz suena natural y clara
   - ✅ Sincronización labial es precisa
   - ✅ Gestos son naturales
   - ✅ Responde correctamente a las interacciones

---

## 🔍 Solución de Problemas

### Avatar no se Carga

- Verificar que el Avatar ID es correcto
- Confirmar que el avatar está aprobado en HeyGen
- Revisar la consola del navegador para errores

### Voz no Suena Natural

- Asegurarse de que la grabación original es de alta calidad
- Verificar que el idioma está configurado como español
- Intentar con una grabación más larga (5-10 minutos)

### Sincronización Labial Incorrecta

- Usar Avatar IV (modelo más avanzado) en lugar de Photo Avatar
- Verificar que la foto/video de referencia es de alta calidad
- Contactar soporte de HeyGen si el problema persiste

---

## 💡 Mejores Prácticas

### Para el Avatar

1. **Foto/Video de Calidad**
   - Usar cámara profesional o smartphone de alta gama
   - Iluminación de 3 puntos (frontal, lateral, contraluz)
   - Fondo uniforme (verde o blanco)

2. **Apariencia Profesional**
   - Vestimenta formal o semi-formal
   - Colores sólidos (evitar patrones complejos)
   - Maquillaje natural (si aplica)

### Para la Voz

1. **Grabación de Calidad**
   - Micrófono de condensador o dinámico
   - Ambiente silencioso (sin eco)
   - Distancia constante del micrófono

2. **Contenido Variado**
   - Leer textos técnicos sobre energía solar
   - Incluir preguntas y respuestas
   - Variar entonación y velocidad

---

## 📞 Soporte

Si tienes problemas con la creación del avatar o la clonación de voz:

- **Soporte HeyGen**: https://help.heygen.com
- **Email**: support@heygen.com
- **Documentación**: https://docs.heygen.com

---

## 🎯 Resultado Esperado

Una vez completados todos los pasos, tendrás:

✅ Avatar personalizado con la imagen de tu asesor/ingeniero
✅ Voz clonada en español que suena natural
✅ Sistema de visitas técnicas totalmente funcional
✅ Experiencia de videollamada realista para los clientes

---

**Última actualización:** Noviembre 2024
**Versión del sistema:** 1.0
