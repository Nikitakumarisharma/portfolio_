import { usePortfolio } from "@/lib/store";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useEffect, useState } from "react";

export function Skills() {
  const { skills } = usePortfolio();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    AutoScroll({ speed: 1.5, stopOnInteraction: false })
  ]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="skills" className="py-24 bg-card/30 border-y border-white/5">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold font-heading mb-4 text-center">Technical Arsenal</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          The tools and technologies I use to build scalable digital products.
        </p>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y gap-4 ml-4">
          {skills.map((skill) => (
            <div 
              key={skill.id} 
              className="flex-[0_0_auto] min-w-[150px] md:min-w-[200px] mx-4"
            >
              <div className="glass-card p-6 rounded-xl flex flex-col items-center justify-center hover:border-primary/50 transition-colors group h-full">
                <span className="text-lg font-mono font-medium group-hover:text-primary transition-colors">
                  {skill.name}
                </span>
                <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                  {skill.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
