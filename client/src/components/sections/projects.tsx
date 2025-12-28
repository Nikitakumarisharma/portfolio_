import { usePortfolio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";

export function Projects() {
  const { projects } = usePortfolio();

  return (
    <section id="projects" className="py-24 container mx-auto px-6">
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Featured Projects</h2>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t) => (
                  <Badge key={t} variant="secondary" className="bg-white/5 hover:bg-white/10 text-xs">
                    {t}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-4">
                <Button size="sm" variant="outline" className="w-full border-white/10 hover:bg-white/5">
                  <ExternalLink className="mr-2 h-4 w-4" /> Demo
                </Button>
                <Button size="sm" variant="outline" className="w-full border-white/10 hover:bg-white/5">
                  <Github className="mr-2 h-4 w-4" /> Code
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
