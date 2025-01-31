import { useState, useEffect } from 'react'
import { Route, Switch } from 'wouter'
import { supabase } from './lib/supabaseClient'
import { AuthProvider } from "./lib/AuthContext"
import { AuthForm } from "./components/auth/AuthForm"
import { useAuth } from "./lib/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import Button from "@/components/ui/Button"
import DatabasePage from "./pages/DatabasePage"

function AuthenticatedApp() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen">
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">HOA Reserve Study</h1>
          <div className="flex items-center gap-4">
            <span>Welcome {user?.email}</span>
            <Button onClick={signOut} variant="outline">Sign Out</Button>
          </div>
        </div>
      </header>

      <main>
        <Switch>
          <Route path="/database" component={DatabasePage} />
          <Route path="/">Home Page</Route>
        </Switch>
      </main>
    </div>
  )
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthProvider>
      {!user ? <AuthForm /> : <AuthenticatedApp />}
      <Toaster />
    </AuthProvider>
  )
}

export default App