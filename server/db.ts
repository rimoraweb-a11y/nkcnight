import { eq, and, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, menuItems, reservations, reviews, operatingHours, InsertMenuItem, InsertReservation, InsertReview, InsertOperatingHour } from "../drizzle/schema";
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

// ===== MENU QUERIES =====
export async function getMenuItems(category?: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    const query = category
      ? db.select().from(menuItems).where(and(eq(menuItems.category, category), eq(menuItems.isAvailable, 1)))
      : db.select().from(menuItems).where(eq(menuItems.isAvailable, 1));
    return await query;
  } catch (error) {
    console.error("[Database] Failed to get menu items:", error);
    return [];
  }
}

export async function createMenuItem(item: InsertMenuItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(menuItems).values(item);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create menu item:", error);
    throw error;
  }
}

export async function updateMenuItem(id: number, item: Partial<InsertMenuItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(menuItems).set(item).where(eq(menuItems.id, id));
  } catch (error) {
    console.error("[Database] Failed to update menu item:", error);
    throw error;
  }
}

// ===== RESERVATION QUERIES =====
export async function getReservations(status?: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    const query = status
      ? db.select().from(reservations).where(eq(reservations.status, status as any))
      : db.select().from(reservations);
    return await query.orderBy(desc(reservations.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get reservations:", error);
    return [];
  }
}

export async function createReservation(reservation: InsertReservation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(reservations).values(reservation);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create reservation:", error);
    throw error;
  }
}

export async function updateReservationStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(reservations).set({ status: status as any }).where(eq(reservations.id, id));
  } catch (error) {
    console.error("[Database] Failed to update reservation:", error);
    throw error;
  }
}

// ===== REVIEW QUERIES =====
export async function getApprovedReviews() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(reviews).where(eq(reviews.isApproved, 1)).orderBy(desc(reviews.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get reviews:", error);
    return [];
  }
}

export async function getPendingReviews() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(reviews).where(eq(reviews.isApproved, 0)).orderBy(desc(reviews.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get pending reviews:", error);
    return [];
  }
}

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(reviews).values(review);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create review:", error);
    throw error;
  }
}

export async function approveReview(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(reviews).set({ isApproved: 1 }).where(eq(reviews.id, id));
  } catch (error) {
    console.error("[Database] Failed to approve review:", error);
    throw error;
  }
}

// ===== OPERATING HOURS QUERIES =====
export async function getOperatingHours() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(operatingHours).orderBy(operatingHours.dayOfWeek);
  } catch (error) {
    console.error("[Database] Failed to get operating hours:", error);
    return [];
  }
}

export async function updateOperatingHours(dayOfWeek: number, openTime: string, closeTime: string, isClosed: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const existing = await db.select().from(operatingHours).where(eq(operatingHours.dayOfWeek, dayOfWeek));
    if (existing.length > 0) {
      await db.update(operatingHours).set({ openTime, closeTime, isClosed }).where(eq(operatingHours.dayOfWeek, dayOfWeek));
    } else {
      await db.insert(operatingHours).values({ dayOfWeek, openTime, closeTime, isClosed });
    }
  } catch (error) {
    console.error("[Database] Failed to update operating hours:", error);
    throw error;
  }
}
