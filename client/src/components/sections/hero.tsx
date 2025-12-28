import { usePortfolio } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@assets/generated_images/dark_abstract_purple_neon_geometric_digital_landscape_background.png";

export function Hero() {
  const { profile } = usePortfolio();

  if (!profile) {
    return (
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="container mx-auto px-6 relative z-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background z-10" />
        <div className="absolute inset-0 bg-background/60 z-10" /> {/* Darken it further */}
        <img 
          src={heroBg} 
          alt="Abstract Background" 
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 tracking-wide">
            Available for Hire
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-300 text-glow">{profile.name}</span>
            <br />
            <span className="text-foreground">{profile.title}</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {profile.bio}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white min-w-[160px] h-12 rounded-full text-base">
              View Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="min-w-[160px] h-12 rounded-full text-base border-white/10 hover:bg-white/5">
              Download CV <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/50">
        <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-2">
          <div className="w-1 h-1 bg-current rounded-full animate-scroll" />
        </div>
      </div>
    </section>
  );
}
