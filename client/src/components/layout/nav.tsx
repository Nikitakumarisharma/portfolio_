import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated } = usePortfolio();

  const navLinks = [
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-bold font-heading tracking-tight hover:text-primary transition-colors cursor-pointer">
            Nikita<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {location === "/" && navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <Link href="/nikita">
            <Button variant="ghost" size="icon" className="hover:text-primary">
               {isAuthenticated ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <Shield className="h-4 w-4" />}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
