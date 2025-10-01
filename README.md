AI Interview Assistant

Getting Started

1. Install Node 18+.
2. Install dependencies:
   npm install
3. Run the app:
   npm run dev
4. Open the printed local URL.

Features

- Interviewee tab: upload resume (PDF/DOCX), missing-field prompts, timed 6-question interview (2 easy, 2 medium, 2 hard), autosubmit when time runs out.
- Interviewer tab: dashboard with sortable list, search, and candidate detail modal with chat history, scores, and summary.
- Persistence with redux-persist so refresh restores progress; welcome-back notice surfaces unfinished sessions.

Notes

- PDF parsed with pdfjs, DOCX with mammoth. Field extraction uses simple regex heuristics.
- No external AI API is required; questions and summary are generated locally.

