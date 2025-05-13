import { formatDate, truncate } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { PollStruct, RootState } from '@/utils/types'
import React from 'react'
import { MdModeEdit, MdDelete, MdHowToVote, MdDateRange, MdPerson } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'

const Details: React.FC<{ poll: PollStruct }> = ({ poll }) => {
  const dispatch = useDispatch()
  const { setContestModal, setUpdateModal, setDeleteModal } = globalActions
  const { wallet } = useSelector((states: RootState) => states.globalStates)

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-800/30 rounded-2xl p-6 shadow-lg shadow-blue-900/10">
        {/* Title and Description */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-100 mb-4">{poll.title}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{poll.description}</p>
        </div>
        
        {/* Election Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Date Range */}
          <div className="bg-blue-900/40 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-blue-800/50 rounded-full p-2">
              <MdDateRange className="text-blue-300 text-xl" />
            </div>
            <div>
              <div className="text-xs text-blue-300 mb-1">Election Period</div>
              <div className="text-sm text-white">{formatDate(poll.startsAt)} - {formatDate(poll.endsAt)}</div>
            </div>
          </div>
          
          {/* Director */}
          <div className="bg-blue-900/40 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-blue-800/50 rounded-full p-2">
              <MdPerson className="text-blue-300 text-xl" />
            </div>
            <div>
              <div className="text-xs text-blue-300 mb-1">Organized by</div>
              <div className="text-sm text-white">{truncate({ text: poll.director, startChars: 4, endChars: 4, maxLength: 11 })}</div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="bg-blue-900/40 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-blue-800/50 rounded-full p-2">
              <MdHowToVote className="text-blue-300 text-xl" />
            </div>
            <div>
              <div className="text-xs text-blue-300 mb-1">Current Status</div>
              <div className="text-sm text-white">{poll.votes} votes · {poll.contestants} candidates</div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          {poll.votes < 1 && (
            <button
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium
                bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-all"
              onClick={() => dispatch(setContestModal('scale-100'))}
            >
              <MdPerson className="text-xl" />
              Become Candidate
            </button>
          )}
          
          {wallet && wallet === poll.director && poll.votes < 1 && (
            <>
              <button
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
                  bg-blue-900/50 hover:bg-blue-800/70 border border-blue-700/50 text-white transition-all"
                onClick={() => dispatch(setUpdateModal('scale-100'))}
              >
                <MdModeEdit className="text-xl" />
                Edit Election
              </button>
              
              <button
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
                  bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-white transition-all"
                onClick={() => dispatch(setDeleteModal('scale-100'))}
              >
                <MdDelete className="text-xl text-red-400" />
                Delete Election
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Details
