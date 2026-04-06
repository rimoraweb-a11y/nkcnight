import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
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

  // Menu Router
  menu: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getMenuItems(input?.category);
      }),
    create: protectedProcedure
      .input(z.object({
        nameEn: z.string(),
        nameFr: z.string(),
        nameAr: z.string(),
        descriptionFr: z.string().optional(),
        descriptionAr: z.string().optional(),
        price: z.number(),
        category: z.string(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return await db.createMenuItem(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        nameEn: z.string().optional(),
        nameFr: z.string().optional(),
        nameAr: z.string().optional(),
        descriptionFr: z.string().optional(),
        descriptionAr: z.string().optional(),
        price: z.number().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        isAvailable: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const { id, ...data } = input;
        await db.updateMenuItem(id, data);
      }),
  }),

  // Reservations Router
  reservations: router({
    list: protectedProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return await db.getReservations(input?.status);
      }),
    create: publicProcedure
      .input(z.object({
        guestName: z.string(),
        guestEmail: z.string().email().optional(),
        guestPhone: z.string().optional(),
        numberOfPeople: z.number(),
        reservationDate: z.date(),
        reservationTime: z.string(),
        specialRequests: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createReservation({
          ...input,
          status: 'pending',
        });
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'confirmed', 'cancelled']),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        await db.updateReservationStatus(input.id, input.status);
      }),
  }),

  // Reviews Router
  reviews: router({
    list: publicProcedure.query(async () => {
      return await db.getApprovedReviews();
    }),
    pending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
      return await db.getPendingReviews();
    }),
    create: publicProcedure
      .input(z.object({
        authorName: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createReview({
          ...input,
          isApproved: 0,
        });
      }),
    approve: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        await db.approveReview(input.id);
      }),
  }),

  // Operating Hours Router
  hours: router({
    list: publicProcedure.query(async () => {
      return await db.getOperatingHours();
    }),
    update: protectedProcedure
      .input(z.object({
        dayOfWeek: z.number(),
        openTime: z.string(),
        closeTime: z.string(),
        isClosed: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        await db.updateOperatingHours(input.dayOfWeek, input.openTime, input.closeTime, input.isClosed);
      }),
  }),
});

export type AppRouter = typeof appRouter;
