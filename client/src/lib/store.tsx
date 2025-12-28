import { createContext, useContext, useState, ReactNode } from "react";

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
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  updateProfile: (profile: Profile) => void;
  addProject: (project: Omit<Project, "id">) => void;
  deleteProject: (id: string) => void;
  addSkill: (skill: Omit<Skill, "id">) => void;
  deleteSkill: (id: string) => void;
  addExperience: (exp: Omit<Experience, "id">) => void;
  deleteExperience: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Initial Mock Data
const initialProfile: Profile = {
  name: "Nikita",
  title: "Full Stack Developer",
  bio: "Building digital experiences with code and creativity. Specialized in Next.js, Node.js, and modern UI architectures.",
  email: "hello@nikita.dev",
  github: "https://github.com",
  linkedin: "https://linkedin.com"
};

const initialProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Dashboard",
    description: "A comprehensive analytics dashboard for online retailers with real-time data visualization.",
    tech: ["Next.js", "Tailwind", "Recharts"],
    link: "#",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "AI Content Generator",
    description: "SaaS application that uses LLMs to generate marketing copy and blog posts.",
    tech: ["React", "OpenAI API", "Node.js"],
    link: "#",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2532&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Task Master",
    description: "Collaborative project management tool with drag-and-drop kanban boards.",
    tech: ["Vue", "Firebase", "Pinia"],
    link: "#",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2372&auto=format&fit=crop"
  }
];

const initialSkills: Skill[] = [
  { id: "1", name: "React", category: "Frontend" },
  { id: "2", name: "Next.js", category: "Frontend" },
  { id: "3", name: "TypeScript", category: "Frontend" },
  { id: "4", name: "Tailwind CSS", category: "Frontend" },
  { id: "5", name: "Node.js", category: "Backend" },
  { id: "6", name: "PostgreSQL", category: "Backend" },
  { id: "7", name: "Prisma", category: "Backend" },
  { id: "8", name: "Docker", category: "Tools" },
  { id: "9", name: "Git", category: "Tools" },
  { id: "10", name: "AWS", category: "Tools" }
];

const initialExperience: Experience[] = [
  {
    id: "1",
    role: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    period: "2023 - Present",
    description: "Leading the frontend team in rebuilding the core product dashboard. Improved performance by 40%."
  },
  {
    id: "2",
    role: "Full Stack Developer",
    company: "Creative Agency",
    period: "2021 - 2023",
    description: "Developed custom web solutions for diverse clients using the MERN stack."
  }
];

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [experience, setExperience] = useState<Experience[]>(initialExperience);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (password: string) => {
    // Mock authentication - simpler for prototype
    if (password === "admin123") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAuthenticated(false);

  const updateProfile = (newProfile: Profile) => setProfile(newProfile);

  const addProject = (project: Omit<Project, "id">) => {
    const newProject = { ...project, id: Math.random().toString(36).substr(2, 9) };
    setProjects([...projects, newProject]);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const addSkill = (skill: Omit<Skill, "id">) => {
    const newSkill = { ...skill, id: Math.random().toString(36).substr(2, 9) };
    setSkills([...skills, newSkill]);
  };

  const deleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const addExperience = (exp: Omit<Experience, "id">) => {
    const newExp = { ...exp, id: Math.random().toString(36).substr(2, 9) };
    setExperience([...experience, newExp]);
  };

  const deleteExperience = (id: string) => {
    setExperience(experience.filter(e => e.id !== id));
  };

  return (
    <PortfolioContext.Provider value={{
      profile, projects, skills, experience, isAuthenticated,
      login, logout, updateProfile,
      addProject, deleteProject,
      addSkill, deleteSkill,
      addExperience, deleteExperience
    }}>
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
