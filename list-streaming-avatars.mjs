/**
 * Script para listar avatares de Streaming disponibles en HeyGen
 * Esto ayudará a identificar el avatar_id correcto para Interactive Avatar
 */

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

if (!HEYGEN_API_KEY) {
  console.error("❌ Error: HEYGEN_API_KEY no está configurada");
  console.error("Configura la variable de entorno HEYGEN_API_KEY antes de ejecutar este script");
  process.exit(1);
}

async function listStreamingAvatars() {
  try {
    console.log("🔍 Consultando avatares de Streaming disponibles en HeyGen...\n");

    const response = await fetch(
      "https://api.heygen.com/v1/streaming/avatar.list",
      {
        method: "GET",
        headers: {
          "accept": "application/json",
          "x-api-key": HEYGEN_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error de HeyGen API:", errorData);
      process.exit(1);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      console.log("⚠️  No se encontraron avatares de Streaming en tu cuenta.");
      console.log("\n📝 Nota: Los avatares de Streaming (Interactive Avatars) son diferentes a los avatares de video regulares.");
      console.log("   Para crear un avatar de Streaming, ve a: https://app.heygen.com/avatars");
      return;
    }

    console.log(`✅ Se encontraron ${data.data.length} avatar(es) de Streaming:\n`);
    console.log("═".repeat(80));

    data.data.forEach((avatar, index) => {
      console.log(`\n${index + 1}. ${avatar.pose_name || "Sin nombre"}`);
      console.log(`   Avatar ID: ${avatar.avatar_id}`);
      console.log(`   Estado: ${avatar.status}`);
      console.log(`   Público: ${avatar.is_public ? "Sí" : "No"}`);
      console.log(`   Voz por defecto: ${avatar.default_voice || "No especificada"}`);
      console.log(`   Fecha de creación: ${new Date(avatar.created_at * 1000).toLocaleString()}`);
      if (avatar.normal_preview) {
        console.log(`   Vista previa: ${avatar.normal_preview}`);
      }
    });

    console.log("\n" + "═".repeat(80));
    console.log("\n📋 Copia el 'Avatar ID' del avatar que deseas usar");
    console.log("   y actualízalo en client/src/components/InteractiveAvatar.tsx\n");

  } catch (error) {
    console.error("❌ Error al listar avatares:", error.message);
    process.exit(1);
  }
}

listStreamingAvatars();
