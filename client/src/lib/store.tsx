import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link: string;
  image: string;
}

export interface Skill {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Tools";
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
}

interface PortfolioContextType {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
  addProject: (project: Omit<Project, "id">) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addSkill: (skill: Omit<Skill, "id">) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  addExperience: (exp: Omit<Experience, "id">) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// API helper function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    try {
      await apiRequest("/auth/me");
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [profileData, projectsData, skillsData, experienceData] = await Promise.all([
        apiRequest<Profile>("/profile").catch(() => null),
        apiRequest<Project[]>("/projects").catch(() => []),
        apiRequest<Skill[]>("/skills").catch(() => []),
        apiRequest<Experience[]>("/experience").catch(() => []),
      ]);

      if (profileData) setProfile(profileData);
      setProjects(projectsData);
      setSkills(skillsData);
      setExperience(experienceData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setIsAuthenticated(true);
      return true;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (newProfile: Profile): Promise<void> => {
    try {
      const updated = await apiRequest<Profile>("/profile", {
        method: "PUT",
        body: JSON.stringify(newProfile),
      });
      setProfile(updated);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  const addProject = async (project: Omit<Project, "id">): Promise<void> => {
    try {
      const newProject = await apiRequest<Project>("/projects", {
        method: "POST",
        body: JSON.stringify(project),
      });
      setProjects([...projects, newProject]);
    } catch (error) {
      console.error("Failed to add project:", error);
      throw error;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      await apiRequest(`/projects/${id}`, { method: "DELETE" });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  };

  const addSkill = async (skill: Omit<Skill, "id">): Promise<void> => {
    try {
      const newSkill = await apiRequest<Skill>("/skills", {
        method: "POST",
        body: JSON.stringify(skill),
      });
      setSkills([...skills, newSkill]);
    } catch (error) {
      console.error("Failed to add skill:", error);
      throw error;
    }
  };

  const deleteSkill = async (id: string): Promise<void> => {
    try {
      await apiRequest(`/skills/${id}`, { method: "DELETE" });
      setSkills(skills.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete skill:", error);
      throw error;
    }
  };

  const addExperience = async (exp: Omit<Experience, "id">): Promise<void> => {
    try {
      const newExp = await apiRequest<Experience>("/experience", {
        method: "POST",
        body: JSON.stringify(exp),
      });
      setExperience([...experience, newExp]);
    } catch (error) {
      console.error("Failed to add experience:", error);
      throw error;
    }
  };

  const deleteExperience = async (id: string): Promise<void> => {
    try {
      await apiRequest(`/experience/${id}`, { method: "DELETE" });
      setExperience(experience.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Failed to delete experience:", error);
      throw error;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        skills,
        experience,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateProfile,
        addProject,
        deleteProject,
        addSkill,
        deleteSkill,
        addExperience,
        deleteExperience,
        refreshData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
