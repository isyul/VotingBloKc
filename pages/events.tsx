import Layout from '@/components/Layout'
import Polls from '@/components/Polls'
import { getPolls } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { PollStruct, RootState } from '@/utils/types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../styles/App.module.css'
import { FaVoteYea, FaClock } from 'react-icons/fa'

export default function Events({ pollsData }: { pollsData: PollStruct[] }) {
  const dispatch = useDispatch()
  const { setPolls } = globalActions
  const { polls } = useSelector((states: RootState) => states.globalStates)
  const [filterMode, setFilterMode] = useState<'all'|'active'|'upcoming'>('all')

  useEffect(() => {
    dispatch(setPolls(pollsData))
  }, [dispatch, setPolls, pollsData])

  // Get current time once to avoid inconsistencies in filtering
  const currentTime = Date.now()

  // Filter for active polls (voting has started but not ended)
  const activePolls = polls.filter(poll => 
    currentTime >= poll.startsAt && 
    currentTime < poll.endsAt && 
    !poll.deleted
  )

  // Filter for upcoming polls (not started yet)
  const upcomingPolls = polls.filter(poll => 
    currentTime < poll.startsAt && 
    !poll.deleted
  )

  // Combined polls for display based on filter
  const displayPolls = filterMode === 'all' 
    ? [...activePolls, ...upcomingPolls]
    : filterMode === 'active' 
      ? activePolls 
      : upcomingPolls

  return (
    <Layout title="Election Events - DappVotes">
      {/* Page header */}
      <div className="flex flex-col items-center justify-center mb-6 mt-4">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-700/30 text-blue-300">
            <FaVoteYea size={20} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Election Events</h1>
        <p className="text-blue-200 text-center max-w-2xl">
          View all active and upcoming election events
        </p>
      </div>
        
      {/* Filter controls */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-blue-900/40 backdrop-blur-sm rounded-lg p-1 gap-1">
          <button 
            onClick={() => setFilterMode('all')}
            className={`px-4 py-1.5 rounded-md text-sm transition ${
              filterMode === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'text-blue-300 hover:bg-blue-800/50'
            }`}
          >
            All Events
          </button>
          <button 
            onClick={() => setFilterMode('active')}
            className={`px-4 py-1.5 rounded-md text-sm transition flex items-center gap-2 ${
              filterMode === 'active' 
                ? 'bg-blue-600 text-white' 
                : 'text-blue-300 hover:bg-blue-800/50'
            }`}
          >
            <FaVoteYea size={12} />
            Active Voting
            <span className="bg-blue-700/60 text-xs px-1.5 py-0.5 rounded-full">{activePolls.length}</span>
          </button>
          <button 
            onClick={() => setFilterMode('upcoming')}
            className={`px-4 py-1.5 rounded-md text-sm transition flex items-center gap-2 ${
              filterMode === 'upcoming' 
                ? 'bg-blue-600 text-white' 
                : 'text-blue-300 hover:bg-blue-800/50'
            }`}
          >
            <FaClock size={12} />
            Upcoming
            <span className="bg-blue-700/60 text-xs px-1.5 py-0.5 rounded-full">{upcomingPolls.length}</span>
          </button>
        </div>
      </div>
      
      {/* Polls list */}
      <div className="mt-4">
        {displayPolls.length > 0 ? (
          <Polls polls={displayPolls} />
        ) : (
          <div className="bg-blue-900/30 rounded-lg border border-blue-800/50 p-8 text-center max-w-lg mx-auto">
            <p className="text-blue-200 mb-2">No {filterMode === 'all' ? '' : filterMode} events found</p>
            <p className="text-blue-400 text-sm">
              {filterMode === 'upcoming' 
                ? 'Create a new election to see it here.' 
                : 'Check back later for new voting events.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const data = await getPolls()

  return {
    props: {
      pollsData: JSON.parse(JSON.stringify(data)),
    },
  }
}
