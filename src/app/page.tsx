import Navbar from '@/components/core/navbar'
import SignInButton from '@/components/buttons/secondary'
import React from 'react'
import HowItWorks from '@/components/core/how-it-works'
import Footer from '@/components/core/footer'

const page = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      <div className="p-4">
        <Navbar/>
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase mb-6">
          Welcome to <span className="text-[#aaff00]">Kaizen</span>
        </h1>
        <p className="text-zinc-400 max-w-lg mx-auto mb-10 text-lg">
          Secure, transparent, and seamless on-chain operations. Elevate your governance today.
        </p>
        <SignInButton href="/register" label="GET STARTED" />
      </main>
      <section id="how-it-works">
        <HowItWorks/>
      </section>
      <section id='footer'>
        <Footer/>
      </section>
    </div>
  )
}

export default page
