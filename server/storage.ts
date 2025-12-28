import { PrismaClient } from "@prisma/client";
import { z } from "zod";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const prisma = new PrismaClient();

export const db = prisma;

// Zod schemas for validation (matching Prisma schema)
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.string().optional(),
});

export const insertProfileSchema = z.object({
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  email: z.string().email(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

export const insertProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  link: z.string().optional(),
  tech: z.string(),
});

export const insertSkillSchema = z.object({
  name: z.string(),
  category: z.string(),
});

export const insertExperienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  period: z.string(),
  description: z.string(),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = Awaited<ReturnType<typeof prisma.user.findUnique>>;
export type Profile = Awaited<ReturnType<typeof prisma.profile.findUnique>>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Project = Awaited<ReturnType<typeof prisma.project.findUnique>>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Skill = Awaited<ReturnType<typeof prisma.skill.findUnique>>;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Experience = Awaited<ReturnType<typeof prisma.experience.findUnique>>;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export interface IStorage {
  // User/Auth methods
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;

  // Profile methods
  getProfile(): Promise<Profile | null>;
  updateProfile(profileData: InsertProfile): Promise<Profile>;
  createProfile(profileData: InsertProfile): Promise<Profile>;

  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Skill methods
  getSkills(): Promise<Skill[]>;
  getSkill(id: string): Promise<Skill | null>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  deleteSkill(id: string): Promise<void>;

  // Experience methods
  getExperience(): Promise<Experience[]>;
  getExperienceById(id: string): Promise<Experience | null>;
  createExperience(exp: InsertExperience): Promise<Experience>;
  updateExperience(id: string, exp: Partial<InsertExperience>): Promise<Experience>;
  deleteExperience(id: string): Promise<void>;
}

export class PostgresStorage implements IStorage {
  // User/Auth methods
  async getUser(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  async createUser(user: InsertUser): Promise<User> {
    return await prisma.user.create({ data: user });
  }

  // Profile methods
  async getProfile(): Promise<Profile | null> {
    return await prisma.profile.findFirst();
  }

  async createProfile(profileData: InsertProfile): Promise<Profile> {
    return await prisma.profile.create({ data: profileData });
  }

  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    const existing = await this.getProfile();
    if (!existing) {
      return await this.createProfile(profileData);
    }
    return await prisma.profile.update({
      where: { id: existing.id },
      data: profileData,
    });
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return await prisma.project.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  async getProject(id: string): Promise<Project | null> {
    return await prisma.project.findUnique({ where: { id } });
  }

  async createProject(project: InsertProject): Promise<Project> {
    return await prisma.project.create({ data: project });
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    return await prisma.project.update({
      where: { id },
      data: project,
    });
  }

  async deleteProject(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } });
  }

  // Skill methods
  async getSkills(): Promise<Skill[]> {
    return await prisma.skill.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  async getSkill(id: string): Promise<Skill | null> {
    return await prisma.skill.findUnique({ where: { id } });
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    return await prisma.skill.create({ data: skill });
  }

  async deleteSkill(id: string): Promise<void> {
    await prisma.skill.delete({ where: { id } });
  }

  // Experience methods
  async getExperience(): Promise<Experience[]> {
    return await prisma.experience.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  async getExperienceById(id: string): Promise<Experience | null> {
    return await prisma.experience.findUnique({ where: { id } });
  }

  async createExperience(exp: InsertExperience): Promise<Experience> {
    return await prisma.experience.create({ data: exp });
  }

  async updateExperience(id: string, exp: Partial<InsertExperience>): Promise<Experience> {
    return await prisma.experience.update({
      where: { id },
      data: exp,
    });
  }

  async deleteExperience(id: string): Promise<void> {
    await prisma.experience.delete({ where: { id } });
  }
}

export const storage = new PostgresStorage();
