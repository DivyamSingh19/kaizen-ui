"use client"
import SignInButton from '@/components/buttons/secondary'
import React from 'react'

const page = () => {
  return (
     <div className="flex items-center justify-center min-h-screen bg-black">
      <SignInButton onClick={() => console.log("signed in")} />
    </div>
  )
}

export default page
