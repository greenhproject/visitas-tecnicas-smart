# Problemas Confirmados - Prueba Completa del Sistema

## 1. ❌ Avatar NO se carga automáticamente
**Problema**: La página de visita muestra "Avatar no conectado" y requiere hacer clic manual en "Iniciar Sesión"
**Ubicación**: `/visit/{uniqueToken}`
**Solución**: Modificar `VisitClient.tsx` para conectar el avatar automáticamente al cargar la página

## 2. ❌ Página de Reportes no existe (404)
**Problema**: La ruta `/reports` muestra "404 Page Not Found"
**Ubicación**: `/reports`
**Solución**: Crear la página `Reports.tsx` y agregar la ruta en `App.tsx`

## 3. ❌ No hay botón para eliminar visitas
**Problema**: En la página de Visitas no existe botón de eliminar (trash icon) en las acciones
**Ubicación**: `/visits`
**Solución**: Agregar botón de eliminar con confirmación en `Visits.tsx` y procedimiento tRPC

## 4. ⚠️ Responsive necesita mejoras
**Problema**: El diseño no se adapta bien a móviles (reportado por usuario)
**Ubicación**: Todas las páginas, especialmente `VisitClient.tsx`
**Solución**: Ya se hicieron mejoras pero pueden necesitar ajustes adicionales

## 5. ❓ Cuestionario muestra "N/A" (por verificar)
**Problema**: En reportes el cuestionario muestra "N/A" en lugar del nombre
**Ubicación**: Página de reportes (que no existe aún)
**Solución**: Al crear la página de reportes, hacer JOIN con tabla questionnaires

## Prioridad de Corrección
1. Crear página de Reportes (Reports.tsx)
2. Agregar botón de eliminar visitas
3. Auto-conectar avatar en VisitClient
4. Verificar y mejorar responsive adicional si es necesario
