import { globalActions } from '@/store/globalSlices';
import React from 'react';
import { useDispatch } from 'react-redux';

const Banner = () => {
  const dispatch = useDispatch();
  const { setCreateModal } = globalActions;

  return (
    <main className="mx-auto max-w-4xl text-center py-12 px-4 sm:px-8">
      {/* <h6 className="text-3xl font-semibold leading-tight">
        Welcome to <span className="text-green-500">ChainVote</span>
      </h6> */}
      <h1 className="text-5xl font-bold text-green-600 leading-tight mt-4">
        Empowering Democracy Through Blockchain
      </h1>
      <p className="text-lg text-gray-400 mt-4">
        ChainVote revolutionizes the democratic process with secure and transparent 
        voting solutions powered by blockchain technology. Our platform ensures every 
        vote is cast and counted with utmost integrity, offering unprecedented accessibility 
        and trust in electoral processes. Whether for governments, organizations, or communities, 
        ChainVote is your partner in shaping the future of fair and reliable elections.
      </p>

      <button
        className="mt-8 inline-block px-6 py-3 rounded-full transition-all duration-300
         bg-gray-300 text-black hover:bg-green-700 hover:text-white"
        onClick={() => dispatch(setCreateModal('scale-100'))}
      >
        Create Event
      </button>
    </main>
  );
};

export default Banner;
