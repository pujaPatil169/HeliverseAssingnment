import { IStorage } from "./types";
import { db, pool } from "./db";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { eq } from "drizzle-orm";
import { users, listings, bookings, reviews } from "@shared/schema";
import crypto from 'crypto'; // Added import for crypto.randomUUID

const PostgresStore = connectPgSimple(session);

export class PostgresStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    console.log('Initializing PostgreSQL session store...');
    try {
      this.sessionStore = new PostgresStore({
        pool,
        tableName: 'session',
        createTableIfMissing: true,
      });
      console.log('PostgreSQL session store initialized successfully');
    } catch (error) {
      console.error('Failed to initialize PostgreSQL session store:', error);
      throw error;
    }
  }

  // User methods
  async getUser(id: number): Promise<any> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<any> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw error;
    }
  }

  async createUser(insertUser: any): Promise<any> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Listing methods
  async createListing(insertListing: any): Promise<any> {
    try {
      const [listing] = await db.insert(listings).values(insertListing).returning();
      return listing;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  }

  async getListing(id: number): Promise<any> {
    try {
      const [listing] = await db.select().from(listings).where(eq(listings.id, id));
      return listing;
    } catch (error) {
      console.error('Error getting listing:', error);
      throw error;
    }
  }

  async getListings(filters?: {
    type?: "hotel" | "restaurant";
    city?: string;
    approved?: boolean;
    vendorId?: number;
  }): Promise<any[]> {
    try {
      let query = db.select().from(listings);

      if (filters) {
        if (filters.type) query = query.where(eq(listings.type, filters.type));
        if (filters.city) query = query.where(eq(listings.city, filters.city));
        if (filters.approved !== undefined) query = query.where(eq(listings.isApproved, filters.approved));
        if (filters.vendorId) query = query.where(eq(listings.vendorId, filters.vendorId));
      }

      return await query;
    } catch (error) {
      console.error('Error getting listings:', error);
      throw error;
    }
  }

  async updateListing(id: number, update: any): Promise<any> {
    try {
      const [listing] = await db
        .update(listings)
        .set(update)
        .where(eq(listings.id, id))
        .returning();
      return listing;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  }

  // Booking methods
  async createBooking(insertBooking: any): Promise<any> {
    try {
      const [booking] = await db.insert(bookings).values(insertBooking).returning();
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBooking(id: number): Promise<any> {
    try {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
      return booking;
    } catch (error) {
      console.error('Error getting booking:', error);
      throw error;
    }
  }

  async getBookings(filters: {
    customerId?: number;
    listingId?: number;
  }): Promise<any[]> {
    try {
      let query = db.select().from(bookings);

      if (filters.customerId) query = query.where(eq(bookings.customerId, filters.customerId));
      if (filters.listingId) query = query.where(eq(bookings.listingId, filters.listingId));

      return await query;
    } catch (error) {
      console.error('Error getting bookings:', error);
      throw error;
    }
  }

  async updateBooking(id: number, update: any): Promise<any> {
    try {
      const [booking] = await db
        .update(bookings)
        .set(update)
        .where(eq(bookings.id, id))
        .returning();
      return booking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  // Review methods
  async createReview(insertReview: any): Promise<any> {
    try {
      const [review] = await db.insert(reviews).values(insertReview).returning();
      return review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async getReviews(listingId: number): Promise<any[]> {
    try {
      return await db
        .select()
        .from(reviews)
        .where(eq(reviews.listingId, listingId));
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw error;
    }
  }
}

export const storage = new PostgresStorage();