
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Terminal } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
});

const DEV_CREDENTIALS = {
  email: "dev@example.com",
  password: "dev_password",
  fullName: "Development User",
};

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const form = useForm({
    resolver: zodResolver(activeTab === "login" ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const onSubmit = async (values) => {
    try {
      const isLogin = activeTab === "login";
      console.log("Submitting form:", { isLogin, values });

      if (isLogin) {
        await signIn(values.email, values.password);
      } else {
        await signUp(values.email, values.password, values.fullName);
      }

      toast({
        title: "Success",
        description: isLogin
          ? "Welcome back!"
          : "Account created successfully",
      });
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description:
          error.message || "Please check your credentials and try again",
      });
    }
  };

  useEffect(() => {
    form.reset({
      email: "",
      password: "",
      fullName: "",
    });
  }, [activeTab, form]);

  const fillDevCredentials = (isLogin) => {
    setActiveTab(isLogin ? "login" : "register");
    const values = isLogin
      ? {
          email: DEV_CREDENTIALS.email,
          password: DEV_CREDENTIALS.password,
        }
      : DEV_CREDENTIALS;
    form.reset(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/5 px-4">
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            className="mb-2"
            onClick={() => setShowDevPanel(!showDevPanel)}
          >
            <Terminal className="h-4 w-4 mr-2" />
            Dev Panel
          </Button>
          {showDevPanel && (
            <Card className="w-80 absolute bottom-12 right-0 border-destructive">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Development Credentials
                </CardTitle>
                <CardDescription className="text-xs">
                  For testing purposes only
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p>
                    <strong>Email:</strong> {DEV_CREDENTIALS.email}
                  </p>
                  <p>
                    <strong>Password:</strong> {DEV_CREDENTIALS.password}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => fillDevCredentials(true)}>
                    Fill Login
                  </Button>
                  <Button size="sm" onClick={() => fillDevCredentials(false)}>
                    Fill Register
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to access your HOA management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {activeTab === "register" && (
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder={
                                activeTab === "login"
                                  ? "Enter your password"
                                  : "Choose a password"
                              }
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {activeTab === "login"
                      ? "Sign In"
                      : "Create Account"}
                  </Button>
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
