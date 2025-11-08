import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Cuestionarios configurables para visitas técnicas
 */
export const questionnaires = mysqlTable("questionnaires", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isActive: int("isActive").default(1).notNull(),
  createdById: int("createdById").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Questionnaire = typeof questionnaires.$inferSelect;
export type InsertQuestionnaire = typeof questionnaires.$inferInsert;

/**
 * Preguntas dentro de cada cuestionario
 */
export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  questionnaireId: int("questionnaireId").notNull(),
  questionText: text("questionText").notNull(),
  questionType: mysqlEnum("questionType", ["text", "number", "boolean", "photo"]).notNull(),
  isRequired: int("isRequired").default(0).notNull(),
  requiresPhoto: int("requiresPhoto").default(0).notNull(),
  photoInstructions: text("photoInstructions"),
  orderIndex: int("orderIndex").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

/**
 * Ingenieros responsables de las visitas
 */
export const engineers = mysqlTable("engineers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  specialization: varchar("specialization", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Engineer = typeof engineers.$inferSelect;
export type InsertEngineer = typeof engineers.$inferInsert;

/**
 * Visitas técnicas virtuales realizadas
 */
export const technicalVisits = mysqlTable("technicalVisits", {
  id: int("id").autoincrement().primaryKey(),
  uniqueToken: varchar("uniqueToken", { length: 64 }).notNull().unique(),
  questionnaireId: int("questionnaireId").notNull(),
  engineerId: int("engineerId"),
  clientName: varchar("clientName", { length: 255 }),
  clientEmail: varchar("clientEmail", { length: 320 }),
  clientPhone: varchar("clientPhone", { length: 50 }),
  address: text("address"),
  openSolarProjectId: varchar("openSolarProjectId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TechnicalVisit = typeof technicalVisits.$inferSelect;
export type InsertTechnicalVisit = typeof technicalVisits.$inferInsert;

/**
 * Respuestas del cliente durante la visita
 */
export const answers = mysqlTable("answers", {
  id: int("id").autoincrement().primaryKey(),
  visitId: int("visitId").notNull(),
  questionId: int("questionId").notNull(),
  answerText: text("answerText"),
  answerNumber: int("answerNumber"),
  answerBoolean: int("answerBoolean"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Answer = typeof answers.$inferSelect;
export type InsertAnswer = typeof answers.$inferInsert;

/**
 * Fotos capturadas durante la visita técnica
 */
export const photos = mysqlTable("photos", {
  id: int("id").autoincrement().primaryKey(),
  visitId: int("visitId").notNull(),
  questionId: int("questionId"),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 1024 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"),
  caption: text("caption"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = typeof photos.$inferInsert;

/**
 * Informes PDF generados de las visitas
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  visitId: int("visitId").notNull().unique(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 1024 }).notNull(),
  sentToClient: int("sentToClient").default(0).notNull(),
  sentToEngineer: int("sentToEngineer").default(0).notNull(),
  uploadedToOpenSolar: int("uploadedToOpenSolar").default(0).notNull(),
  viabilityScore: int("viabilityScore"),
  viabilityNotes: text("viabilityNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;