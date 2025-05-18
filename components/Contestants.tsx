import { truncate, voteCandidate } from '@/services/blockchain'
import { ContestantStruct, PollStruct, RootState } from '@/utils/types'
import React from 'react'
import { BiUpvote, BiUserCircle } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { checkWalletConnection } from '@/utils/errorHandler'

const Contestants: React.FC<{ contestants: ContestantStruct[]; poll: PollStruct }> = ({
  contestants,
  poll,
}) => {
  return (
    <div className="w-full">
      {/* Header with count badge - enhanced styling */}
      <div className="sticky top-16 z-10 py-3 bg-blue-900/80 backdrop-blur-xl border-b border-blue-800/30 mb-6 px-4 shadow-sm shadow-blue-500/10">
        <div className="flex items-center justify-center gap-3 max-w-7xl mx-auto">
          <div className="h-px bg-blue-700/30 w-full max-w-xs hidden md:block"></div>
          <h2 className="text-xl font-medium text-blue-200 flex items-center gap-2">
            Candidates
            <span className="bg-blue-900/80 border border-blue-700/30 px-2 py-0.5 text-xs rounded-full text-blue-300">
              {contestants.length}
            </span>
          </h2>
          <div className="h-px bg-blue-700/30 w-full max-w-xs hidden md:block"></div>
        </div>
        
        {contestants.length < 2 && (
          <div className="mt-2 bg-yellow-400/20 text-yellow-300 text-sm px-4 py-2 rounded-md text-center max-w-lg mx-auto">
            At least 2 candidates are required for voting to begin
          </div>
        )}
      </div>

      {/* Grid of contestants - enhanced for smooth scrolling */}
      {contestants.length > 0 ? (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-7xl mx-auto pb-10"
        >
          {contestants.map((contestant, i) => (
            <Contestant poll={poll} contestant={contestant} key={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-blue-900/30 rounded-lg border border-blue-800/50 max-w-lg mx-auto">
          <p className="text-blue-300">No candidates have registered yet</p>
        </div>
      )}
    </div>
  )
}

const Contestant: React.FC<{ contestant: ContestantStruct; poll: PollStruct }> = ({
  contestant,
  poll,
}) => {
  const { wallet } = useSelector((states: RootState) => states.globalStates)

  // Check if the contestant is the current user (used only for display purposes now)
  const isOwnCandidate = wallet && contestant.voter.toLowerCase() === wallet.toLowerCase()

  const voteContestant = async () => {
    // Check wallet connection first
    if (!checkWalletConnection(wallet)) {
      return
    }

    // Additional validation checks before attempting to vote
    if (poll.deleted) {
      toast.error('This poll has been deleted')
      return
    }

    if (Date.now() < poll.startsAt) {
      toast.error('Voting has not started yet')
      return
    }

    if (Date.now() >= poll.endsAt) {
      toast.error('Voting period has ended')
      return
    }

    if (wallet && poll.voters.includes(wallet)) {
      toast.error('You have already voted in this poll')
      return
    }

    await toast.promise(
      new Promise<void>((resolve, reject) => {
        voteCandidate(poll.id, contestant.id)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Vote cast successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }
  
  // Helper functions to determine button state and message
  const isVotingPeriod = () => {
    return Date.now() >= poll.startsAt && Date.now() < poll.endsAt
  }

  const hasVoted = () => {
    return wallet && poll.voters.includes(wallet)
  }

  const getButtonMessage = () => {
    if (!wallet) return 'Connect Wallet to Vote'
    if (hasVoted()) return 'Voted'
    if (Date.now() < poll.startsAt) return 'Voting Not Started'
    if (Date.now() >= poll.endsAt) return 'Voting Ended'
    return 'Vote'
  }

  return (
    <div className="h-full transform transition-transform hover:scale-[1.02] duration-300">
      <div
        className="bg-gradient-to-b from-blue-900/70 to-blue-900/40 backdrop-blur-sm border border-blue-800/30
        rounded-xl shadow-lg shadow-blue-900/20 overflow-hidden h-full hover:shadow-blue-700/30 
        hover:border-blue-700/50 transition-all duration-300"
      >
        <div className="p-5 flex flex-col items-center gap-4 h-full">
          <h3 className="text-xl font-semibold text-blue-200">{contestant.name}</h3>

          <div className="flex items-center justify-center w-full gap-2 text-gray-300 text-sm">
            <div className="w-6 h-6 rounded-full bg-blue-800/70 flex-shrink-0" />
            <p>
              {truncate({ text: contestant.voter, startChars: 4, endChars: 4, maxLength: 11 })}
            </p>
          </div>

          {isOwnCandidate && (
            <div className="bg-blue-900/50 border border-blue-700/30 rounded-md px-3 py-1">
              <span className="text-xs text-blue-300">Your Candidature</span>
            </div>
          )}
          
          <div className="mt-auto w-full pt-4">
            {/* Votes counter displayed before the button */}
            <div className="flex items-center justify-center gap-2 text-blue-200 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-800/50">
                <BiUpvote size={18} className="text-blue-300" />
              </div>
              <p className="font-semibold">{contestant.votes} vote{contestant.votes !== 1 ? 's' : ''}</p>
          </div>

          <button
            onClick={voteContestant}
              disabled={!wallet || hasVoted() || !isVotingPeriod()}
            className={`w-full py-2.5 rounded-lg font-medium text-white transition-all ${
                !wallet || hasVoted() || !isVotingPeriod()
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'
            }`}
          >
              {getButtonMessage()}
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contestants
