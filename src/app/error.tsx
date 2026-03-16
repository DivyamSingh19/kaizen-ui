
'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <h2>System under maintenance. Try again in 20 mins.</h2>
        <button onClick={() => reset()}>Retry</button>
      </div>
    </div>
  )
}