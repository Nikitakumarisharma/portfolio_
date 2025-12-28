import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 py-12 mt-20">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-bold font-heading">Nikita<span className="text-primary">.</span></h3>
          <p className="text-sm text-muted-foreground mt-2">
            Building digital experiences that matter.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="#" className="p-2 rounded-full hover:bg-white/5 hover:text-primary transition-colors">
            <Github className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 rounded-full hover:bg-white/5 hover:text-primary transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 rounded-full hover:bg-white/5 hover:text-primary transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 rounded-full hover:bg-white/5 hover:text-primary transition-colors">
            <Mail className="h-5 w-5" />
          </a>
        </div>

        <div className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Nikita. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
