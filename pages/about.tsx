import About from '@/components/About'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import '../styles/App.module.css' // Make sure to import the CSS file if you have global styles



export default function Home() {


  return (
    <>
      <Head>
        <title>ChainVote</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Static gradient background */}
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 opacity-95 z-[-1]"></div>

        <section className="relative px-5 py-10 space-y-16 text-white sm:p-10">
          <Navbar />
          <About />
        </section>
      </div>
      <Footer />
    </>
  )
}

