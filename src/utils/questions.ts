import type { Question } from '../store/sessionSlice'

type Q = Omit<Question, 'id'>

const EASY: Q[] = [
  { text: 'Explain virtual DOM in React and its benefits.', difficulty: 'easy', answerKeywords: ['virtual dom', 'diff', 'reconcile', 'efficient', 'update'], referenceAnswer: 'The virtual DOM is an in-memory representation of the UI. React diffs virtual trees and applies minimal updates to the real DOM, making updates efficient.' },
  { text: 'What are React hooks?', difficulty: 'easy', answerKeywords: ['state', 'effect', 'hook', 'useState', 'useEffect'], referenceAnswer: 'Hooks are functions that let function components use React features like state and lifecycle (e.g., useState, useEffect).'},
  { text: 'What is JSX?', difficulty: 'easy', answerKeywords: ['syntax', 'javascript', 'xml', 'transpile', 'react.createElement'], referenceAnswer: 'JSX is a syntax extension that compiles to React.createElement calls; it looks like HTML in JavaScript.' },
]

const MEDIUM: Q[] = [
  { text: 'How does Node.js handle concurrency?', difficulty: 'medium', answerKeywords: ['event loop', 'non-blocking', 'async', 'libuv', 'callbacks', 'promises'], referenceAnswer: 'Node uses an event loop with non-blocking I/O (backed by libuv) and offloads work to thread pools; callbacks/promises/async-await schedule tasks.' },
  { text: 'How would you paginate and cache API results in React?', difficulty: 'medium', answerKeywords: ['pagination', 'cache', 'memo', 'query', 'infinite', 'offset', 'cursor'], referenceAnswer: 'Use server pagination (offset/cursor) with a client cache (React Query) and memoization; implement next/prev or infinite scrolling.' },
  { text: 'Describe how to manage global state in large React apps.', difficulty: 'medium', answerKeywords: ['redux', 'context', 'store', 'slice', 'selector', 'persist'], referenceAnswer: 'Use Redux Toolkit slices/selectors for performance and structure; persist critical state and split by domain.' },
]

const HARD: Q[] = [
  { text: 'Implement a debounce function and explain its use in React.', difficulty: 'hard', answerKeywords: ['debounce', 'delay', 'setTimeout', 'trailing', 'leading', 'performance'], referenceAnswer: 'Debounce delays a function until after a pause; in React it reduces re-renders on fast inputs (e.g., search). Implement with setTimeout clearing previous timers.' },
  { text: 'Design an auth system with JWT refresh flow in a SPA.', difficulty: 'hard', answerKeywords: ['jwt', 'refresh', 'access token', 'httpOnly', 'rotate', 'expiry'], referenceAnswer: 'Issue short-lived access tokens and long-lived refresh tokens (httpOnly). Refresh on 401/expiry, rotate refresh tokens, and revoke on logout.' },
  { text: 'How would you code-split and lazy-load routes and components?', difficulty: 'hard', answerKeywords: ['dynamic import', 'lazy', 'suspense', 'bundle', 'split', 'route'], referenceAnswer: 'Use dynamic import with React.lazy and Suspense, split by route and component to reduce initial bundle size.' },
]

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

export function generateRandomQuestions(): Question[] {
  const selected: Q[] = [
    ...pickRandom(EASY, 2),
    ...pickRandom(MEDIUM, 2),
    ...pickRandom(HARD, 2),
  ]
  return selected.map((q, idx) => ({ id: String(idx + 1), ...q }))
}

export function scoreAnswerByKeywords(answer: string, question: Question): number {
  const a = answer.toLowerCase()
  const hits = question.answerKeywords.reduce((c, kw) => (a.includes(kw) ? c + 1 : c), 0)
  const base = question.difficulty === 'easy' ? 10 : question.difficulty === 'medium' ? 20 : 30
  const keywordScore = Math.min(base, hits * Math.ceil(base / 3))
  const lengthBonus = Math.min(10, Math.floor(answer.split(/\s+/).length / 15))
  return Math.max(0, keywordScore + lengthBonus)
}


