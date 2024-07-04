import { globalActions } from '@/store/globalSlices';
import React from 'react';
import { useDispatch } from 'react-redux';

const About = () => {
  const dispatch = useDispatch();
  const { setCreateModal } = globalActions;

  return (
    <main className="mx-auto max-w-3xl text-center space-y-8 px-4 sm:px-8">
      <h6 className="text-5xl font-semibold leading-none text-green-500">ChainVote</h6>
      <h1 className="text-4xl font-semibold leading-none mt-4 text-green-600">Empowering Democracy Through Blockchain</h1>
      <p className="text-lg font-medium mt-4 text-gray-300">
        At ChainVote, we believe in the power of technology to enhance democracy. Founded on the principles of security, transparency, and accessibility, ChainVote is dedicated to revolutionizing electoral processes worldwide. Our team of experts in blockchain technology and electoral systems is committed to creating a trusted platform that empowers voters and strengthens democratic institutions.
      </p>
      <div className="text-left mt-8">
        <h2 className="text-2xl font-semibold mb-2 text-green-600">Mission:</h2>
        <p className="text-lg font-medium mb-6 text-gray-300">To provide secure and transparent voting solutions that uphold the integrity of every ballot.</p>
        <h2 className="text-2xl font-semibold mb-2 text-green-600">Vision:</h2>
        <p className="text-lg font-medium mb-6 text-gray-300">A world where elections are fair, accessible, and trusted by all.</p>
        <h2 className="text-2xl font-semibold mb-2 text-green-600">Values:</h2>
        <ul className="list-disc pl-6">
          <li className="text-lg font-medium mb-2 text-gray-300">Integrity: Upholding the highest standards of fairness and honesty.</li>
          <li className="text-lg font-medium mb-2 text-gray-300">Innovation: Harnessing cutting-edge technology to advance democracy.</li>
          <li className="text-lg font-medium mb-2 text-gray-300">Empowerment: Giving every voter a voice that counts.</li>
        </ul>
      </div>
      <p className="text-lg font-medium mt-8 text-green-500">
        Join us on our journey to redefine democracy for the digital age. Together, let’s build a future where every vote matters.
      </p>
    </main>
  );
};

export default About;
