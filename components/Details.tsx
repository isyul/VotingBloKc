import { formatDate, truncate } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { PollStruct, RootState } from '@/utils/types'
import React from 'react'
import { MdModeEdit, MdDelete } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'

const Details: React.FC<{ poll: PollStruct }> = ({ poll }) => {
  const dispatch = useDispatch()
  const { setContestModal, setUpdateModal, setDeleteModal } = globalActions
  const { wallet } = useSelector((states: RootState) => states.globalStates)

  return (
      <div
        className="flex flex-col space-y-6
        mt-5 w-full md:max-w-[736px] mx-auto"
      >
        <h1 className="text-[47px] font-[600px] text-center leading-none">{poll.title}</h1>
        <p className="text-[16px] font-[500px] text-center">{poll.description}</p>

        <div className=" h-[136px] gap-[16px] flex flex-col items-center mt-4">
          <div
            className="h-[36px] py-[6px] px-[12px] rounded-full gap-[4px] border 
            border-gray-900 bg-white bg-opacity-10"
          >
            <p className="text-[14px] font-[500px] text-center md:text-[16px]">
              {formatDate(poll.startsAt)} - {formatDate(poll.endsAt)}
            </p>
          </div>

          <div
            className="flex items-center justify-center w-[133px] h-[32px]
                 py-[20px] rounded-[10px] gap-[12px]"
          >
            <div className="w-[32px] h-[32px] rounded-full bg-[#17A34A]" />
            <p className="text-[14px] font-[500px]">
              {truncate({ text: poll.director, startChars: 4, endChars: 4, maxLength: 11 })}
            </p>
          </div>

          <div className="h-[36px] gap-[4px] flex justify-center items-center">
            <button
              className="py-[6px] px-[12px] border border-gray-900 bg-white bg-opacity-10
              rounded-full text-[12px] md:text-[16px]"
            >
              {poll.votes} votes
            </button>

            <button
              className="py-[6px] px-[12px] 
              border border-gray-900 bg-white bg-opacity-10 rounded-full text-[12px] md:text-[16px]"
            >
              {poll.contestants} contestants
            </button>

            {wallet && wallet === poll.director && poll.votes < 1 && (
              <button
                className="py-[6px] px-[12px] 
              border border-gray-900 bg-white bg-opacity-10 rounded-full 
              text-[12px] md:text-[16px] gap-[8px] flex justify-center items-center"
                onClick={() => dispatch(setUpdateModal('scale-100'))}
              >
                <MdModeEdit size={20} className="text-[#17A34A]" />
                Edit Event
              </button>
            )}

            {wallet && wallet === poll.director && poll.votes < 1 && (
              <button
                className="py-[6px] px-[12px] 
              border border-gray-900 bg-white bg-opacity-10 rounded-full 
              text-[12px] md:text-[16px] gap-[8px] flex justify-center items-center"
                onClick={() => dispatch(setDeleteModal('scale-100'))}
              >
                <MdDelete size={20} className="text-[#fe1b1b]" />
                Delete Event
              </button>
            )}
          </div>

          {poll.votes < 1 && (
            <button
              className="text-black h-[45px] w-[148px] rounded-full transition-all duration-300
              border border-gray-900 bg-white hover:bg-green-600 hover:text-white py-2"
              onClick={() => dispatch(setContestModal('scale-100'))}
            >
              Contest
            </button>
          )}
        </div>
      </div>
  )
}

export default Details
