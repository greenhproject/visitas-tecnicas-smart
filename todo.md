# TODO - Clínica Digital Solar

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
- [ ] Crear página de visita con link único
- [ ] Implementar captura de fotos desde cámara del cliente
- [ ] Subir fotos a S3 con storagePut
- [ ] Guardar respuestas del cliente en base de datos
- [ ] Validar que todas las preguntas obligatorias estén respondidas
- [ ] Mostrar progreso de la visita al cliente

## Fase 4: Integración con HeyGen Avatar IA
- [ ] Investigar y configurar HeyGen API
- [ ] Solicitar API key de HeyGen mediante webdev_request_secrets
- [ ] Crear interfaz de videollamada personalizada con WebRTC
- [ ] Integrar avatar de HeyGen en el stream de video
- [ ] Implementar conversación interactiva con preguntas del cuestionario
- [ ] Configurar reconocimiento de voz para respuestas del cliente
- [ ] Personalizar avatar y voz según marca GreenH Project

## Fase 5: Generación de Informes PDF
- [ ] Instalar librería de generación de PDF (ReportLab o similar)
- [ ] Diseñar plantilla de informe profesional
- [ ] Incluir logo y branding de GreenH Project
- [ ] Generar secciones con respuestas del cliente
- [ ] Incluir fotos capturadas en el informe
- [ ] Agregar análisis de viabilidad basado en respuestas
- [ ] Guardar PDF generado en S3

## Fase 6: Envío de Emails e Integración OpenSolar
- [ ] Configurar Gmail API con admin@greenhproject.com
- [ ] Solicitar credenciales de Gmail mediante webdev_request_secrets
- [ ] Diseñar plantilla de email profesional y estética
- [ ] Implementar envío de informe PDF al cliente
- [ ] Implementar envío de informe PDF al ingeniero a cargo
- [ ] Investigar endpoint de OpenSolar para subir documentos
- [ ] Implementar integración con OpenSolar API
- [ ] Subir informe PDF a proyecto específico en OpenSolar

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
