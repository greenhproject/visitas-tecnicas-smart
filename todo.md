# TODO - Visitas Técnicas Smart

## Fase 1: Base de Datos y Modelos
- [x] Diseñar esquema de base de datos completo
- [x] Crear tabla de cuestionarios (questionnaires)
- [x] Crear tabla de preguntas (questions)
- [x] Crear tabla de visitas técnicas (technical_visits)
- [x] Crear tabla de respuestas (answers)
- [x] Crear tabla de fotos capturadas (photos)
- [x] Crear tabla de informes generados (reports)
- [x] Crear tabla de ingenieros (engineers)
- [x] Implementar funciones de base de datos en server/db.ts

## Fase 2: Panel Administrativo
- [x] Crear interfaz de dashboard para administradores
- [x] Implementar CRUD de cuestionarios
- [x] Implementar CRUD de preguntas con configuración de obligatoriedad
- [x] Configurar qué fotos son necesarias por pregunta
- [ ] Gestión de ingenieros asignados
- [ ] Vista de historial de visitas técnicas
- [ ] Descarga de informes generados

## Fase 3: Sistema de Visitas Técnicas
- [x] Crear página de visita con link único
- [x] Implementar captura de fotos desde cámara del cliente
- [x] Subir fotos a S3 con storagePut
- [x] Guardar respuestas del cliente en base de datos
- [x] Validar que todas las preguntas obligatorias estén respondidas
- [x] Mostrar progreso de la visita al cliente

## Fase 4: Integración con HeyGen Avatar IA
- [x] Investigar y configurar HeyGen API
- [x] Solicitar API key de HeyGen mediante webdev_request_secrets
- [x] Crear interfaz de videollamada personalizada con WebRTC
- [x] Integrar avatar de HeyGen en el stream de video
- [x] Implementar conversación interactiva con preguntas del cuestionario
- [ ] Configurar reconocimiento de voz para respuestas del cliente
- [ ] Personalizar avatar y voz según marca GreenH Project

## Fase 5: Generación de Informes PDF
- [x] Instalar librería de generación de PDF (PDFKit)
- [x] Diseñar plantilla de informe profesional
- [x] Incluir logo y branding de GreenH Project
- [x] Generar secciones con respuestas del cliente
- [x] Incluir fotos capturadas en el informe
- [ ] Agregar análisis de viabilidad basado en respuestas
- [x] Guardar PDF generado en S3

## Fase 6: Envío de Emails e Integración OpenSolar
- [x] Configurar Gmail API con admin@greenhproject.com
- [x] Utilizar MCP de Gmail para envío de emails
- [x] Diseñar plantilla de email profesional y estética
- [x] Implementar envío de informe PDF al cliente
- [x] Implementar envío de informe PDF al ingeniero a cargo
- [x] Investigar endpoint de OpenSolar para subir documentos
- [x] Implementar integración con OpenSolar API
- [x] Subir informe PDF a proyecto específico en OpenSolar

## Fase 7: Pruebas y Ajustes
- [ ] Probar flujo completo de visita técnica
- [ ] Verificar generación correcta de informes
- [ ] Validar envío de emails
- [ ] Confirmar integración con OpenSolar
- [ ] Ajustar diseño y UX según feedback
- [ ] Optimizar rendimiento de carga de fotos
- [ ] Verificar responsividad en dispositivos móviles

## Fase 8: Documentación y Entrega
- [ ] Documentar arquitectura del sistema
- [ ] Crear guía de uso para administradores
- [ ] Documentar proceso de configuración de cuestionarios
- [ ] Crear manual de usuario para clientes
- [ ] Documentar integración con APIs externas
- [ ] Preparar guía de despliegue
- [ ] Crear checkpoint final del proyecto

## Nuevos Requerimientos - Formato de Informe
- [ ] Implementar marca de agua en fotos capturadas (nombre técnico, cliente, fecha)
- [ ] Agregar campo de firma digital del técnico
- [ ] Crear plantilla PDF con diseño profesional de GreenH Project
- [ ] Incluir galería de fotos al final del PDF
- [ ] Agregar sección de observaciones finales
- [ ] Implementar tipos de pregunta: solo foto, solo texto, foto+texto, numérica, selección múltiple
- [ ] Permitir configurar opciones predefinidas para preguntas de selección

## Mejoras Adicionales

### Mejora de Informes PDF
- [x] Descargar y embeber imágenes directamente en el PDF
- [x] Agregar análisis de viabilidad automático basado en respuestas
- [x] Implementar firma digital del técnico/ingeniero
- [x] Mejorar diseño visual del PDF con imágenes en galería

### Reconocimiento de Voz
- [x] Integrar API de Whisper para transcripción de voz
- [x] Agregar botón de grabación de voz en cada pregunta
- [x] Implementar transcripción automática de respuestas verbales
- [x] Mostrar transcripción en tiempo real al usuario

### Personalización de Avatar HeyGen
- [x] Investigar cómo crear avatar personalizado en HeyGen
- [x] Configurar voz clonada en español
- [x] Documentar proceso de personalización para el cliente

## Integración de Logos Oficiales
- [x] Copiar logos a la carpeta public del proyecto
- [x] Actualizar APP_LOGO en const.ts con el logo principal
- [x] Integrar logo principal en el encabezado del dashboard
- [x] Integrar logo principal en la página de visitas para clientes
- [x] Integrar logo del koala como elemento visual complementario
- [x] Actualizar generador de PDF para usar el logo oficial
- [x] Verificar que los logos se vean correctamente en todos los tamaños

## Mejoras Finales
- [x] Actualizar información de contacto real en generador de PDF
- [x] Crear script de seed para cuestionario de prueba
- [x] Agregar preguntas típicas de visita técnica solar
- [x] Documentar instrucciones para actualizar favicon

## Cambio de Nombre
- [x] Actualizar nombre de la aplicación a "Visitas Técnicas Smart"
- [x] Actualizar título en const.ts
- [x] Actualizar título en package.json
- [x] Actualizar referencias en documentación

## Actualización de Avatar Personalizado
- [x] Actualizar avatarId en InteractiveAvatar.tsx con el ID del avatar personalizado

## Corrección de Menú
- [x] Eliminar "Page 2" del menú del sidebar (ruta inexistente)

## Configuración de Voz Personalizada y Pruebas
- [x] Actualizar voiceId con la voz clonada personalizada
- [x] Probar flujo completo de visita técnica
- [x] Verificar funcionamiento del avatar con voz personalizada

## Corrección de Errores Reportados
- [x] Investigar y corregir error al ingresar a visita técnica
- [x] Refactorizar InteractiveAvatar para usar API REST de HeyGen
- [x] Eliminar SDK deprecado @heygen/streaming-avatar
- [x] Implementar llamadas directas a la API de HeyGen
- [ ] Corregir datos en blanco en el dashboard
- [ ] Verificar conexión con base de datos
