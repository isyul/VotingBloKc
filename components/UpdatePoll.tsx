import { formatTimestamp, updatePoll } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { PollParams, PollStruct, RootState } from '@/utils/types'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { FaTimes, FaCalendarAlt, FaRegClock, FaEdit, FaHeading } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { checkWalletConnection } from '@/utils/errorHandler'

const UpdatePoll: React.FC<{ pollData: PollStruct }> = ({ pollData }) => {
  const dispatch = useDispatch()
  const { setUpdateModal } = globalActions
  const { updateModal, wallet } = useSelector((states: RootState) => states.globalStates)

  const [poll, setPoll] = useState<PollParams>({
    title: '',
    description: '',
    startsAt: '',
    endsAt: '',
  })

  useEffect(() => {
    if (pollData) {
      const {title, description, startsAt, endsAt } = pollData
      setPoll({
        title,
        description,
        startsAt: formatTimestamp(startsAt),
        endsAt: formatTimestamp(endsAt),
      })
    }
  }, [pollData])

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()

    // Validate form fields
    if (!poll.title || !poll.description || !poll.startsAt || !poll.endsAt) {
      toast.warn('Please fill in all required fields')
      return
    }

    // Check wallet connection
    if (!checkWalletConnection(wallet)) {
      return
    }

    // Validate poll ownership
    if (wallet !== pollData.director) {
      toast.error('You are not authorized to update this poll')
      return
    }

    // Validate poll state
    if (pollData.deleted) {
      toast.error('This poll has been deleted and cannot be updated')
      return
    }

    if (pollData.votes > 0) {
      toast.error('This poll already has votes and cannot be updated')
      return
    }

    const startsAtTimestamp = new Date(poll.startsAt).getTime()
    const endsAtTimestamp = new Date(poll.endsAt).getTime()

    // Validate date inputs
    if (startsAtTimestamp <= Date.now()) {
      toast.warn('Start date must be in the future')
      return
    }

    if (endsAtTimestamp <= startsAtTimestamp) {
      toast.warn('End date must be after start date')
      return
    }

    // Update with validated timestamps
    poll.startsAt = startsAtTimestamp
    poll.endsAt = endsAtTimestamp

    await toast.promise(
      new Promise<void>((resolve, reject) => {
        updatePoll(pollData.id, poll)
          .then((tx) => {
            closeModal()
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Election updated successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPoll((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const closeModal = () => {
    dispatch(setUpdateModal('scale-0'))
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-80 transform z-50 transition-transform duration-300 ${updateModal}`}
    >
      <div className="bg-white text-gray-800 shadow-xl shadow-blue-500/20 rounded-xl w-11/12 md:w-2/5 max-w-2xl p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="font-bold text-2xl text-blue-600">Edit Election</h2>
            <button 
              onClick={closeModal} 
              className="text-gray-500 hover:text-red-500 transition-colors focus:outline-none"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <form
            onSubmit={handleUpdate}
            className="flex flex-col justify-center items-start space-y-6"
          >
            {/* Title Field */}
            <div className="w-full">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Election Title
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 p-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-500 mr-3">
                  <FaHeading className="text-sm" />
                </div>
                <input
                  placeholder="Enter the election title"
                  className="bg-transparent outline-none w-full text-gray-800 text-sm"
                  name="title"
                  value={poll.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Date Pickers Group */}
            <div className="w-full">
              <label className="block text-sm font-medium mb-2 text-gray-700">Election Period</label>
              
              {/* Start Date */}
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">Start Date & Time</label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-500 mr-3">
                    <FaCalendarAlt className="text-sm" />
                  </div>
                  <input
                    className="outline-none w-full text-sm bg-transparent"
                    name="startsAt"
                    type="datetime-local"
                    value={poll.startsAt}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* End Date */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Date & Time</label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-500 mr-3">
                    <FaRegClock className="text-sm" />
                  </div>
                  <input
                    className="outline-none w-full text-sm bg-transparent"
                    name="endsAt"
                    type="datetime-local"
                    value={poll.endsAt}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description Field */}
            <div className="w-full">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Election Description
              </label>
              <div className="flex items-start border border-gray-300 rounded-lg bg-gray-50 p-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-500 mr-3 mt-1">
                  <FaEdit className="text-sm" />
                </div>
                <textarea
                  placeholder="Describe the purpose and rules of this election"
                  className="bg-transparent outline-none w-full text-gray-800 text-sm min-h-[100px] resize-none"
                  name="description"
                  value={poll.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="h-12 w-full rounded-lg font-bold
              transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white
              flex items-center justify-center mt-4"
              type="submit"
            >
              Update Election
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdatePoll
