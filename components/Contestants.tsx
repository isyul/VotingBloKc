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
    <div className="space-y-2">
      {/* <h1 className="text-center text-[48px] font-[600px]">Contestants</h1> */}

      <div className="grid grid-cols-1 xl:grid-cols-3 pb-7 gap-4 sm:gap-6 lg:gap-40 sm:w-full md:w-2/3 xl:w-11/12 mx-auto justify-items-center">
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
        success: 'Poll contested successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }
  return (
    <div className="flex justify-start items-center space-x-2 md:space-x-8 mt-5 md:mx-auto">
      <div
        className="bg-[#151515] bg-opacity-70 h-[229px] w-[200px] sm:w-[280px] sm:h-fit rounded-[24px]
        space-y-2 flex justify-center items-center flex-col pt-6 pb-6 px-3"
      >
        <h1 className="text-[16px] sm:text-[20px] font-[600px]">{contestant.name}</h1>

        <div
          className="flex items-center justify-center w-full
          rounded-[10px] space-x-2"
        >
          <div className="w-[32px] h-[32px] rounded-full bg-[#2C2C2C]" />
          <p className="text-[14px] font-[500px]">
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
          className={`w-[158px] sm:w-[200px] h-[45px] rounded-[30.5px] ${
            (wallet && poll.voters.includes(wallet)) ||
            Date.now() < poll.startsAt ||
            Date.now() >= poll.endsAt
              ? 'bg-[#B0BAC9] cursor-not-allowed'
              : 'bg-[#17A34A]'
          }`}
        >
          {wallet && contestant.voters.includes(wallet) ? 'Voted' : 'Vote'}
        </button>

        <div className="w-[86px] h-[32px] flex items-center justify-center gap-3">
          <div className="w-[32px] h-[32px] rounded-[9px] py-[6px] px-[7px] bg-[#0E1933]">
            <BiUpvote size={20} className="text-[#1DAB60]" />
          </div>
          <p className="text-[14px] font-[600px]">{contestant.votes} vote</p>
        </div>
      </div>
    </div>
  )
}

export default Contestants
