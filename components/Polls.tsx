/* eslint-disable @next/next/no-img-element */
import { formatDate, truncate } from '@/services/blockchain'
import { PollStruct } from '@/utils/types'
import { useRouter } from 'next/router'
import React from 'react'
import { MdPerson, MdDateRange, MdHowToVote } from 'react-icons/md'

const Polls: React.FC<{ polls: PollStruct[] }> = ({ polls }) => {
  // If we have no polls, show a message
  if (polls.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-300">No elections found</h2>
        <p className="text-gray-400 mt-2">Be the first to create an election using the button above.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {polls.map((poll, i) => (
          <Poll key={i} poll={poll} />
        ))}
      </div>
    </div>
  )
}

const Poll: React.FC<{ poll: PollStruct }> = ({ poll }) => {
  const navigate = useRouter()
  
  // Check if election is active
  const now = Date.now()
  const isActive = now >= poll.startsAt && now < poll.endsAt
  const isPending = now < poll.startsAt
  const isCompleted = now >= poll.endsAt
  
  // Status badge
  let statusBadge = (
    <span className="bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full">
      Upcoming
    </span>
  )
  
  if (isActive) {
    statusBadge = (
      <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full">
        Active
      </span>
    )
  } else if (isCompleted) {
    statusBadge = (
      <span className="bg-gray-500/20 text-gray-300 text-xs px-3 py-1 rounded-full">
        Completed
      </span>
    )
  }

  return (
    <div className="h-full">
      <div className="h-full flex flex-col bg-gradient-to-b from-blue-900/70 to-blue-900/40 backdrop-blur-sm 
           border border-blue-800/30 rounded-xl shadow-lg shadow-blue-900/20 overflow-hidden
           hover:shadow-blue-700/20 hover:border-blue-700/50 transition-all duration-300">
        
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            {statusBadge}
            <div className="flex items-center text-xs text-gray-400">
              <MdPerson className="mr-1 text-blue-400" />
              {truncate({ text: poll.director, startChars: 4, endChars: 4, maxLength: 11 })}
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-blue-100 mb-2 line-clamp-2">
            {poll.title}
          </h2>
          
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {poll.description}
          </p>
          
          <div className="mt-auto space-y-3">
            <div className="flex items-center text-xs text-gray-300">
              <MdDateRange className="mr-2 text-blue-400" />
              <span>{formatDate(poll.startsAt)} - {formatDate(poll.endsAt)}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-300">
              <MdHowToVote className="mr-2 text-blue-400" />
              <span>{poll.contestants} candidates · {poll.votes} votes</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-blue-800/30">
          <button
            onClick={() => navigate.push('/polls/' + poll.id)}
            className="w-full py-2.5 rounded-lg font-medium text-white transition-all
                     bg-blue-600 hover:bg-blue-500 active:bg-blue-700 flex justify-center items-center"
          >
            {isActive ? "Vote Now" : isPending ? "View Details" : "See Results"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Polls
