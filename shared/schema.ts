import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["customer", "vendor", "admin"] }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  type: text("type", { enum: ["hotel", "restaurant"] }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  price: decimal("price").notNull(),
  imageUrl: text("image_url").notNull(),
  isApproved: boolean("is_approved").default(false),
  // Added new fields
  facilities: jsonb("facilities").notNull(),
  amenities: text("amenities").array(),
  rating: decimal("rating"),
  units: jsonb("units").notNull(), // Room types for hotels, table types for restaurants
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  listingId: integer("listing_id").notNull(),
  unitId: text("unit_id").notNull(), // Specific room/table being booked
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "cancelled"] }).notNull(),
  totalPrice: decimal("total_price").notNull(),
  paymentStatus: text("payment_status", { enum: ["pending", "paid", "refunded"] }).notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  customerId: integer("customer_id").notNull(),
  listingId: integer("listing_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
const facilitiesSchema = z.object({
  parking: z.boolean().optional(),
  wifi: z.boolean().optional(),
  pool: z.boolean().optional(),
  restaurant: z.boolean().optional(),
  gym: z.boolean().optional(),
  spa: z.boolean().optional(),
  roomService: z.boolean().optional(),
  bar: z.boolean().optional(),
});

const unitSchema = z.object({
  id: z.string().min(1, "Unit ID cannot be empty"),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  capacity: z.coerce.number(),
  price: z.coerce.number(),
  available: z.boolean(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  name: true,
  email: true,
  phone: true,
});

export const insertListingSchema = createInsertSchema(listings)
  .omit({
    id: true,
    isApproved: true,
    vendorId: true,
    rating: true,
  })
  .extend({
    facilities: facilitiesSchema,
    units: z.array(unitSchema),
    amenities: z.array(z.string()),
  });

export const insertBookingSchema = createInsertSchema(bookings)
  .omit({
    id: true,
    customerId: true,
  })
  .extend({
    paymentStatus: z.literal("pending"),
  });

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  customerId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;