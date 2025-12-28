import { useState } from "react";
import { useLocation } from "wouter";
import { usePortfolio } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = usePortfolio();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  if (isAuthenticated) {
    setLocation("/nikita/dashboard");
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast({
        title: "Welcome back, Nikita",
        description: "You have successfully logged in.",
      });
      setLocation("/nikita/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid credentials.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md glass-card border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading">Admin Access</CardTitle>
          <CardDescription>Enter your password to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-white/10"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
              Unlock Dashboard
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Hint: Password is <code className="bg-white/10 px-1 rounded">admin123</code>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
