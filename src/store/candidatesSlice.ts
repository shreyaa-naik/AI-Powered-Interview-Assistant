import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AnswerEntry, CandidateProfile, Question } from './sessionSlice'

export interface CandidateRecord {
  id: string
  profile: CandidateProfile
  answers: AnswerEntry[]
  questions: Question[]
  score: number
  summary: string
  createdAt: number
}

interface CandidatesState {
  list: CandidateRecord[]
}

const initialState: CandidatesState = {
  list: [],
}

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: {
      reducer(state, action: PayloadAction<CandidateRecord>) {
        state.list.push(action.payload)
      },
      prepare(payload: Omit<CandidateRecord, 'id' | 'createdAt'>) {
        return { payload: { ...payload, id: nanoid(), createdAt: Date.now() } }
      },
    },
  },
})

export const { addCandidate } = candidatesSlice.actions
export default candidatesSlice.reducer


