import { globalActions } from '@/store/globalSlices';
import React from 'react';
import { useDispatch } from 'react-redux';

const About = () => {
  const dispatch = useDispatch();
  const { setCreateModal } = globalActions;

  return (
    <main className="mx-auto max-w-3xl text-center space-y-8 px-4 sm:px-8">
      <h6 className="text-5xl font-semibold leading-none text-blue-500">StudentVote</h6>
      <h1 className="text-4xl font-semibold leading-none mt-4 text-blue-600">Student Council Elections Platform</h1>
      <p className="text-lg font-medium mt-4 text-gray-300">
        StudentVote provides a secure and transparent way for students to participate in student council elections. We believe in empowering students to choose their representatives fairly and securely. Our blockchain-based platform ensures that every vote is counted accurately and that election results are trustworthy.
      </p>
      <div className="text-left mt-8">
        <h2 className="text-2xl font-semibold mb-2 text-blue-600">Mission:</h2>
        <p className="text-lg font-medium mb-6 text-gray-300">To facilitate fair and transparent student council elections that engage the entire student body.</p>
        <h2 className="text-2xl font-semibold mb-2 text-blue-600">Vision:</h2>
        <p className="text-lg font-medium mb-6 text-gray-300">A school community where student leadership is chosen through a democratic process that students trust and participate in enthusiastically.</p>
        <h2 className="text-2xl font-semibold mb-2 text-blue-600">Values:</h2>
        <ul className="list-disc pl-6">
          <li className="text-lg font-medium mb-2 text-gray-300">Integrity: Ensuring fair and honest elections for all student positions.</li>
          <li className="text-lg font-medium mb-2 text-gray-300">Participation: Encouraging all students to make their voices heard.</li>
          <li className="text-lg font-medium mb-2 text-gray-300">Leadership: Developing the next generation of student leaders.</li>
        </ul>
      </div>
      <p className="text-lg font-medium mt-8 text-blue-500">
        Cast your vote today and help shape the future of your student government!
      </p>
    </main>
  );
};

export default About;
