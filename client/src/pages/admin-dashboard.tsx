import { useEffect } from "react";
import { useLocation } from "wouter";
import { usePortfolio } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { 
    isAuthenticated, logout, 
    profile, updateProfile,
    projects, addProject, deleteProject,
    skills, addSkill, deleteSkill,
    experience, addExperience, deleteExperience
  } = usePortfolio();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/nikita");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your portfolio content</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-red-500/20 text-red-400 hover:bg-red-500/10">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-card/50 border border-white/5 p-1">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and bio.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  updateProfile({
                    name: formData.get('name') as string,
                    title: formData.get('title') as string,
                    bio: formData.get('bio') as string,
                    email: formData.get('email') as string,
                    github: formData.get('github') as string,
                    linkedin: formData.get('linkedin') as string,
                  });
                  toast({ title: "Profile Updated" });
                }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input name="name" defaultValue={profile.name} className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input name="title" defaultValue={profile.title} className="bg-background/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea name="bio" defaultValue={profile.bio} className="bg-background/50 min-h-[100px]" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                     <div className="space-y-2">
                      <Label>Email</Label>
                      <Input name="email" defaultValue={profile.email} className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>GitHub URL</Label>
                      <Input name="github" defaultValue={profile.github} className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn URL</Label>
                      <Input name="linkedin" defaultValue={profile.linkedin} className="bg-background/50" />
                    </div>
                  </div>
                  <Button type="submit" className="bg-primary text-white">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {projects.map((project) => (
                   <Card key={project.id} className="bg-card/50 border-white/5 overflow-hidden flex flex-row h-32">
                     <div className="w-32 h-full shrink-0">
                       <img src={project.image} alt="" className="w-full h-full object-cover" />
                     </div>
                     <div className="p-4 flex-1 flex justify-between">
                       <div>
                         <h3 className="font-bold">{project.title}</h3>
                         <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                       </div>
                       <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                   </Card>
                ))}
              </div>
              <div>
                <Card className="glass-card border-white/10 sticky top-6">
                  <CardHeader>
                    <CardTitle>Add Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      addProject({
                        title: formData.get('title') as string,
                        description: formData.get('description') as string,
                        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop", // placeholder
                        link: "#",
                        tech: (formData.get('tech') as string).split(',').map(s => s.trim())
                      });
                      (e.target as HTMLFormElement).reset();
                      toast({ title: "Project Added" });
                    }}>
                      <Input name="title" placeholder="Project Title" required className="bg-background/50" />
                      <Textarea name="description" placeholder="Description" required className="bg-background/50" />
                      <Input name="tech" placeholder="Tech (comma separated)" required className="bg-background/50" />
                      <Button type="submit" className="w-full bg-primary text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Project
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* SKILLS TAB */}
          <TabsContent value="skills">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="glass-card border-white/10">
                 <CardHeader>
                   <CardTitle>Current Skills</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="flex flex-wrap gap-2">
                     {skills.map((skill) => (
                       <div key={skill.id} className="bg-white/5 px-3 py-1.5 rounded-md flex items-center gap-2 border border-white/5 group">
                         <span className="text-sm">{skill.name}</span>
                         <button onClick={() => deleteSkill(skill.id)} className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Trash2 className="h-3 w-3" />
                         </button>
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>

               <Card className="glass-card border-white/10 h-fit">
                 <CardHeader>
                   <CardTitle>Add Skill</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <form className="flex gap-2" onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     addSkill({
                       name: formData.get('name') as string,
                       category: "Frontend" // simplified
                     });
                     (e.target as HTMLFormElement).reset();
                   }}>
                     <Input name="name" placeholder="Skill Name" required className="bg-background/50" />
                     <Button type="submit" size="icon" className="shrink-0 bg-primary">
                       <Plus className="h-4 w-4" />
                     </Button>
                   </form>
                 </CardContent>
               </Card>
             </div>
          </TabsContent>

          {/* EXPERIENCE TAB */}
          <TabsContent value="experience">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {experience.map((exp) => (
                   <Card key={exp.id} className="bg-card/50 border-white/5 p-4 flex justify-between items-start">
                     <div>
                       <h3 className="font-bold">{exp.role}</h3>
                       <p className="text-primary text-sm">{exp.company}</p>
                       <p className="text-xs text-muted-foreground mb-2">{exp.period}</p>
                       <p className="text-sm text-muted-foreground">{exp.description}</p>
                     </div>
                     <Button variant="ghost" size="icon" onClick={() => deleteExperience(exp.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0 ml-4">
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </Card>
                ))}
              </div>
              <div>
                <Card className="glass-card border-white/10 sticky top-6">
                  <CardHeader>
                    <CardTitle>Add Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      addExperience({
                        role: formData.get('role') as string,
                        company: formData.get('company') as string,
                        period: formData.get('period') as string,
                        description: formData.get('description') as string,
                      });
                      (e.target as HTMLFormElement).reset();
                      toast({ title: "Experience Added" });
                    }}>
                      <Input name="role" placeholder="Role / Position" required className="bg-background/50" />
                      <Input name="company" placeholder="Company Name" required className="bg-background/50" />
                      <Input name="period" placeholder="Period (e.g. 2020 - 2022)" required className="bg-background/50" />
                      <Textarea name="description" placeholder="Description" required className="bg-background/50" />
                      <Button type="submit" className="w-full bg-primary text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Experience
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
