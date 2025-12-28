import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import expressSession from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import nodemailer from "nodemailer";

// Session configuration
const PgSession = ConnectPgSimple(expressSession);
const sessionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Email transporter configuration
let transporter: nodemailer.Transporter | null = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session middleware
  app.use(
    expressSession({
      store: new PgSession({
        pool: sessionPool,
        tableName: "session",
      }),
      secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );

  // Extend Express Session type
  declare module "express-session" {
    interface SessionData {
      userId: string;
    }
  }

  // ==================== AUTHENTICATION ROUTES ====================

  // Register admin (only if no admin exists)
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
      });

      res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create session
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to create session" });
        }
        res.json({ message: "Login successful", userId: user.id });
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Check auth status
  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ userId: user.id, email: user.email });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== PROFILE ROUTES ====================

  // Get profile (public)
  app.get("/api/profile", async (req: Request, res: Response) => {
    try {
      const profileData = await storage.getProfile();
      if (!profileData) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profileData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update profile (protected)
  app.put("/api/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const { name, title, bio, email, github, linkedin } = req.body;
      const profileData = await storage.updateProfile({
        name,
        title,
        bio,
        email,
        github,
        linkedin,
      });
      res.json(profileData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== PROJECT ROUTES ====================

  // Get all projects (public)
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      // Parse tech array from JSON string
      const formattedProjects = projects.map((p) => ({
        ...p,
        tech: typeof p.tech === "string" ? JSON.parse(p.tech) : p.tech,
      }));
      res.json(formattedProjects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create project (protected)
  app.post("/api/projects", requireAuth, async (req: Request, res: Response) => {
    try {
      const { title, description, image, link, tech } = req.body;
      const project = await storage.createProject({
        title,
        description,
        image,
        link: link || "#",
        tech: typeof tech === "string" ? tech : JSON.stringify(tech),
      });
      res.status(201).json({
        ...project,
        tech: typeof project.tech === "string" ? JSON.parse(project.tech) : project.tech,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update project (protected)
  app.put("/api/projects/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, image, link, tech } = req.body;
      const updateData: any = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (image) updateData.image = image;
      if (link) updateData.link = link;
      if (tech) updateData.tech = typeof tech === "string" ? tech : JSON.stringify(tech);

      const project = await storage.updateProject(id, updateData);
      res.json({
        ...project,
        tech: typeof project.tech === "string" ? JSON.parse(project.tech) : project.tech,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete project (protected)
  app.delete("/api/projects/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== SKILL ROUTES ====================

  // Get all skills (public)
  app.get("/api/skills", async (req: Request, res: Response) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create skill (protected)
  app.post("/api/skills", requireAuth, async (req: Request, res: Response) => {
    try {
      const { name, category } = req.body;
      const skill = await storage.createSkill({ name, category });
      res.status(201).json(skill);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete skill (protected)
  app.delete("/api/skills/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteSkill(id);
      res.json({ message: "Skill deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== EXPERIENCE ROUTES ====================

  // Get all experience (public)
  app.get("/api/experience", async (req: Request, res: Response) => {
    try {
      const experience = await storage.getExperience();
      res.json(experience);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create experience (protected)
  app.post("/api/experience", requireAuth, async (req: Request, res: Response) => {
    try {
      const { role, company, period, description } = req.body;
      const exp = await storage.createExperience({ role, company, period, description });
      res.status(201).json(exp);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update experience (protected)
  app.put("/api/experience/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { role, company, period, description } = req.body;
      const updateData: any = {};
      if (role) updateData.role = role;
      if (company) updateData.company = company;
      if (period) updateData.period = period;
      if (description) updateData.description = description;

      const exp = await storage.updateExperience(id, updateData);
      res.json(exp);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete experience (protected)
  app.delete("/api/experience/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteExperience(id);
      res.json({ message: "Experience deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ==================== CONTACT ROUTE ====================

  // Send contact email
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ message: "Name, email, and message are required" });
      }

      if (!transporter) {
        return res.status(500).json({ message: "Email service not configured" });
      }

      // Get profile to send email to portfolio owner
      const profileData = await storage.getProfile();
      const recipientEmail = profileData?.email || process.env.CONTACT_EMAIL || "admin@example.com";

      // Send email
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: recipientEmail,
        subject: `Portfolio Contact: ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
        replyTo: email,
      });

      res.json({ message: "Message sent successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
