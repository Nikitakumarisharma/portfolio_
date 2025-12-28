import { usePortfolio } from "@/lib/store";
import { Briefcase } from "lucide-react";

export function Experience() {
  const { experience } = usePortfolio();

  return (
    <section id="experience" className="py-24 bg-card/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 sticky top-24">
              Work Experience
              <span className="block text-primary text-lg font-sans font-normal mt-2">My professional journey</span>
            </h2>
          </div>

          <div className="md:w-2/3 space-y-8">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-8 border-l border-white/10 hover:border-primary/50 transition-colors pb-8 last:pb-0">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                
                <div className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                    <span className="text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                      {exp.period}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Briefcase className="h-4 w-4" />
                    <span className="font-medium">{exp.company}</span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
