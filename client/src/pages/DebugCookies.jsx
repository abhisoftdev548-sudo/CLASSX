import { useState } from 'react'
import { debugApi } from '../api/debugApi'

export default function DebugCookies(){
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkCookies = async () => {
    setLoading(true)
    setError(null)
    try{
      const { response, error } = await debugApi.getCookies()
      if(error){
        setError(error)
        setResult(null)
      }else{
        setResult(response)
      }
    }catch(err){
      setError(err.message || 'Unknown error')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Debug: Cookies</h2>
      <button onClick={checkCookies} disabled={loading}>{loading ? 'Checking...' : 'Check Cookies'}</button>
      {error && <div style={{color:'red', marginTop:10}}>Error: {error}</div>}
      {result && (
        <pre style={{whiteSpace:'pre-wrap', marginTop:10}}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  )
}
