import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Questionnaires management
  questionnaires: router({
    list: protectedProcedure.query(async () => {
      const { getQuestionnaires } = await import("./db");
      return await getQuestionnaires();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const { getQuestionnaireById } = await import("./db");
      return await getQuestionnaireById(input.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { createQuestionnaire } = await import("./db");
        return await createQuestionnaire({
          ...input,
          createdById: ctx.user.id,
        });
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          description: z.string().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const { updateQuestionnaire } = await import("./db");
        return await updateQuestionnaire(id, data);
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const { deleteQuestionnaire } = await import("./db");
      return await deleteQuestionnaire(input.id);
    }),
  }),

  // Questions management
  questions: router({
    listByQuestionnaire: protectedProcedure
      .input(z.object({ questionnaireId: z.number() }))
      .query(async ({ input }) => {
        const { getQuestionsByQuestionnaireId } = await import("./db");
        return await getQuestionsByQuestionnaireId(input.questionnaireId);
      }),
    create: protectedProcedure
      .input(
        z.object({
          questionnaireId: z.number(),
          questionText: z.string().min(1),
          questionType: z.enum(["text", "number", "boolean", "photo"]),
          isRequired: z.number().default(0),
          requiresPhoto: z.number().default(0),
          photoInstructions: z.string().optional(),
          orderIndex: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const { createQuestion } = await import("./db");
        return await createQuestion(input);
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          questionText: z.string().optional(),
          questionType: z.enum(["text", "number", "boolean", "photo"]).optional(),
          isRequired: z.number().optional(),
          requiresPhoto: z.number().optional(),
          photoInstructions: z.string().optional(),
          orderIndex: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const { updateQuestion } = await import("./db");
        return await updateQuestion(id, data);
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const { deleteQuestion } = await import("./db");
      return await deleteQuestion(input.id);
    }),
  }),

  // Engineers management
  engineers: router({
    list: protectedProcedure.query(async () => {
      const { getEngineers } = await import("./db");
      return await getEngineers();
    }),
    create: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          specialization: z.string().optional(),
          phone: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createEngineer } = await import("./db");
        return await createEngineer(input);
      }),
  }),

  // Answers
  answers: router({
    create: publicProcedure
      .input(
        z.object({
          visitId: z.number(),
          questionId: z.number(),
          answerText: z.string().optional(),
          answerNumber: z.number().optional(),
          answerBoolean: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createAnswer } = await import("./db");
        return await createAnswer(input);
      }),
    getByVisit: publicProcedure
      .input(z.object({ visitId: z.number() }))
      .query(async ({ input }) => {
        const { getAnswersByVisitId } = await import("./db");
        return await getAnswersByVisitId(input.visitId);
      }),
  }),

  // Technical Visits
  visits: router({
    list: protectedProcedure.query(async () => {
      const { getTechnicalVisits } = await import("./db");
      return await getTechnicalVisits();
    }),
    getByToken: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
      const { getTechnicalVisitByToken } = await import("./db");
      return await getTechnicalVisitByToken(input.token);
    }),
    create: protectedProcedure
      .input(
        z.object({
          questionnaireId: z.number(),
          engineerId: z.number().optional(),
          clientName: z.string().optional(),
          clientEmail: z.string().optional(),
          clientPhone: z.string().optional(),
          address: z.string().optional(),
          openSolarProjectId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createTechnicalVisit, getTechnicalVisits } = await import("./db");
        const crypto = await import("crypto");
        const uniqueToken = crypto.randomBytes(32).toString("hex");
        await createTechnicalVisit({
          ...input,
          uniqueToken,
        });
        // Devolver el token generado
        return { uniqueToken };
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
          startedAt: z.date().optional(),
          completedAt: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const { updateTechnicalVisit } = await import("./db");
        return await updateTechnicalVisit(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { getDb } = await import("./db");
        const { technicalVisits } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.delete(technicalVisits).where(eq(technicalVisits.id, input.id));
        return { success: true };
      }),
  }),

  // Reports
  reports: router({
    list: protectedProcedure.query(async () => {
      const { getDb } = await import("./db");
      const { reports, technicalVisits, questionnaires } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      const db = await getDb();
      if (!db) return [];

      const allReports = await db
        .select({
          id: reports.id,
          visitId: reports.visitId,
          reportUrl: reports.fileUrl,
          createdAt: reports.createdAt,
          clientName: technicalVisits.clientName,
          visitStatus: technicalVisits.status,
          questionnaireId: technicalVisits.questionnaireId,
        })
        .from(reports)
        .leftJoin(technicalVisits, eq(reports.visitId, technicalVisits.id))
        .orderBy(reports.createdAt);

      // Obtener nombres de cuestionarios
      const reportsWithQuestionnaire = await Promise.all(
        allReports.map(async (report) => {
          if (!report.questionnaireId) {
            return { ...report, questionnaireName: null };
          }
          const questionnaire = await db
            .select({ title: questionnaires.title })
            .from(questionnaires)
            .where(eq(questionnaires.id, report.questionnaireId))
            .limit(1);
          return {
            ...report,
            questionnaireName: questionnaire[0]?.title || null,
          };
        })
      );

      return reportsWithQuestionnaire;
    }),
    generate: protectedProcedure
      .input(z.object({ visitId: z.number() }))
      .mutation(async ({ input }) => {
        const { generateVisitReport } = await import("./pdfGenerator");
        const result = await generateVisitReport(input.visitId);
        return result;
      }),
    getByVisit: protectedProcedure
      .input(z.object({ visitId: z.number() }))
      .query(async ({ input }) => {
        const { getReportByVisitId } = await import("./db");
        return await getReportByVisitId(input.visitId);
      }),
    sendReport: protectedProcedure
      .input(z.object({ visitId: z.number() }))
      .mutation(async ({ input }) => {
        const { getDb } = await import("./db");
        const { sendReportToClient, sendReportToEngineer } = await import("./emailService");
        const { uploadDocumentToOpenSolar } = await import("./openSolarService");
        const { technicalVisits, reports, users, engineers } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Obtener visita
        const visitData = await db.select().from(technicalVisits).where(eq(technicalVisits.id, input.visitId)).limit(1);
        if (visitData.length === 0) throw new Error("Visita no encontrada");
        const visit = visitData[0];

        // Obtener reporte
        const reportData = await db.select().from(reports).where(eq(reports.visitId, input.visitId)).limit(1);
        if (reportData.length === 0) throw new Error("Reporte no encontrado");
        const report = reportData[0];

        // Enviar al cliente
        if (visit.clientEmail && report.sentToClient === 0) {
          await sendReportToClient(visit.clientEmail, visit.clientName || "Cliente", report.fileUrl);
          await db.update(reports).set({ sentToClient: 1 }).where(eq(reports.id, report.id));
        }

        // Enviar al ingeniero
        if (visit.engineerId && report.sentToEngineer === 0) {
          const engineerData = await db.select().from(engineers).where(eq(engineers.id, visit.engineerId)).limit(1);
          if (engineerData.length > 0) {
            const engineer = engineerData[0];
            const userData = await db.select().from(users).where(eq(users.id, engineer.userId)).limit(1);
            if (userData.length > 0 && userData[0].email) {
              await sendReportToEngineer(
                userData[0].email,
                userData[0].name || "Ingeniero",
                visit.clientName || "Cliente",
                report.fileUrl
              );
              await db.update(reports).set({ sentToEngineer: 1 }).where(eq(reports.id, report.id));
            }
          }
        }

        // Subir a OpenSolar
        if (visit.openSolarProjectId && report.uploadedToOpenSolar === 0) {
          try {
            await uploadDocumentToOpenSolar(
              visit.openSolarProjectId,
              report.fileUrl,
              `Informe_Visita_Tecnica_${input.visitId}.pdf`
            );
            await db.update(reports).set({ uploadedToOpenSolar: 1 }).where(eq(reports.id, report.id));
          } catch (error) {
            console.error("Error al subir a OpenSolar:", error);
            // No lanzar error para que el envío de emails se complete
          }
        }

        return { success: true };
      }),
  }),

  // HeyGen Integration
  heygen: router({
    getAccessToken: publicProcedure.query(async () => {
      const { getHeyGenAccessToken } = await import("./heygen");
      const token = await getHeyGenAccessToken();
      return { token };
    }),
    createSession: publicProcedure
      .input(
        z.object({
          quality: z.enum(["high", "medium", "low"]),
          avatarId: z.string(),
          voiceId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { createHeyGenSession } = await import("./heygen");
        return await createHeyGenSession(input);
      }),
    startSession: publicProcedure
      .input(
        z.object({
          sessionId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { startHeyGenSession } = await import("./heygen");
        return await startHeyGenSession(input.sessionId);
      }),
    listAvatars: protectedProcedure.query(async () => {
      const { listHeyGenAvatars } = await import("./heygen");
      const avatars = await listHeyGenAvatars();
      return avatars;
    }),
    listVoices: protectedProcedure.query(async () => {
      const { listHeyGenVoices } = await import("./heygen");
      const voices = await listHeyGenVoices();
      return voices;
    }),
    speak: publicProcedure
      .input(
        z.object({
          sessionId: z.string(),
          text: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { speakHeyGen } = await import("./heygen");
        return await speakHeyGen(input.sessionId, input.text);
      }),
  }),
});

export type AppRouter = typeof appRouter;
