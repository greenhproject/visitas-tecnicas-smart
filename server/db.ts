import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  questionnaires,
  InsertQuestionnaire,
  questions,
  InsertQuestion,
  engineers,
  InsertEngineer,
  technicalVisits,
  InsertTechnicalVisit,
  answers,
  InsertAnswer,
  photos,
  InsertPhoto,
  reports,
  InsertReport,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Questionnaires
export async function createQuestionnaire(data: InsertQuestionnaire) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(questionnaires).values(data);
  return result;
}

export async function getQuestionnaires() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(questionnaires).orderBy(questionnaires.createdAt);
}

export async function getQuestionnaireById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(questionnaires).where(eq(questionnaires.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateQuestionnaire(id: number, data: Partial<InsertQuestionnaire>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(questionnaires).set(data).where(eq(questionnaires.id, id));
}

export async function deleteQuestionnaire(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(questionnaires).where(eq(questionnaires.id, id));
}

// Questions
export async function createQuestion(data: InsertQuestion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(questions).values(data);
}

export async function getQuestionsByQuestionnaireId(questionnaireId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(questions)
    .where(eq(questions.questionnaireId, questionnaireId))
    .orderBy(questions.orderIndex);
}

export async function updateQuestion(id: number, data: Partial<InsertQuestion>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(questions).set(data).where(eq(questions.id, id));
}

export async function deleteQuestion(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(questions).where(eq(questions.id, id));
}

// Engineers
export async function createEngineer(data: InsertEngineer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(engineers).values(data);
}

export async function getEngineers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(engineers).where(eq(engineers.isActive, 1));
}

export async function getEngineerByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(engineers).where(eq(engineers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Technical Visits
export async function createTechnicalVisit(data: InsertTechnicalVisit) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(technicalVisits).values(data);
}

export async function getTechnicalVisitByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(technicalVisits).where(eq(technicalVisits.uniqueToken, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTechnicalVisits() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(technicalVisits).orderBy(technicalVisits.createdAt);
}

export async function updateTechnicalVisit(id: number, data: Partial<InsertTechnicalVisit>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(technicalVisits).set(data).where(eq(technicalVisits.id, id));
}

// Answers
export async function createAnswer(data: InsertAnswer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(answers).values(data);
}

export async function getAnswersByVisitId(visitId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(answers).where(eq(answers.visitId, visitId));
}

// Photos
export async function createPhoto(data: InsertPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(photos).values(data);
}

export async function getPhotosByVisitId(visitId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(photos).where(eq(photos.visitId, visitId));
}

// Reports
export async function createReport(data: InsertReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(reports).values(data);
}

export async function getReportByVisitId(visitId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reports).where(eq(reports.visitId, visitId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateReport(id: number, data: Partial<InsertReport>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(reports).set(data).where(eq(reports.id, id));
}
