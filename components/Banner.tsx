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
      <h1 className="text-5xl font-bold text-blue-500 leading-tight mt-4">
        Student Council Elections
      </h1>
      <p className="text-lg text-gray-300 mt-4">
        Welcome to our secure and transparent student council voting platform. 
        Cast your vote for the candidates who will represent you and your interests 
        in the student government. Our blockchain-based voting system ensures every 
        vote is counted fairly and securely, giving you confidence in the election process.
      </p>

      <button
        className="mt-8 inline-block px-6 py-3 rounded-full transition-all duration-300
         bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => dispatch(setCreateModal('scale-100'))}
      >
        Create Election
      </button>
    </main>
  );
};

export default Banner;
