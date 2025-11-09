import mysql from "mysql2/promise";
import { randomBytes } from "crypto";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log("🌱 Iniciando seed de datos de prueba...");

// 1. Obtener el primer usuario admin
const [users] = await connection.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
if (users.length === 0) {
  console.error("❌ No se encontró ningún usuario admin. Por favor, inicia sesión primero.");
  process.exit(1);
}
const adminId = users[0].id;
console.log(`✅ Usuario admin encontrado: ID ${adminId}`);

// 2. Obtener o crear ingeniero
let engineerId;
const [engineers] = await connection.query("SELECT id FROM engineers WHERE userId = ? LIMIT 1", [adminId]);
if (engineers.length > 0) {
  engineerId = engineers[0].id;
  console.log(`✅ Ingeniero existente encontrado: ID ${engineerId}`);
} else {
  const [engineerResult] = await connection.query(
    "INSERT INTO engineers (userId, specialization, phone, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())",
    [adminId, "Energía Solar Fotovoltaica", "+57 321 456 7891", true]
  );
  engineerId = engineerResult.insertId;
  console.log(`✅ Ingeniero creado: ID ${engineerId}`);
}

// 3. Crear cuestionario
const [questionnaireResult] = await connection.query(
  "INSERT INTO questionnaires (title, description, isActive, createdById, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())",
  [
    "Visita Técnica Solar Residencial",
    "Cuestionario estándar para evaluación de instalación solar en viviendas",
    true,
    adminId
  ]
);
const questionnaireId = questionnaireResult.insertId;
console.log(`✅ Cuestionario creado: ID ${questionnaireId}`);

// 4. Crear preguntas (usa questionText, questionType, photoInstructions)
const questions = [
  { text: "¿Cuál es el tipo de vivienda?", type: "text", isRequired: true, requiresPhoto: false, photoInstructions: null, order: 1 },
  { text: "¿Cuántas personas habitan la vivienda?", type: "number", isRequired: true, requiresPhoto: false, photoInstructions: null, order: 2 },
  { text: "¿Tiene techo propio?", type: "boolean", isRequired: true, requiresPhoto: false, photoInstructions: null, order: 3 },
  { text: "Foto del techo desde el exterior", type: "photo", isRequired: true, requiresPhoto: true, photoInstructions: "Tome una foto clara del techo desde la calle", order: 4 },
  { text: "Foto del medidor de energía", type: "photo", isRequired: true, requiresPhoto: true, photoInstructions: "Fotografíe el medidor de energía eléctrica", order: 5 },
  { text: "¿Cuál es su consumo mensual promedio en kWh?", type: "number", isRequired: true, requiresPhoto: false, photoInstructions: null, order: 6 },
  { text: "¿Tiene alguna restricción de la copropiedad o vecindario?", type: "boolean", isRequired: false, requiresPhoto: false, photoInstructions: null, order: 7 },
  { text: "Observaciones adicionales", type: "text", isRequired: false, requiresPhoto: false, photoInstructions: null, order: 8 }
];

for (const q of questions) {
  await connection.query(
    "INSERT INTO questions (questionnaireId, questionText, questionType, isRequired, requiresPhoto, photoInstructions, orderIndex, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
    [questionnaireId, q.text, q.type, q.isRequired, q.requiresPhoto, q.photoInstructions, q.order]
  );
}
console.log(`✅ ${questions.length} preguntas creadas`);

// 5. Crear visita técnica con uniqueToken
const uniqueToken = randomBytes(16).toString("hex");
const [visitResult] = await connection.query(
  "INSERT INTO technicalVisits (uniqueToken, questionnaireId, engineerId, clientName, clientEmail, clientPhone, address, openSolarProjectId, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
  [
    uniqueToken,
    questionnaireId,
    engineerId,
    "Luis Narvaez",
    "lenarvaez52@gmail.com",
    "+573214567644",
    "Cra 1 este No 2-26 casa 6",
    "12345",
    "pending"
  ]
);
const visitId = visitResult.insertId;
console.log(`✅ Visita técnica creada: ID ${visitId}`);
console.log(`🔗 Link de visita: /visit/${uniqueToken}`);

await connection.end();
console.log("🎉 Seed completado exitosamente!");
