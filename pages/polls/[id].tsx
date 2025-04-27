import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Details from '@/components/Details'
import Contestants from '@/components/Contestants'
import Head from 'next/head'
import ContestPoll from '@/components/ContestPoll'
import { GetServerSidePropsContext } from 'next'
import { getContestants, getPoll } from '@/services/blockchain'
import { ContestantStruct, PollStruct, RootState } from '@/utils/types'
import { useDispatch, useSelector } from 'react-redux'
import { globalActions } from '@/store/globalSlices'
import { useEffect } from 'react'
import UpdatePoll from '@/components/UpdatePoll'
import DeletePoll from '@/components/DeletePoll'

export default function Polls({
  pollData,
  contestantData,
}: {
  pollData: PollStruct
  contestantData: ContestantStruct[]
}) {
  const dispatch = useDispatch()
  const { setPoll, setContestants } = globalActions
  const { poll, contestants } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    dispatch(setPoll(pollData))
    dispatch(setContestants(contestantData))
  }, [dispatch, setPoll, setContestants, contestantData, pollData])

  return (
    <>
      {poll && (
        <Head>
          <title>{poll.title}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      )}

      {/* Static gradient background */}
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 opacity-95 z-[-1]"></div>

        <section className="relative px-5 py-10 space-y-16 text-white sm:p-10">
          <Navbar />
          {poll && <Details poll={poll} />}
          {poll && contestants && <Contestants poll={poll} contestants={contestants} />}
          {/* <Footer /> */}
        </section>

        {poll && <ContestPoll poll={poll} />}
        {poll && <DeletePoll poll={poll} />}
        {poll && <UpdatePoll pollData={poll} />}
      </div>
    </>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const pollData = await getPoll(Number(id))
  const contestantData = await getContestants(Number(id))

  return {
    props: {
      pollData: JSON.parse(JSON.stringify(pollData)),
      contestantData: JSON.parse(JSON.stringify(contestantData)),
    },
  }
}
