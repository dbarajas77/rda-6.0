import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { AuthProvider } from "./lib/AuthContext"
import { AuthForm } from "./components/auth/AuthForm"
import { useAuth } from "./lib/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import Button from "@/components/ui/Button"; // Added import for Button component


function AuthenticatedApp() {
  const { user, signOut } = useAuth()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome {user?.email}</h1>
      <Button onClick={signOut} variant="outline">Sign Out</Button>
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