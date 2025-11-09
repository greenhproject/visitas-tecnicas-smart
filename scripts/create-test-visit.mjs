import { drizzle } from "drizzle-orm/mysql2";
import { technicalVisits, questionnaires } from "../drizzle/schema.ts";
import crypto from "crypto";

const db = drizzle(process.env.DATABASE_URL);

async function createTestVisit() {
  try {
    // Obtener el primer cuestionario disponible
    const questionnaire = await db.select().from(questionnaires).limit(1);
    
    if (questionnaire.length === 0) {
      console.error("No hay cuestionarios en la base de datos");
      process.exit(1);
    }

    // Generar un token único
    const uniqueToken = crypto.randomBytes(32).toString("hex");
    
    // Crear la visita técnica
    await db.insert(technicalVisits).values({
      questionnaireId: questionnaire[0].id,
      clientName: "Cliente de Prueba",
      clientEmail: "prueba@greenhproject.com",
      clientPhone: "+1234567890",
      address: "Calle de Prueba 123, Ciudad",
      status: "pending",
      uniqueToken: uniqueToken,
      engineerId: null,
    });

    console.log("✅ Visita técnica creada exitosamente");
    console.log("\n📋 Detalles de la visita:");
    console.log(`   Cliente: Cliente de Prueba`);
    console.log(`   Email: prueba@greenhproject.com`);
    console.log(`   Cuestionario ID: ${questionnaire[0].id}`);
    console.log(`   Token: ${uniqueToken}`);
    console.log(`\n🔗 Link de acceso:`);
    console.log(`   https://visitasghp.manus.space/visit/${uniqueToken}`);
    
  } catch (error) {
    console.error("Error al crear visita:", error);
    process.exit(1);
  }
}

createTestVisit();
