import { ENV } from "../server/_core/env.ts";

async function listAvatars() {
  try {
    const response = await fetch("https://api.heygen.com/v1/streaming.avatar.list", {
      method: "GET",
      headers: {
        "accept": "application/json",
        "x-api-key": process.env.HEYGEN_API_KEY
      }
    });

    const data = await response.json();
    
    if (data.code === 100) {
      console.log(`\n✅ Encontrados ${data.data.length} avatares disponibles:\n`);
      data.data.slice(0, 10).forEach((avatar, index) => {
        console.log(`${index + 1}. ${avatar.pose_name}`);
        console.log(`   ID: ${avatar.avatar_id}`);
        console.log(`   Status: ${avatar.status}`);
        console.log(`   Public: ${avatar.is_public ? 'Sí' : 'No'}`);
        console.log(`   Voice ID: ${avatar.default_voice}`);
        console.log('');
      });
      
      if (data.data.length > 10) {
        console.log(`... y ${data.data.length - 10} avatares más\n`);
      }
    } else {
      console.error("Error al obtener avatares:", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

listAvatars();
