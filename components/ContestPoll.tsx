import { contestPoll } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { ContestantStruct, PollStruct, RootState } from '@/utils/types'
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import { FaTimes, FaUser, FaSpinner } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { checkWalletConnection } from '@/utils/errorHandler'
import { handleTransaction } from '@/utils/interactionHandler'

const ContestPoll: React.FC<{ poll: PollStruct }> = ({ poll }) => {
  const dispatch = useDispatch()
  const { setContestModal } = globalActions
  const { contestModal, wallet, contestants } = useSelector((states: RootState) => states.globalStates)

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [contestant, setContestant] = useState({
    name: '',
  })
  
  // Check if current user is already a candidate
  const isAlreadyCandidate = React.useMemo(() => {
    if (!wallet || !contestants) return false
    return contestants.some(c => c.voter.toLowerCase() === wallet.toLowerCase())
  }, [wallet, contestants])
  
  // Close modal if user is already a candidate
  useEffect(() => {
    if (isAlreadyCandidate && contestModal === 'scale-100') {
      toast.info('You are already registered as a candidate for this election')
      closeModal()
    }
  }, [isAlreadyCandidate, contestModal])

  // Check if poll voting has started - needed for smart contract validation
  useEffect(() => {
    if (contestModal === 'scale-100' && poll.votes > 0) {
      toast.error('Voting has already begun, cannot register as candidate now')
      closeModal()
    }
  }, [contestModal, poll.votes])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContestant((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Prevent multiple submissions
    if (isSubmitting) return

    // Validate input
    if (!contestant.name) {
      toast.warn('Please enter your name')
      return
    }

    // Check wallet connection
    if (!checkWalletConnection(wallet)) {
      return
    }
    
    // Check if already a candidate
    if (isAlreadyCandidate) {
      toast.warn('You are already registered as a candidate for this election')
      closeModal()
      return
    }

    // Validate poll eligibility
    if (poll.deleted) {
      toast.error('This poll has been deleted')
      closeModal()
      return
    }
    
    // Add back validation for votes to match smart contract restrictions
    if (poll.votes > 0) {
      toast.error('Voting has already begun, cannot register as candidate now')
      closeModal()
      return
    }

    // Make sure the poll hasn't ended
    if (Date.now() > poll.endsAt) {
      toast.error('This poll has already ended')
      closeModal()
      return
    }

    try {
      await toast.promise(
        handleTransaction(async () => {
          return new Promise<void>((resolve, reject) => {
            contestPoll(poll.id, contestant.name)
              .then((tx) => {
                closeModal()
                console.log(tx)
                resolve(tx)
              })
              .catch((error) => {
                console.error("Transaction error:", error)
                
                // Extract error message from blockchain errors
                let errorMessage = 'Transaction failed'
                
                if (error.message && error.message.includes('Poll has votes already')) {
                  errorMessage = 'Voting has already begun, cannot register as candidate now'
                } else if (error.message && error.message.includes('Poll not found')) {
                  errorMessage = 'Poll does not exist or has been deleted'
                } else if (error.message && error.message.includes('already registered')) {
                  errorMessage = 'You are already registered as a candidate'
                } else if (error.data && error.data.message) {
                  errorMessage = error.data.message
                } else if (typeof error === 'string') {
                  errorMessage = error
                } else if (error.message) {
                  errorMessage = error.message
                }
                
                reject(errorMessage)
              })
          })
        }, setIsSubmitting),
        {
          pending: 'Approve transaction...',
          success: 'Candidate added successfully 👌',
          error: {
            render: ({ data }) => {
              return typeof data === 'string' ? data : 'Transaction failed'
            }
          }
        }
      )
    } catch (error) {
      console.error("Error handling registration:", error)
    }
  }

  const closeModal = () => {
    dispatch(setContestModal('scale-0'))
    setContestant({
      name: '',
    })
    setIsSubmitting(false)
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
              disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button
              className={`h-12 w-full rounded-lg font-bold
                transition-all duration-300 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white
                flex items-center justify-center`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Register as Candidate'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContestPoll
