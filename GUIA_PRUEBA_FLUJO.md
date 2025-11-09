# Guía de Prueba del Flujo Completo - Visitas Técnicas Smart

Esta guía te ayudará a probar el flujo completo del sistema desde la creación de una visita técnica hasta la generación del informe PDF.

---

## Configuración Actual

✅ **Avatar personalizado configurado:** `0f97b240e94a491aa47e27c0a038c7de`  
✅ **Voz clonada personalizada configurada:** `5d29644883bf4359b4d561a5db2dd740`  
✅ **Cuestionario de prueba cargado:** "Visita Técnica Solar Residencial" (22 preguntas)

---

## Paso 1: Acceder al Panel Administrativo

1. Abre la aplicación en tu navegador
2. Inicia sesión con tu cuenta de administrador
3. Verás el **Panel Administrativo** con las siguientes secciones:
   - Cuestionarios
   - Visitas Técnicas
   - Informes
   - Ingenieros

---

## Paso 2: Verificar el Cuestionario

1. Haz clic en **"Gestionar →"** en la tarjeta de **Cuestionarios**
2. Deberías ver el cuestionario **"Visita Técnica Solar Residencial"**
3. Haz clic en **"Ver Preguntas"** para revisar las 22 preguntas configuradas
4. Verifica que incluye preguntas de diferentes tipos:
   - Texto (tipo de vivienda, orientación del techo)
   - Número (área del techo, consumo de energía)
   - Sí/No (sombras en el techo, acceso fácil)
   - Fotos (fachada, techo, tablero eléctrico, medidor)

---

## Paso 3: Programar una Visita Técnica de Prueba

1. Desde el Dashboard, haz clic en **"Programar Visita Técnica"**
2. Completa el formulario:
   - **Cliente:** Nombre de prueba (ej: "Juan Pérez")
   - **Email:** Tu email para recibir el informe
   - **Teléfono:** Número de contacto
   - **Dirección:** Dirección de prueba
   - **Cuestionario:** Selecciona "Visita Técnica Solar Residencial"
   - **Fecha programada:** Selecciona fecha y hora
   - **ID Proyecto OpenSolar:** (Opcional) ID del proyecto en OpenSolar
   - **Ingeniero asignado:** Selecciona un ingeniero
3. Haz clic en **"Crear Visita"**
4. **Copia el link generado** - Este es el link único que compartirás con el cliente

---

## Paso 4: Realizar la Visita Técnica (Como Cliente)

1. Abre el **link de la visita** en una nueva pestaña o en tu móvil
2. Verás la página de **Visita Técnica Virtual** con:
   - Logo de GreenH Project
   - Información del cliente
   - Botón para **"Iniciar Visita Técnica"**

### 4.1. Iniciar el Avatar Conversacional

1. Haz clic en **"Iniciar Visita Técnica"**
2. Se cargará el **avatar interactivo de HeyGen** con tu avatar y voz personalizados
3. El avatar te dará la bienvenida y comenzará a hacer las preguntas del cuestionario

### 4.2. Responder las Preguntas

El sistema te guiará a través de las 22 preguntas:

**Preguntas de texto/número:**
- Escribe tu respuesta en el campo de texto
- O usa el **botón de micrófono** para responder verbalmente (transcripción automática con Whisper)

**Preguntas de Sí/No:**
- Selecciona la opción correspondiente

**Preguntas con fotos:**
- Haz clic en **"Tomar Foto"** o **"Subir Archivo"**
- Si estás en móvil, se abrirá la cámara automáticamente
- Captura la foto según las instrucciones mostradas
- La foto se subirá automáticamente a S3

### 4.3. Completar la Visita

1. Responde todas las preguntas obligatorias (marcadas con *)
2. La barra de progreso te mostrará el avance
3. Al completar todas las preguntas, haz clic en **"Finalizar Visita"**
4. Verás un mensaje de confirmación

---

## Paso 5: Verificar el Informe Generado

### 5.1. Desde el Panel Administrativo

1. Regresa al **Panel Administrativo**
2. Haz clic en **"Ver todas →"** en la tarjeta de **Visitas Técnicas**
3. Busca la visita que acabas de completar (estado: "Completada")
4. Haz clic en **"Ver Detalles"**
5. Haz clic en **"Generar Informe PDF"**

### 5.2. Contenido del Informe PDF

El informe generado incluye:

**Encabezado:**
- Logo de GreenH Project
- Título: "Informe de Visita Técnica Virtual"
- Slogan: "Revoluciona el concepto de vivir"
- Información de contacto real:
  - Dirección: Cra 1 Este # 2-26 local 2, Mosquera, Colombia
  - Cel: (57) 321 456 76 44
  - Email: info@greenhproject.com

**Información del Cliente:**
- Nombre, email, dirección, teléfono
- Fecha de la visita
- Ingeniero asignado

**Respuestas del Cuestionario:**
- Todas las preguntas con sus respuestas
- Fotos embebidas directamente en el PDF (no solo URLs)
- Instrucciones de captura de cada foto

**Análisis de Viabilidad:**
- Score automático (0-100)
- Código de colores (verde/amarillo/rojo)
- Recomendaciones basadas en las respuestas

**Galería de Fotos:**
- Todas las fotos capturadas durante la visita
- Organizadas en cuadrícula

**Firma Digital:**
- Espacio para firma del técnico/ingeniero

---

## Paso 6: Verificar Envío de Emails

Después de generar el informe, el sistema automáticamente:

1. **Envía email al cliente** con:
   - Asunto: "Informe de Visita Técnica Solar - GreenH Project"
   - Cuerpo personalizado con información de la visita
   - Informe PDF adjunto

2. **Envía email al ingeniero asignado** con:
   - Copia del informe PDF
   - Información del cliente
   - Próximos pasos

3. **Sube el informe a OpenSolar** (si se proporcionó ID de proyecto):
   - Se adjunta al proyecto correspondiente
   - Disponible para todo el equipo

---

## Paso 7: Verificar en OpenSolar (Opcional)

Si proporcionaste un ID de proyecto OpenSolar:

1. Inicia sesión en [OpenSolar](https://opensolar.com)
2. Navega al proyecto correspondiente
3. Busca en la sección de **Documentos** o **Archivos**
4. Deberías ver el informe PDF recién subido

---

## Funcionalidades Clave a Probar

### ✅ Avatar Conversacional
- [ ] El avatar personalizado se carga correctamente
- [ ] La voz clonada suena natural y clara
- [ ] El avatar hace las preguntas en secuencia
- [ ] El avatar responde a las interacciones del usuario

### ✅ Captura de Fotos
- [ ] Se pueden tomar fotos desde la cámara (móvil)
- [ ] Se pueden subir archivos desde el dispositivo
- [ ] Las fotos se suben correctamente a S3
- [ ] Las fotos se muestran en la vista previa

### ✅ Reconocimiento de Voz
- [ ] El botón de micrófono funciona
- [ ] El audio se graba correctamente
- [ ] La transcripción con Whisper es precisa
- [ ] El texto transcrito se inserta en el campo de respuesta

### ✅ Generación de PDF
- [ ] El PDF se genera sin errores
- [ ] Incluye el logo de GreenH Project
- [ ] Muestra toda la información del cliente
- [ ] Incluye todas las respuestas
- [ ] Las fotos están embebidas (no solo URLs)
- [ ] El análisis de viabilidad es correcto
- [ ] La galería de fotos se muestra correctamente

### ✅ Envío de Emails
- [ ] El email al cliente se envía correctamente
- [ ] El email al ingeniero se envía correctamente
- [ ] Los PDFs están adjuntos
- [ ] El formato del email es profesional

### ✅ Integración con OpenSolar
- [ ] El informe se sube correctamente
- [ ] Se asocia al proyecto correcto
- [ ] Es accesible desde OpenSolar

---

## Solución de Problemas Comunes

### Problema: El avatar no se carga

**Solución:**
- Verifica que la API key de HeyGen esté configurada correctamente
- Revisa la consola del navegador para errores
- Asegúrate de tener conexión a internet estable

### Problema: Las fotos no se suben

**Solución:**
- Verifica que el tamaño del archivo sea menor a 16MB
- Comprueba que el formato sea compatible (JPG, PNG, WEBP)
- Revisa los permisos de la cámara en el navegador

### Problema: La transcripción de voz no funciona

**Solución:**
- Verifica los permisos del micrófono en el navegador
- Asegúrate de hablar claramente y en español
- Comprueba que el audio se esté grabando (indicador visual)

### Problema: El PDF no se genera

**Solución:**
- Verifica que todas las preguntas obligatorias estén respondidas
- Revisa los logs del servidor para errores
- Asegúrate de que las fotos se hayan subido correctamente

### Problema: Los emails no se envían

**Solución:**
- Verifica la autenticación de Gmail MCP
- Comprueba que los emails de destino sean válidos
- Revisa los logs del servidor para errores de envío

---

## Métricas de Éxito

Una prueba exitosa debe cumplir:

✅ **Tiempo de respuesta del avatar:** < 3 segundos  
✅ **Calidad de la voz:** Natural y clara  
✅ **Tasa de éxito de subida de fotos:** 100%  
✅ **Precisión de transcripción de voz:** > 90%  
✅ **Tiempo de generación de PDF:** < 10 segundos  
✅ **Tasa de entrega de emails:** 100%  
✅ **Experiencia del usuario:** Fluida y profesional

---

## Próximos Pasos Después de la Prueba

1. **Ajustar configuraciones** según los resultados de la prueba
2. **Personalizar preguntas** del cuestionario según necesidades específicas
3. **Entrenar al equipo** en el uso del sistema
4. **Configurar notificaciones** en tiempo real para nuevas visitas
5. **Implementar dashboard de analytics** para métricas de negocio

---

**Última actualización:** Noviembre 2024  
**Versión del sistema:** 2.0  
**Soporte:** info@greenhproject.com
