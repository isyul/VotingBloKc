import { globalActions } from '@/store/globalSlices'
import React from 'react'
import { useDispatch } from 'react-redux'

const Banner = () => {
  const dispatch = useDispatch()
  const { setCreateModal } = globalActions

  return (
    <main className="mx-auto text-center space-y-8">
      <h1 className="text-[45px] font-[600px] text-center leading-none">Decentralized Voting App</h1>
      <p className="text-[16px] font-[500px] text-center px-4 sm:px-10 md:px-20 lg:px-40">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et eleifend ex. Pellentesque eu mi maximus, interdum odio non, lacinia dolor. Quisque non diam vitae enim imperdiet iaculis quis ac magna. Quisque id feugiat quam. Nulla augue est, imperdiet id faucibus vitae, scelerisque nec metus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et eleifend ex. Pellentesque eu mi maximus, interdum odio non, lacinia dolor. Quisque non diam vitae enim imperdiet iaculis quis ac magna. Quisque id feugiat quam.
      </p>

      <button
        className="text-black h-[45px] w-[148px] rounded-full transition-all duration-300
        border border-gray-400 bg-white hover:bg-opacity-20 hover:text-white"
        onClick={() => dispatch(setCreateModal('scale-100'))}
      >
        Create Event
      </button>
    </main>
  )
}

export default Banner
