import { drizzle } from "drizzle-orm/mysql2";
import { questionnaires, questions } from "./drizzle/schema.js";

// Conectar a la base de datos
const db = drizzle(process.env.DATABASE_URL);

async function seedQuestionnaire() {
  try {
    console.log("🌱 Iniciando seed del cuestionario de visita técnica solar...");

    // Crear cuestionario
    const [questionnaire] = await db.insert(questionnaires).values({
      title: "Visita Técnica Solar Residencial",
      description: "Cuestionario completo para evaluar la viabilidad de instalación de sistema solar fotovoltaico en viviendas",
      isActive: 1,
      createdById: 1, // Asumiendo que el admin tiene ID 1
    });

    const questionnaireId = questionnaire.insertId;
    console.log(`✅ Cuestionario creado con ID: ${questionnaireId}`);

    // Crear preguntas del cuestionario
    const questionsData = [
      // Información general
      {
        questionnaireId,
        questionText: "¿Cuál es el tipo de vivienda?",
        questionType: "text",
        orderIndex: 1,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      {
        questionnaireId,
        questionText: "Foto panorámica de la fachada de la vivienda",
        questionType: "photo",
        orderIndex: 2,
        isRequired: 1,
        requiresPhoto: 1,
        photoInstructions: "Tomar foto completa del frente de la vivienda desde la calle",
      },
      
      // Información del techo
      {
        questionnaireId,
        questionText: "¿Cuál es el tipo de techo?",
        questionType: "text",
        orderIndex: 3,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      {
        questionnaireId,
        questionText: "Foto del techo completo",
        questionType: "photo",
        orderIndex: 4,
        isRequired: 1,
        requiresPhoto: 1,
        photoInstructions: "Capturar foto del techo completo, mostrando su estructura y material",
      },
      {
        questionnaireId,
        questionText: "¿Cuál es el área aproximada del techo disponible para paneles? (en metros cuadrados)",
        questionType: "number",
        orderIndex: 5,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      {
        questionnaireId,
        questionText: "¿El techo tiene sombras durante el día?",
        questionType: "boolean",
        orderIndex: 6,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      {
        questionnaireId,
        questionText: "Si hay sombras, foto mostrando las zonas con sombra",
        questionType: "photo",
        orderIndex: 7,
        isRequired: 0,
        requiresPhoto: 1,
        photoInstructions: "Capturar foto de las áreas del techo que reciben sombra de árboles, edificios u otros obstáculos",
      },
      
      // Orientación e inclinación
      {
        questionnaireId,
        questionText: "¿Hacia qué punto cardinal está orientado el techo principal?",
        questionType: "text",
        orderIndex: 8,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      {
        questionnaireId,
        questionText: "¿Cuál es la inclinación aproximada del techo? (en grados)",
        questionType: "number",
        orderIndex: 9,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      
      // Sistema eléctrico
      {
        questionnaireId,
        questionText: "Foto del tablero eléctrico principal",
        questionType: "photo",
        orderIndex: 10,
        isRequired: 1,
        requiresPhoto: 1,
        photoInstructions: "Tomar foto clara del tablero eléctrico abierto, mostrando breakers y conexiones",
      },
      {
        questionnaireId,
        questionText: "¿Cuál es el tipo de acometida eléctrica?",
        questionType: "text",
        orderIndex: 11,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      {
        questionnaireId,
        questionText: "Foto del medidor de energía",
        questionType: "photo",
        orderIndex: 12,
        isRequired: 1,
        requiresPhoto: 1,
        photoInstructions: "Capturar foto del medidor de energía mostrando el número de serie y la lectura actual",
      },
      {
        questionnaireId,
        questionText: "¿Cuál es el consumo promedio mensual de energía? (en kWh)",
        questionType: "number",
        orderIndex: 13,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      {
        questionnaireId,
        questionText: "Foto de una factura de energía reciente",
        questionType: "photo",
        orderIndex: 14,
        isRequired: 1,
        requiresPhoto: 1,
        photoInstructions: "Fotografiar factura de energía mostrando el consumo en kWh y el valor a pagar",
      },
      
      // Espacio para equipos
      {
        questionnaireId,
        questionText: "¿Hay espacio disponible para instalar el inversor?",
        questionType: "boolean",
        orderIndex: 15,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      {
        questionnaireId,
        questionText: "Foto del espacio propuesto para el inversor",
        questionType: "photo",
        orderIndex: 16,
        isRequired: 1,
        requiresPhoto: 1,
        photoInstructions: "Capturar foto del área donde se instalará el inversor, preferiblemente cerca del tablero eléctrico",
      },
      {
        questionnaireId,
        questionText: "¿La distancia entre el techo y el tablero eléctrico es menor a 30 metros?",
        questionType: "boolean",
        orderIndex: 17,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      
      // Acceso y logística
      {
        questionnaireId,
        questionText: "¿Es fácil acceder al techo de forma segura?",
        questionType: "boolean",
        orderIndex: 18,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      {
        questionnaireId,
        questionText: "Foto del acceso al techo",
        questionType: "photo",
        orderIndex: 19,
        isRequired: 1,
        requiresPhoto: 1,
        photoInstructions: "Fotografiar escalera, acceso o punto de entrada al techo",
      },
      {
        questionnaireId,
        questionText: "¿Hay espacio para estacionar el vehículo de instalación cerca de la vivienda?",
        questionType: "boolean",
        orderIndex: 20,
        isRequired: 1,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      
      // Observaciones finales
      {
        questionnaireId,
        questionText: "Observaciones adicionales o comentarios especiales",
        questionType: "text",
        orderIndex: 21,
        isRequired: 0,
        requiresPhoto: 0,
        photoInstructions: null,
      },
      {
        questionnaireId,
        questionText: "Fotos adicionales relevantes para la instalación",
        questionType: "photo",
        orderIndex: 22,
        isRequired: 0,
        requiresPhoto: 1,
        photoInstructions: "Capturar cualquier detalle adicional que considere importante para la instalación",
      },
    ];

    // Insertar todas las preguntas
    for (const question of questionsData) {
      await db.insert(questions).values(question);
    }

    console.log(`✅ ${questionsData.length} preguntas creadas exitosamente`);
    console.log("\n🎉 Seed completado exitosamente!");
    console.log("\nPuedes usar este cuestionario para crear visitas técnicas de prueba.");
    
  } catch (error) {
    console.error("❌ Error al crear el seed:", error);
    throw error;
  }
}

// Ejecutar seed
seedQuestionnaire()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
