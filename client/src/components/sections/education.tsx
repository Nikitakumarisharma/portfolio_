import { GraduationCap } from "lucide-react";

export function Education() {
  return (
    <section className="py-24 container mx-auto px-6">
       <div className="flex flex-col md:flex-row gap-12 items-center">
         <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">Education</h2>
            <div className="glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <GraduationCap className="w-32 h-32" />
               </div>
               
               <h3 className="text-2xl font-bold mb-2">Bachelor of Computer Science</h3>
               <p className="text-primary font-medium text-lg mb-4">University of Technology</p>
               <p className="text-muted-foreground mb-6">
                 Specialized in Software Engineering and Artificial Intelligence. 
                 Graduated with First Class Honors.
               </p>
               <span className="inline-block bg-white/5 px-4 py-2 rounded-full text-sm font-mono text-muted-foreground">
                 2017 - 2021
               </span>
            </div>
         </div>
         <div className="md:w-1/2 flex justify-center">
            {/* Visual spacer or graphic could go here */}
            <div className="w-full max-w-sm aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-3xl" />
         </div>
       </div>
    </section>
  );
}
