import { useState } from "react"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (isLogin) {
        await signIn(email, password)
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
      } else {
        await signUp(email, password)
        toast({
          title: "Registration successful",
          description: "Please check your email for verification.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: isLogin ? "Login failed" : "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[400px] mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Welcome</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Sign in to access your HOA management dashboard
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setIsLogin(value === "login")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
