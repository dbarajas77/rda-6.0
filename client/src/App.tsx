import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./lib/auth";
import { ProtectedRoute } from "@/components/shared/protected-route";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import DocumentCenter from "@/pages/document-center";
import CommunityPhotos from "@/pages/community-photos";
import Components from "@/pages/components";
import DatabaseManagement from "@/pages/database";
import NotFound from "@/pages/not-found";
import Layout from "@/components/shared/layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/documents" component={DocumentCenter} />
      <ProtectedRoute path="/photos" component={CommunityPhotos} />
      <ProtectedRoute path="/components" component={Components} />
      <ProtectedRoute path="/database" component={DatabaseManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;