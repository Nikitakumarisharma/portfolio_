import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { PortfolioProvider } from "@/lib/store";
import { Navbar } from "@/components/layout/nav";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/nikita" component={AdminLogin} />
      <Route path="/nikita/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioProvider>
        <div className="min-h-screen bg-background text-foreground font-sans">
          <Navbar />
          <Router />
          <Toaster />
        </div>
      </PortfolioProvider>
    </QueryClientProvider>
  );
}

export default App;
