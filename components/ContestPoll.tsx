import { contestPoll } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { PollStruct, RootState } from '@/utils/types'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { FaTimes, FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const ContestPoll: React.FC<{ poll: PollStruct }> = ({ poll }) => {
  const dispatch = useDispatch()
  const { setContestModal } = globalActions
  const { contestModal } = useSelector((states: RootState) => states.globalStates)

  const [contestant, setContestant] = useState({
    name: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContestant((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!contestant.name) return

    await toast.promise(
      new Promise<void>((resolve, reject) => {
        contestPoll(poll.id, contestant.name)
          .then((tx) => {
            closeModal()
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Candidate added successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const closeModal = () => {
    dispatch(setContestModal('scale-0'))
    setContestant({
      name: '',
    })
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-80 transform z-50 transition-transform duration-300 ${contestModal}`}
    >
      <div className="bg-white text-gray-800 shadow-xl shadow-blue-500/20 rounded-xl w-11/12 md:w-1/3 max-w-md p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="font-bold text-2xl text-blue-600">Become a Candidate</h2>
            <button 
              onClick={closeModal} 
              className="text-gray-500 hover:text-red-500 transition-colors focus:outline-none"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-start space-y-6"
          >
            <div className="w-full">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Candidate Name
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 p-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-500 mr-3">
                  <FaUser className="text-sm" />
                </div>
                <input
                  placeholder="Enter your full name"
                  className="bg-transparent outline-none w-full text-gray-800 text-sm"
                  name="name"
                  value={contestant.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              className="h-12 w-full rounded-lg font-bold
                transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white
                flex items-center justify-center"
              type="submit"
            >
              Register as Candidate
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContestPoll
