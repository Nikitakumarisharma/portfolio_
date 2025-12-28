import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Pool } from "pg";
import {
  users,
  profile,
  projects,
  skills,
  experience,
  type User,
  type InsertUser,
  type Profile,
  type InsertProfile,
  type Project,
  type InsertProject,
  type Skill,
  type InsertSkill,
  type Experience,
  type InsertExperience,
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export interface IStorage {
  // User/Auth methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile methods
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profileData: InsertProfile): Promise<Profile>;
  createProfile(profileData: InsertProfile): Promise<Profile>;

  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Skill methods
  getSkills(): Promise<Skill[]>;
  getSkill(id: string): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  deleteSkill(id: string): Promise<void>;

  // Experience methods
  getExperience(): Promise<Experience[]>;
  getExperienceById(id: string): Promise<Experience | undefined>;
  createExperience(exp: InsertExperience): Promise<Experience>;
  updateExperience(id: string, exp: Partial<InsertExperience>): Promise<Experience>;
  deleteExperience(id: string): Promise<void>;
}

export class PostgresStorage implements IStorage {
  // User/Auth methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Profile methods
  async getProfile(): Promise<Profile | undefined> {
    const result = await db.select().from(profile).limit(1);
    return result[0];
  }

  async createProfile(profileData: InsertProfile): Promise<Profile> {
    const result = await db.insert(profile).values(profileData).returning();
    return result[0];
  }

  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    const existing = await this.getProfile();
    if (!existing) {
      return await this.createProfile(profileData);
    }
    const result = await db
      .update(profile)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(profile.id, existing.id))
      .returning();
    return result[0];
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.createdAt);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const result = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Skill methods
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.createdAt);
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    const result = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
    return result[0];
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const result = await db.insert(skills).values(skill).returning();
    return result[0];
  }

  async deleteSkill(id: string): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Experience methods
  async getExperience(): Promise<Experience[]> {
    return await db.select().from(experience).orderBy(experience.createdAt);
  }

  async getExperienceById(id: string): Promise<Experience | undefined> {
    const result = await db.select().from(experience).where(eq(experience.id, id)).limit(1);
    return result[0];
  }

  async createExperience(exp: InsertExperience): Promise<Experience> {
    const result = await db.insert(experience).values(exp).returning();
    return result[0];
  }

  async updateExperience(id: string, exp: Partial<InsertExperience>): Promise<Experience> {
    const result = await db
      .update(experience)
      .set({ ...exp, updatedAt: new Date() })
      .where(eq(experience.id, id))
      .returning();
    return result[0];
  }

  async deleteExperience(id: string): Promise<void> {
    await db.delete(experience).where(eq(experience.id, id));
  }
}

export const storage = new PostgresStorage();
