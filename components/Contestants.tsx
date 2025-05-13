import { truncate, voteCandidate } from '@/services/blockchain'
import { ContestantStruct, PollStruct, RootState } from '@/utils/types'
import React from 'react'
import { BiUpvote } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const Contestants: React.FC<{ contestants: ContestantStruct[]; poll: PollStruct }> = ({
  contestants,
  poll,
}) => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-center mb-6">
        <div className="h-px bg-blue-700/30 w-full max-w-xs"></div>
        <h2 className="px-4 text-xl font-medium text-blue-200">Candidates</h2>
        <div className="h-px bg-blue-700/30 w-full max-w-xs"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 w-full max-w-6xl mx-auto">
        {contestants.map((contestant, i) => (
          <Contestant poll={poll} contestant={contestant} key={i} />
        ))}
      </div>
    </div>
  )
}

const Contestant: React.FC<{ contestant: ContestantStruct; poll: PollStruct }> = ({
  contestant,
  poll,
}) => {
  const { wallet } = useSelector((states: RootState) => states.globalStates)

  const voteContestant = async () => {
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
  return (
    <div className="w-full">
      <div
        className="bg-gradient-to-b from-blue-900/70 to-blue-900/40 backdrop-blur-sm border border-blue-800/30
        rounded-xl shadow-lg shadow-blue-900/20 overflow-hidden w-full hover:shadow-blue-700/20 
        hover:border-blue-700/50 transition-all duration-300"
      >
        <div className="p-5 flex flex-col items-center gap-4">
          <h3 className="text-xl font-semibold text-blue-200">{contestant.name}</h3>

          <div className="flex items-center justify-center w-full gap-2 text-gray-300 text-sm">
            <div className="w-6 h-6 rounded-full bg-blue-800/70 flex-shrink-0" />
            <p>
              {truncate({ text: contestant.voter, startChars: 4, endChars: 4, maxLength: 11 })}
            </p>
          </div>

          <button
            onClick={voteContestant}
            disabled={
              wallet
                ? contestant.voters.includes(wallet) ||
                  Date.now() < poll.startsAt ||
                  Date.now() >= poll.endsAt
                : true
            }
            className={`w-full py-2.5 rounded-lg font-medium text-white transition-all ${
              (wallet && poll.voters.includes(wallet)) ||
              Date.now() < poll.startsAt ||
              Date.now() >= poll.endsAt
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'
            }`}
          >
            {wallet && contestant.voters.includes(wallet) ? 'Voted' : 'Vote'}
          </button>

          <div className="flex items-center justify-center gap-2 text-blue-200">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-800/50">
              <BiUpvote size={18} className="text-blue-300" />
            </div>
            <p className="font-semibold">{contestant.votes} vote{contestant.votes !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contestants
