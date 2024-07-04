import { createPoll } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { PollParams, RootState } from '@/utils/types'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const CreatePoll: React.FC = () => {
  const dispatch = useDispatch()
  const { setCreateModal } = globalActions
  const { createModal } = useSelector((states: RootState) => states.globalStates)

  const [poll, setPoll] = useState<PollParams>({
    title: '',
    description: '',
    startsAt: '',
    endsAt: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!poll.title || !poll.description || !poll.startsAt || !poll.endsAt) return

    poll.startsAt = new Date(poll.startsAt).getTime()
    poll.endsAt = new Date(poll.endsAt).getTime()

    await toast.promise(
      new Promise<void>((resolve, reject) => {
        createPoll(poll)
          .then((tx) => {
            closeModal()
            console.log(tx)
            resolve(tx)
            // Replace with your redirection logic
            window.location.href = '/events'; // Redirect to event poll page upon success
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Poll created successfully 👌',
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
    dispatch(setCreateModal('scale-0'))
    setPoll({

      title: '',
      description: '',
      startsAt: '',
      endsAt: '',
    })
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-80 transform z-50 transition-transform duration-300 ${createModal}`}
    >
      <div className="bg-[#D1D5DC] text-[#151515] shadow-lg shadow-[#17A34A] rounded-xl w-11/12 md:w-2/6 h-7/12 p-8">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-[25px]">Add Event</p>
            <button onClick={closeModal} className="border-0 bg-transparent focus:outline-none">
              <FaTimes />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-start rounded-xl mt-5 mb-5"
          >
            <div className="py-4 w-full border border-[#151515] rounded-full flex items-center px-4 mb-3 mt-2">
              <input
                placeholder="Event Title"
                className="bg-transparent outline-none w-full placeholder-[#151515] text-sm"
                name="title"
                value={poll.title}
                onChange={handleChange}
                required
              />
            </div>

            <div
              className="py-4 w-full border border-[#151515] rounded-full
              flex items-center px-4 mb-3 mt-2 space-x-2 relative"
            >
              <span
                className="bg-[#0B4426] bg-opacity-40 text-[#ffff]
                absolute left-[2.5px] py-3 rounded-full px-5 w-48"
              >
                <span className="text-transparent">.</span>
              </span>
              <input
                className="bg-transparent outline-none w-full placeholder-transparent text-sm"
                name="startsAt"
                type="datetime-local"
                placeholder="Start Date"
                value={poll.startsAt}
                onChange={handleChange}
                required
              />
            </div>

            <div
              className="py-4 w-full border border-[#151515] rounded-full
              flex items-center px-4 mb-3 mt-2 space-x-2 relative"
            >
              <span
                className="bg-[#0B4426] bg-opacity-40 text-[#fff]
                absolute left-[2.5px] py-3 rounded-full px-5 w-48"
              >
                <span className="text-transparent">.</span>
              </span>
              <input
                className="bg-transparent outline-none w-full placeholder-[#151515] text-sm"
                name="endsAt"
                type="datetime-local"
                value={poll.endsAt}
                onChange={handleChange}
                required
              />
            </div>

            <div className="py-4 w-full border border-[#151515] rounded-xl flex items-center px-4 h-20 mt-2">
              <textarea
                placeholder="Event Description"
                className="bg-transparent outline-none w-full placeholder-[#151515] text-sm"
                name="description"
                value={poll.description}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="h-[48px] w-full block mt-2 px-3 rounded-full text-sm font-bold
              transition-all duration-300 bg-[#17A34A] hover:bg-green-400"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePoll
