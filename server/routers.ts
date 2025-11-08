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
  }),
});

export type AppRouter = typeof appRouter;
