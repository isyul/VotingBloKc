import Layout from '@/components/Layout'
import Details from '@/components/Details'
import Contestants from '@/components/Contestants'
import ContestPoll from '@/components/ContestPoll'
import { GetServerSidePropsContext } from 'next'
import { getContestants, getPoll } from '@/services/blockchain'
import { ContestantStruct, PollStruct, RootState } from '@/utils/types'
import { useDispatch, useSelector } from 'react-redux'
import { globalActions } from '@/store/globalSlices'
import { useEffect } from 'react'
import UpdatePoll from '@/components/UpdatePoll'
import DeletePoll from '@/components/DeletePoll'
import { FaUserPlus } from 'react-icons/fa'

export default function PollDetail({
  pollData,
  contestantData,
}: {
  pollData: PollStruct
  contestantData: ContestantStruct[]
}) {
  const dispatch = useDispatch()
  const { setPoll, setContestants, setContestModal } = globalActions
  const { poll, contestants, wallet } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    dispatch(setPoll(pollData))
    dispatch(setContestants(contestantData))
  }, [dispatch, setPoll, setContestants, contestantData, pollData])
  
  // Check if current wallet is already registered as a candidate
  const isCandidate = contestants && wallet ? contestants.some(c => c.voter.toLowerCase() === wallet.toLowerCase()) : false
  
  // Check if poll is eligible for new candidates
  // Synced with smart contract restrictions: can only add candidates if voting hasn't started
  const canRegisterCandidate = poll && wallet && !poll.deleted && poll.votes === 0 && Date.now() < poll.endsAt
  
  // Function to show the candidate registration modal
  const handleShowContestModal = () => {
    if (!wallet) {
      // If wallet not connected, display error
      return
    }
    
    // Show modal
    dispatch(setContestModal('scale-100'))
  }

  if (!poll) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center p-10">
          <div className="animate-pulse text-blue-300">Loading poll details...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={poll.title}>
      <div className="animate-fadeIn">
        <Details poll={poll} />
        
        {/* Candidate actions - positioned more compactly */}
        <div className="mb-4">
          <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
            {canRegisterCandidate && !isCandidate && (
              <button 
                onClick={handleShowContestModal}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                text-white font-medium py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-md 
                hover:shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaUserPlus size={16} />
                Become a Candidate
              </button>
            )}
            
            {wallet && isCandidate && (
              <div className="bg-green-100/20 backdrop-blur-sm border border-green-300/30 rounded-lg p-3 text-center shadow-md">
                <p className="text-green-300 text-sm font-medium">
                  You are registered as a candidate
                </p>
              </div>
            )}
            
            {poll.votes > 0 && wallet && !isCandidate && (
              <div className="bg-yellow-100/20 backdrop-blur-sm border border-yellow-300/30 rounded-lg p-3 text-center shadow-md">
                <p className="text-yellow-300 text-sm font-medium">
                  Voting has begun - new candidates cannot be added
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Contestants section - with improved scrolling */}
        <div className="pb-8">
          {contestants && <Contestants poll={poll} contestants={contestants} />}
        </div>
      </div>
      
      {/* Modals */}
      <ContestPoll poll={poll} />
      <DeletePoll poll={poll} />
      <UpdatePoll pollData={poll} />
    </Layout>
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
