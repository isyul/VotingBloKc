import { deletePoll } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { PollStruct, RootState } from '@/utils/types'
import { MdDelete } from 'react-icons/md'
import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { checkWalletConnection } from '@/utils/errorHandler'

const DeletePoll: React.FC<{ poll: PollStruct }> = ({ poll }) => {
  const dispatch = useDispatch()
  const { setDeleteModal } = globalActions
  const { deleteModal, wallet } = useSelector((states: RootState) => states.globalStates)
  const router = useRouter()

  const handleDelete = async () => {
    // Check wallet connection
    if (!checkWalletConnection(wallet)) {
      return
    }

    // Validate poll ownership
    if (wallet !== poll.director) {
      toast.error('You are not authorized to delete this poll')
      closeModal()
      return
    }

    // Validate poll state
    if (poll.deleted) {
      toast.error('This poll has already been deleted')
      closeModal()
      return
    }

    if (poll.votes > 0) {
      toast.error('This poll has votes and cannot be deleted')
      closeModal()
      return
    }

    await toast.promise(
      new Promise<void>((resolve, reject) => {
        deletePoll(poll.id)
          .then((tx) => {
            closeModal()
            console.log(tx)
            router.push('/')
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Election deleted successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const closeModal = () => {
    dispatch(setDeleteModal('scale-0'))
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-80 transform z-50 transition-transform duration-300 ${deleteModal}`}
    >
      <div className="bg-white text-gray-800 shadow-xl shadow-blue-500/20 rounded-xl w-11/12 md:w-1/3 max-w-md p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="font-bold text-2xl text-blue-600">Delete Election</h2>
            <button 
              onClick={closeModal} 
              className="text-gray-500 hover:text-red-500 transition-colors focus:outline-none"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="flex flex-col justify-center items-center rounded-xl mt-5 mb-5">
            <div className="flex flex-col justify-center items-center my-5 space-y-4">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <MdDelete className="text-red-600" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Delete Election</h3>
              <p className="text-gray-600 text-center">
                Are you sure you want to delete this election? This action cannot be undone.
              </p>
              <div className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-200 w-full text-center">
                <span className="font-medium text-blue-800">{poll?.title}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full mt-4">
              <button
                className="flex-1 py-3 rounded-lg font-medium
                bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all"
                onClick={closeModal}
              >
                Cancel
              </button>
              
              <button
                className="flex-1 py-3 rounded-lg font-medium
                bg-red-600 hover:bg-red-700 text-white transition-all"
                onClick={handleDelete}
                disabled={!wallet || wallet !== poll.director || poll.votes > 0}
              >
                Delete Election
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeletePoll
