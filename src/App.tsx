import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { AuthProvider } from "./lib/AuthContext"
import { LoginForm } from "./components/auth/LoginForm"
import { useAuth } from "./lib/AuthContext"
import { Toaster } from "@/components/ui/toaster"

function AuthenticatedApp() {
  const { user, signOut } = useAuth()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome {user?.email}</h1>
      {/* Assuming a Button component exists */}
      <button onClick={signOut}>Sign Out</button> {/* Added a simple button for sign out */}
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
      {!user ? <LoginForm /> : <AuthenticatedApp />}
      <Toaster />
    </AuthProvider>
  )
}

export default App