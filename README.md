# AI-Powered Interview Assistant (Crisp Internship Assignment)

This project is a full-featured, AI-powered interview simulator built using **React** and **Vite**. It provides a synchronized two-tab interface for the **Interviewee** (chat) and the **Interviewer** (dashboard), complete with local data persistence and dynamic question generation.

## ✨ Features

### Interviewee (Chat)
* **Resume Upload & Parsing:** Supports **PDF** (required) and **DOCX** (optional) for initial profile setup.
* **Profile Extraction:** Automatically extracts **Name, Email, and Phone**. Chatbot prompts the candidate to fill any missing fields before the interview starts.
* **Timed Interview Flow:**
    * **Dynamic Questions:** AI generates **random, unique questions** for a **Full Stack (React/Node)** role.
    * **6 Questions Total:** 2 Easy, 2 Medium, 2 Hard.
    * **Question Timers:** Easy (20s), Medium (60s), Hard (120s).
    * **Auto-Submit:** Answers are submitted automatically when the timer runs out.
    * **Final Score & Summary:** AI calculates a final score and generates a short candidate summary upon completion.
* **Persistence:** Uses `redux-persist` to save all progress locally. Sessions are fully restored on refresh/reopen, displaying a **"Welcome Back" modal** for unfinished sessions.

### Interviewer (Dashboard)
* **Candidate List:** Shows all candidates, primarily sorted by **Final AI Score**.
* **Detailed View:** Clicking a candidate shows their full **chat history** (Q&A), profile, and AI scores for each question.
* **Search & Sort:** Functionality to search candidates by name/email and sort by score/date.
* **Data Management:**
    * **Export Candidate Data:** Ability to **export** a candidate's full profile and assessment data as a **CSV file**.
    * **Clear Data:** Option to **clear/reset all local candidate data**.

---

## ⚙️ Tech Stack & Architecture

| Category | Technology/Library | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React** (Vite) | Core UI development framework. |
| **State/Data** | **Redux Toolkit** & **`redux-persist`** | State management and local persistence of all session data. |
| **Styling** | **Tailwind CSS** / **shadcn/ui** | Clean, responsive, and modern UI components. |
| **AI/NLP** | **OpenAI API** (or similar) | Dynamic question generation, answer grading, and summary creation. |
| **File Parsing** | `pdf-parse` / `mammoth` | Resume data extraction. |

---

## 🚀 Getting Started

### Prerequisites

* Node.js (LTS version)
* npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/shreyaa-naik/AI-Powered-Interview-Assistant.git](https://github.com/shreyaa-naik/AI-Powered-Interview-Assistant.git)
    cd AI-Powered-Interview-Assistant
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the App

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
2.  Open your browser to the printed local URL (e.g., `http://localhost:5173`).

### Deployment

The project is configured for static site deployment.

1.  **Build for production:**
    ```bash
    npm run build
    ```
2.  The optimized static files will be placed in the **`dist`** folder. This is the directory you should upload or specify as the **Publish directory** on Netlify/Vercel.

---

