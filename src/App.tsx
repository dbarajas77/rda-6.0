import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Basic connection test
        const { data, error } = await supabase
          .from('profiles')  // You can change this to any table you have
          .select('*')
          .limit(1)
        
        if (error) throw error

        setData(data)
        console.log('Successfully connected to Supabase!')
      } catch (err) {
        console.error('Error connecting to Supabase:', err)
        setError(err instanceof Error ? err.message : 'Failed to connect to Supabase')
      } finally {
        setIsLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      {isLoading && <p>Testing Supabase connection...</p>}
      
      {error && (
        <div className="text-red-500 my-4">
          <h3 className="font-bold">Connection Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {data && (
        <div className="my-4">
          <h3 className="font-bold">Connection Successful!</h3>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default App
