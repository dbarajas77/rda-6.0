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
      <ProtectedRoute path="/dashboard" component={() => (
        <Layout>
          <Dashboard />
        </Layout>
      )} />
      <ProtectedRoute path="/documents" component={() => (
        <Layout>
          <DocumentCenter />
        </Layout>
      )} />
      <ProtectedRoute path="/photos" component={() => (
        <Layout>
          <CommunityPhotos />
        </Layout>
      )} />
      <ProtectedRoute path="/components" component={() => (
        <Layout>
          <Components />
        </Layout>
      )} />
      <ProtectedRoute path="/database" component={() => (
        <Layout>
          <DatabaseManagement />
        </Layout>
      )} />
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