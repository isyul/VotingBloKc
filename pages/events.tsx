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
        <title>Available Polls</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <div className="min-h-screen relative backdrop-blur">
      <div className="absolute inset-0 before:absolute before:inset-0
  before:w-full before:h-full before:bg-black before:opacity-95
  before:z-[-1] before:bg-no-repeat before:bg-cover"
/> */}

{/* <div className="min-h-screen relative backdrop-noise absolute inset-0 isolate noise absolute inset-0 overlay absolute inset-0">
  <div className="absolute inset-0 before:absolute before:inset-0
    before:w-full before:h-full before:bg-gradient-to-br before:from-gray-900 before:via-gray-900 before:to-green-900
    before:opacity-95 before:z-[-1] before:bg-no-repeat before:bg-cover before:bg-grain
    absolute inset-0 isolate noise absolute inset-0 overlay absolute inset-0"
  /> */}


<div className="min-h-screen relative backdrop-noise absolute inset-0 isolate noise absolute inset-0 overlay absolute inset-0">
  {/* <div className="absolute inset-0 before:absolute before:inset-0
    before:w-full before:h-full before:bg-gradient-to-br before:from-gray-900 before:via-gray-900 before:to-green-900
    before:opacity-95 before:z-[-1] before:bg-no-repeat before:bg-cover before:bg-grain
    absolute inset-0 isolate noise absolute inset-0 overlay absolute inset-0"
  /> */}

<div className="yellow blob"></div>
<div className="red blob"></div>
<div className="blue blob"></div>


<svg style={{ position: 'absolute', width: 0, height: 0 }}>
  <filter id='noiseFilter'>
    <feTurbulence 
      type='fractalNoise' 
      baseFrequency='0.4' 
      stitchTiles='stitch'/>
    <feColorMatrix in="colorNoise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
    <feComposite operator="in" in2="SourceGraphic" result="monoNoise"/>
    {/* <feBlend in="SourceGraphic" in2="monoNoise" mode="screen" /> */}
  </filter>
</svg>





        <section className="relative px-5 py-10 space-y-16 text-white sm:p-10">
          <Navbar />
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
