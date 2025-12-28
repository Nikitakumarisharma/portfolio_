import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-card/30 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Let's Work Together</h2>
        <p className="text-muted-foreground mb-12">
          Have a project in mind or just want to say hi? Send me a message.
        </p>

        <div className="glass-card p-8 rounded-2xl text-left">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="John Doe" className="bg-background/50 border-white/10 focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="john@example.com" className="bg-background/50 border-white/10 focus:border-primary/50" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Tell me about your project..." className="min-h-[150px] bg-background/50 border-white/10 focus:border-primary/50" />
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto bg-primary text-white hover:bg-primary/90">
              Send Message <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
