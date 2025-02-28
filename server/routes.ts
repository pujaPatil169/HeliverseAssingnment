import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { insertListingSchema, insertBookingSchema, insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Middleware to check if user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      console.log('Unauthorized access attempt');
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Middleware to check user role
  const requireRole = (roles: string[]) => (req: any, res: any, next: any) => {
    console.log('Role check:', {
      userRole: req.user?.role,
      requiredRoles: roles,
      user: req.user,
    });

    if (!roles.includes(req.user?.role)) {
      console.log('Forbidden access attempt: incorrect role');
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

  // Listing routes
  app.post("/api/listings", requireAuth, requireRole(["vendor"]), async (req, res) => {
    try {
      const listing = await storage.createListing({
        ...req.body,
        vendorId: req.user!.id,
      });
      res.status(201).json(listing);
    } catch (error) {
      console.error('Error creating listing:', error);
      res.status(500).json({ message: "Failed to create listing" });
    }
  });

  app.get("/api/listings", async (req, res) => {
    try {
      const filters: any = {};

      if (req.query.type) {
        filters.type = req.query.type as "hotel" | "restaurant";
      }
      if (req.query.city) {
        filters.city = req.query.city as string;
      }
      if (req.isAuthenticated() && req.user?.role === "vendor") {
        filters.vendorId = req.user.id;
      } else {
        filters.isApproved = true;
      }

      const listings = await storage.getListings(filters);
      res.json(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  app.get("/api/listings/:id", async (req, res) => {
    try {
      const listing = await storage.getListing(parseInt(req.params.id));
      if (!listing) return res.status(404).json({ message: "Listing not found" });
      res.json(listing);
    } catch (error) {
      console.error('Error fetching listing:', error);
      res.status(500).json({ message: "Failed to fetch listing" });
    }
  });

  // Admin listing approval
  app.patch("/api/listings/:id/approve", requireAuth, requireRole(["admin"]), async (req, res) => {
    try {
      const listing = await storage.updateListing(parseInt(req.params.id), {
        isApproved: true,
      });
      res.json(listing);
    } catch (error) {
      console.error('Error approving listing:', error);
      res.status(500).json({ message: "Failed to approve listing" });
    }
  });

  // Booking routes
  app.post("/api/bookings", requireAuth, requireRole(["customer"]), async (req, res) => {
    try {
      console.log('Creating booking:', {
        userId: req.user?.id,
        userRole: req.user?.role,
        bookingData: req.body,
      });

      // Log the entire request for debugging
      console.log('Request headers:', req.headers);
      console.log('Request body (raw):', req.body);
      console.log('Request body types:', {
        listingId: typeof req.body.listingId,
        unitId: typeof req.body.unitId,
        startDate: typeof req.body.startDate,
        endDate: typeof req.body.endDate,
        totalPrice: typeof req.body.totalPrice
      });

      // Validate booking data
      if (!req.body.listingId) {
        return res.status(400).json({ message: "Listing ID is required" });
      }

      if (!req.body.unitId) {
        return res.status(400).json({ message: "Unit ID is required" });
      }

      if (!req.body.startDate || !req.body.endDate) {
        return res.status(400).json({ message: "Start and end dates are required" });
      }

      const booking = await storage.createBooking({
        ...req.body,
        customerId: req.user!.id,
        status: "pending",
        paymentStatus: "pending",
      });

      console.log('Booking created:', booking);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings", requireAuth, requireRole(["customer", "vendor"]), async (req, res) => {
    try {
      const filters = {
        customerId: req.user!.role === "customer" ? req.user!.id : undefined,
        listingId: req.query.listingId ? parseInt(req.query.listingId as string) : undefined,
      };
      const bookings = await storage.getBookings(filters);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Review routes
  app.post("/api/reviews", requireAuth, requireRole(["customer"]), async (req, res) => {
    try {
      const review = await storage.createReview({
        ...req.body,
        customerId: req.user!.id,
      });
      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get("/api/reviews/:listingId", async (req, res) => {
    try {
      const reviews = await storage.getReviews(parseInt(req.params.listingId));
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}