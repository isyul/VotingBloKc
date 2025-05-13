import { createPoll } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { PollParams, RootState } from '@/utils/types'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { FaTimes, FaCalendarAlt, FaRegClock, FaEdit, FaUsers, FaUserPlus, FaTrash } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

// Student council positions
const POSITIONS = [
  { id: 'president', title: 'President', multiSelect: false, description: 'The President serves as the primary representative of the student body.' },
  { id: 'int_vp', title: 'Internal Vice President', multiSelect: false, description: 'The Internal VP manages internal affairs and committees.' },
  { id: 'ext_vp', title: 'External Vice President', multiSelect: false, description: 'The External VP represents the council to external organizations.' },
  { id: 'sec_gen', title: 'Secretary General', multiSelect: false, description: 'The Secretary General maintains records and handles correspondence.' },
  { id: 'treasurer', title: 'Treasurer', multiSelect: false, description: 'The Treasurer manages the council budget and finances.' },
  { id: 'auditor', title: 'Auditor', multiSelect: false, description: 'The Auditor reviews financial records and ensures transparency.' },
  { id: 'senators', title: 'Senators', multiSelect: true, maxSelect: 5, description: 'Senators represent the general student population in council meetings.' },
]

// Interface for a candidate
interface Candidate {
  id: string;
  name: string;
  position: string;
}

// Interface for election setup
interface ElectionSetup {
  title: string;
  startsAt: string;
  endsAt: string;
  description: string;
  positions: string[]; // IDs of selected positions
  candidates: Candidate[];
}

const CreatePoll: React.FC = () => {
  const dispatch = useDispatch()
  const { setCreateModal } = globalActions
  const { createModal } = useSelector((states: RootState) => states.globalStates)

  // State for selected positions and candidates
  const [election, setElection] = useState<ElectionSetup>({
    title: 'Student Council Election',
    description: 'Vote for your student council representatives.',
    startsAt: '',
    endsAt: '',
    positions: [],
    candidates: []
  })

  // State for candidate being added
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    position: ''
  })

  // Handle toggling a position
  const togglePosition = (positionId: string) => {
    setElection(prev => {
      if (prev.positions.includes(positionId)) {
        // Remove position and its candidates
        return {
          ...prev,
          positions: prev.positions.filter(id => id !== positionId),
          candidates: prev.candidates.filter(c => c.position !== positionId)
        }
      } else {
        // Add position
        return {
          ...prev,
          positions: [...prev.positions, positionId]
        }
      }
    })
  }

  // Handle adding a candidate
  const addCandidate = () => {
    if (!newCandidate.name || !newCandidate.position) return;

    setElection(prev => ({
      ...prev,
      candidates: [
        ...prev.candidates, 
        { 
          id: `${newCandidate.position}_${Date.now()}`, 
          name: newCandidate.name, 
          position: newCandidate.position 
        }
      ]
    }))

    // Reset new candidate form
    setNewCandidate({ name: '', position: '' })
  }

  // Handle removing a candidate
  const removeCandidate = (candidateId: string) => {
    setElection(prev => ({
      ...prev,
      candidates: prev.candidates.filter(c => c.id !== candidateId)
    }))
  }

  // Handle form field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setElection(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle candidate form changes
  const handleCandidateChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewCandidate(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      if (!election.title || !election.description || !election.startsAt || !election.endsAt) {
        toast.error("Please fill in all required fields")
        return
      }

      if (election.positions.length === 0) {
        toast.error("Please select at least one position")
        return
      }

      if (election.candidates.length === 0) {
        toast.error("Please add at least one candidate")
        return
      }

      // Prepare positions and candidates data for the description
      const positionsData = election.positions.map(posId => {
        const position = POSITIONS.find(p => p.id === posId)!
        const positionCandidates = election.candidates
          .filter(c => c.position === posId)
          .map(c => c.name)
          .join(", ")
        
        return `${position.title}: ${positionCandidates}`
      }).join("\n\n")

      // Create a shorter description to avoid potential issues with large data
      const baseDescription = election.description.substring(0, 100); // Limit base description length
      const fullDescription = `${baseDescription}\n\n== Positions ==\n\n${positionsData.substring(0, 500)}`; // Limit total description
      
      console.log("Description length:", fullDescription.length);
      
      // Validate date formats
      const startDate = new Date(election.startsAt)
      const endDate = new Date(election.endsAt)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        toast.error("Invalid date format. Please select valid dates.")
        return
      }

      // Ensure the timestamps are not too far in the future to avoid numerical issues
      const now = Date.now();
      const oneYearFromNow = now + (365 * 24 * 60 * 60 * 1000);
      
      const startTime = Math.min(startDate.getTime(), oneYearFromNow);
      const endTime = Math.min(endDate.getTime(), oneYearFromNow);

      // Create poll parameters
      const pollParams: PollParams = {
        title: election.title.substring(0, 50), // Limit title length
        description: fullDescription,
        startsAt: startTime,
        endsAt: endTime
      }

      console.log("Creating election with params:", {
        title: pollParams.title,
        descriptionLength: pollParams.description.length,
        startsAt: new Date(pollParams.startsAt).toISOString(),
        endsAt: new Date(pollParams.endsAt).toISOString()
      });

      await toast.promise(
        new Promise<void>((resolve, reject) => {
          createPoll(pollParams)
            .then((tx) => {
              closeModal()
              console.log("Transaction successful:", tx)
              resolve(tx)
              // Redirect to event poll page upon success
              window.location.href = '/elections';
            })
            .catch((error) => {
              console.error("Transaction failed:", error)
              reject(error)
            })
        }),
        {
          pending: 'Preparing election...',
          success: 'Election created successfully 👌',
          error: 'Transaction failed. Please try again.',
        }
      )
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  const closeModal = () => {
    dispatch(setCreateModal('scale-0'))
    // Reset form
    setElection({
      title: 'Student Council Election',
      description: 'Vote for your student council representatives.',
      startsAt: '',
      endsAt: '',
      positions: [],
      candidates: []
    })
    setNewCandidate({ name: '', position: '' })
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-80 transform z-50 transition-transform duration-300 ${createModal}`}
    >
      <div className="bg-white text-gray-800 shadow-xl shadow-blue-500/20 rounded-xl w-11/12 md:w-3/4 lg:w-3/5 max-w-5xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center mb-6 border-b border-gray-200 pb-4 sticky top-0 bg-white z-10">
            <h2 className="font-bold text-2xl text-blue-600">Create Student Council Election</h2>
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
            {/* Basic Election Info Section */}
            <div className="w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Election Information</h3>
              
              {/* Title Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Election Title
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 p-3">
                  <input
                    className="bg-transparent outline-none w-full text-gray-800 text-sm"
                    name="title"
                    value={election.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Election Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Election Description
                </label>
                <div className="flex items-start border border-gray-300 rounded-lg bg-gray-50 p-3">
                  <textarea
                    className="bg-transparent outline-none w-full text-gray-800 text-sm min-h-[80px] resize-none"
                    name="description"
                    value={election.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Date Pickers Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Start Date & Time</label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-500 mr-3">
                      <FaCalendarAlt className="text-sm" />
                    </div>
                    <input
                      className="outline-none w-full text-sm bg-transparent"
                      name="startsAt"
                      type="datetime-local"
                      value={election.startsAt}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">End Date & Time</label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-500 mr-3">
                      <FaRegClock className="text-sm" />
                    </div>
                    <input
                      className="outline-none w-full text-sm bg-transparent"
                      name="endsAt"
                      type="datetime-local"
                      value={election.endsAt}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Positions Section */}
            <div className="w-full border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUsers className="mr-2 text-blue-500" /> 
                Student Council Positions
              </h3>
              
              <div className="mb-4 text-sm text-gray-600">
                Select the positions that will be included in this election.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {POSITIONS.map(position => (
                  <div 
                    key={position.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      election.positions.includes(position.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => togglePosition(position.id)}
                  >
                    <div className="font-medium text-gray-800">{position.title}</div>
                    {position.multiSelect && (
                      <div className="text-xs text-blue-600 mt-1">
                        Select up to {position.maxSelect} candidates
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">{position.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Candidates Section */}
            {election.positions.length > 0 && (
              <div className="w-full border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUserPlus className="mr-2 text-blue-500" /> 
                  Add Candidates
                </h3>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Candidate Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Enter candidate's full name"
                        value={newCandidate.name}
                        name="name"
                        onChange={handleCandidateChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Position
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={newCandidate.position}
                        name="position"
                        onChange={handleCandidateChange}
                      >
                        <option value="">Select a position</option>
                        {election.positions.map(posId => {
                          const position = POSITIONS.find(p => p.id === posId)!
                          return (
                            <option key={posId} value={posId}>
                              {position.title}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    onClick={addCandidate}
                  >
                    Add Candidate
                  </button>
                </div>
                
                {/* Candidates List */}
                {election.candidates.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Current Candidates</h4>
                    
                    <div className="border border-gray-200 rounded-lg divide-y">
                      {election.positions.map(posId => {
                        const position = POSITIONS.find(p => p.id === posId)!
                        const posCandidates = election.candidates.filter(c => c.position === posId)
                        
                        if (posCandidates.length === 0) return null
                        
                        return (
                          <div key={posId} className="p-3">
                            <div className="font-medium text-blue-600 mb-2">{position.title}</div>
                            <div className="space-y-2">
                              {posCandidates.map(candidate => (
                                <div key={candidate.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <span>{candidate.name}</span>
                                  <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => removeCandidate(candidate.id)}
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="w-full pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-medium
                transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white
                flex items-center justify-center"
              >
                Create Student Council Election
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePoll
