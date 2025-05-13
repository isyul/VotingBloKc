import { connectWallet, truncate } from '@/services/blockchain'
import { RootState } from '@/utils/types'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const { wallet } = useSelector((states: RootState) => states.globalStates)

  return (
    <nav
      className="h-[80px] flex justify-between items-center px-5 rounded-full"
    >
      <Link href="/" className="text-[20px] text-blue-800 sm:text-[24px]">
        <span className="text-blue-500 font-bold">StudentVote</span>
      </Link>
      <div className="flex items-center space-x-10">
      <Link href="/" className="text-[20px] text-white font hover:text-blue-400">
          Home
        </Link>
        <Link href="/events" className="text-[20px] text-white font hover:text-blue-400">
          Elections
        </Link>
        <Link href="/about" className="text-[20px] text-white font hover:text-blue-400">
          About
        </Link>
      {wallet ? (
        <button
          className="h-[48px] w-[130px] 
          sm:w-[148px] px-3 rounded-full text-sm font-bold
          transition-all duration-300 bg-[#3B82F6] hover:bg-blue-400"
        >
          {truncate({ text: wallet, startChars: 4, endChars: 4, maxLength: 11 })}
        </button>
      ) : (
        <button
          className="h-[48px] w-[130px] 
          sm:w-[148px] px-3 rounded-full text-sm font-bold
          transition-all duration-300 bg-[#3B82F6] hover:bg-blue-400"
          onClick={connectWallet}
        >
          Connect wallet
        </button>
      )}
        </div>
    </nav>
  )
}

export default Navbar
