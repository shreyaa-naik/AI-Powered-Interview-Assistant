import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  text: string
  difficulty: Difficulty
  answerKeywords: string[]
  referenceAnswer: string
}

export interface AnswerEntry {
  questionId: string
  answer: string
  timeTakenSec: number
  score: number
}

export interface CandidateProfile {
  name?: string
  email?: string
  phone?: string
  resumeText?: string
}

export interface SessionState {
  profile: CandidateProfile
  currentQuestionIndex: number
  questions: Question[]
  answers: AnswerEntry[]
  status: 'idle' | 'collecting' | 'in_progress' | 'completed'
  lastActiveAt?: number
}

const initialState: SessionState = {
  profile: {},
  currentQuestionIndex: 0,
  questions: [],
  answers: [],
  status: 'idle',
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    resetSession: () => initialState,
    setProfile(state, action: PayloadAction<Partial<CandidateProfile>>) {
      state.profile = { ...state.profile, ...action.payload }
      state.lastActiveAt = Date.now()
    }
    ,
    setQuestions(state, action: PayloadAction<Question[]>) {
      state.questions = action.payload
      state.currentQuestionIndex = 0
      state.answers = []
      state.status = 'in_progress'
      state.lastActiveAt = Date.now()
    },
    addAnswer(state, action: PayloadAction<AnswerEntry>) {
      state.answers.push(action.payload)
      state.currentQuestionIndex = Math.min(
        state.currentQuestionIndex + 1,
        Math.max(state.questions.length - 1, 0)
      )
      state.lastActiveAt = Date.now()
    },
    setStatus(state, action: PayloadAction<SessionState['status']>) {
      state.status = action.payload
      state.lastActiveAt = Date.now()
    },
  },
})

export const { resetSession, setProfile, setQuestions, addAnswer, setStatus } = sessionSlice.actions
export default sessionSlice.reducer


