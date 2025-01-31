import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import DocumentCenter from "@/pages/document-center";
import CommunityPhotos from "@/pages/community-photos";
import Components from "@/pages/components";
import NotFound from "@/pages/not-found";
import Layout from "@/components/shared/layout";

function Router() {
  const { user, isLoading } = useUser();
  const [location, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to appropriate page based on auth status
  if (!user && location === '/dashboard') {
    setLocation('/auth');
    return null;
  }

  if (user && (location === '/auth' || location === '/')) {
    setLocation('/dashboard');
    return null;
  }

  // If user is not logged in, show landing page and auth pages only
  if (!user) {
    return (
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // If user is logged in, show dashboard and protected routes
  return (
    <Layout>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/documents" component={DocumentCenter} />
        <Route path="/photos" component={CommunityPhotos} />
        <Route path="/components" component={Components} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;