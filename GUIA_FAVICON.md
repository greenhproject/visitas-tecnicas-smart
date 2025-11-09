# Guía para Actualizar el Favicon

El **favicon** es el pequeño ícono que aparece en la pestaña del navegador junto al título de la página. Para que coincida con la identidad visual de GreenH Project, sigue estos pasos para actualizarlo.

---

## Pasos para Actualizar el Favicon

### 1. Acceder al Management Dashboard

1. Abre tu aplicación en el navegador
2. Haz clic en el ícono de **configuración** (⚙️) en la esquina superior derecha
3. Se abrirá el panel de Management Dashboard

### 2. Navegar a Settings → General

1. En el panel lateral del Management Dashboard, busca la sección **Settings**
2. Haz clic en **General**
3. Verás la página de configuración general de tu aplicación

### 3. Subir el Nuevo Favicon

1. En la sección **Favicon**, verás una opción para subir una imagen
2. Haz clic en **"Upload Favicon"** o en el área de carga
3. Selecciona el archivo del logo que deseas usar como favicon

**Recomendaciones para el favicon:**
- **Formato:** PNG o ICO
- **Tamaño:** 32x32 píxeles o 64x64 píxeles
- **Fondo:** Preferiblemente transparente
- **Sugerencia:** Usa el logo del koala (`KOALALOGOGHP.png`) ya que es simple y se ve bien en tamaños pequeños

### 4. Guardar Cambios

1. Después de subir la imagen, haz clic en **"Save"** o **"Guardar"**
2. El favicon se actualizará automáticamente
3. Refresca la página (F5) para ver el nuevo favicon en la pestaña del navegador

---

## Notas Importantes

- **El favicon es independiente del logo de la aplicación**: El logo que aparece en el sidebar y encabezados se controla desde el código (`APP_LOGO` en `client/src/const.ts`), mientras que el favicon se gestiona desde el Management Dashboard.

- **Caché del navegador**: Si no ves el cambio inmediatamente, intenta:
  - Hacer un "hard refresh": `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)
  - Limpiar la caché del navegador
  - Cerrar y volver a abrir el navegador

- **Favicon en diferentes dispositivos**: El favicon también aparecerá cuando los usuarios agreguen tu sitio a sus marcadores o a la pantalla de inicio en dispositivos móviles.

---

## Archivo Recomendado

Para GreenH Project, se recomienda usar el **logo del koala** (`KOALALOGOGHP.png`) como favicon porque:
- Es simple y reconocible
- Se ve bien en tamaños pequeños
- Es distintivo y memorable
- Complementa el logo principal de GreenH Project

---

## Solución de Problemas

**Problema:** El favicon no cambia después de subirlo
- **Solución:** Limpia la caché del navegador y recarga la página

**Problema:** El favicon se ve borroso
- **Solución:** Asegúrate de usar una imagen de al menos 32x32 píxeles con buena resolución

**Problema:** No encuentro la opción de favicon en Settings
- **Solución:** Verifica que estés en la sección **Settings → General** del Management Dashboard

---

**Última actualización:** Noviembre 2024
