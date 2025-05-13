import Banner from '@/components/Banner'
import CreatePoll from '@/components/CreatePoll'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Polls from '@/components/Polls'
import { getPolls } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { PollStruct, RootState } from '@/utils/types'
import Head from 'next/head'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../styles/App.module.css' // Make sure to import the CSS file if you have global styles
import { FaVoteYea } from 'react-icons/fa'


export default function Home({ pollsData }: { pollsData: PollStruct[] }) {
  const dispatch = useDispatch()
  const { setPolls } = globalActions
  const { polls } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    dispatch(setPolls(pollsData))
  }, [dispatch, setPolls, pollsData])

  return (
    <>
      <Head>
        <title>Student Council Elections</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Static gradient background */}
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 opacity-95 z-[-1]"></div>

        <section className="relative px-5 py-10 text-white sm:p-10">
          <Navbar />
          
          <div className="max-w-5xl mx-auto mt-10 mb-12 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-blue-600/20 rounded-full mb-4">
              <FaVoteYea className="text-blue-300 text-xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-100 mb-4">Student Council Elections</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              View all active and upcoming elections. Cast your vote or register as a candidate to participate in the democratic process.
            </p>
          </div>
          
          <Polls polls={polls} />
        </section>
        <CreatePoll />
      </div>
      <Footer />
    </>
  )
}

export const getServerSideProps = async () => {
  const pollsData: PollStruct[] = await getPolls()
  return {
    props: { pollsData: JSON.parse(JSON.stringify(pollsData)) },
  }
}
