<div align="center">
  <img width="1200" height="475" alt="Trace Mentorship Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>Trace Mentorship Platform</h1>
  <p><strong>A production-grade, dynamic, and realistic communication ecosystem connecting students and industry mentors.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-6.2.3-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Gemini_2.0-Flash-8E75B2?style=for-the-badge&logo=google" alt="Gemini API" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  </p>
</div>

---

## 📌 Comprehensive Overview

**Trace Mentorship** is an advanced, fully interactive mentorship platform meticulously engineered to provide a **realistic hackathon demonstration**. 

Many hackathon projects rely on hardcoded "mock" data, automated fake replies, or pre-seeded activity to look fully featured. **Trace takes a different approach.** It eliminates all fake seeding. Instead, it features a purely manual, interactive, and persistent two-way messaging and relational system. 

The application starts in a clean, empty state and builds dynamically through actual user interactions. By utilizing a custom-built local relational engine, mentorship matches, chat histories, and student requests **persist perfectly** between different windows and tabs, allowing evaluators and users to test both the Student and Mentor roles simultaneously in real-time.

---

## 🏗️ Core Architecture & Philosophy

### Real-Time Backend (`src/lib/store.ts` & `src/lib/firebase.ts`)
To achieve production-grade realism and true multi-device synchronization, Trace uses **Firebase Firestore** and **Firebase Authentication**. 
- It maintains relational links between a `studentId` and `mentorId` through `MentorshipRecord` objects stored in Firestore.
- It provides real-time CRUD operations for mentorships: `createMentorship`, `updateMentorshipStatus`, `deleteMentorship`.
- It handles complex operations like **Load-Balanced Mentor Matching**: When a student picks a domain, the system queries all mentors in that domain, counts their active mentees, and automatically assigns the mentor with the lowest workload.
- **Cross-Device Synchronization**: Because it relies on Firestore's real-time listeners, a user can open the Student Dashboard on one device and the Mentor Dashboard on another. Actions taken by the student (like sending a message) are instantaneously synchronized and visible to the mentor.

### 🧠 Gemini AI Integration (`src/lib/gemini.ts`)
Trace deeply integrates **Google's Gemini 2.0 Flash** via the `@google/genai` SDK to serve as an intelligent assistant bridging the gap between mentor sessions.
1. **Dynamic Roadmaps**: The `generateRoadmap` function takes the student's selected domain, current skills, goals, and weekly availability, and generates a precise JSON array of 6 customized learning milestones.
2. **Learning Insights**: The `generateLearningInsights` function prompts Gemini to act as an expert and provide 3 highly specific, non-generic productivity or technical tips based strictly on the student's profile.
3. **Match Explanation**: `generateMentorMatchExplanation` writes a personalized 2-3 sentence paragraph explaining exactly why the load-balanced mentor is the perfect fit for the student's specific goals.

---

## 🔄 User Workflows & Features

### 🎓 The Student Workflow
1. **Landing & Exploration**: Students browse 7 detailed technical domains (Web Dev, AI/ML, Data Science, Cybersecurity, App Dev, Systems/DevOps, Placements/DSA).
2. **Onboarding**: Students complete a multi-step onboarding form, inputting their Year, Branch, specific Domain, primary Goal, current technical Skills, and Time Commitment.
3. **Smart Matching**: The system assigns a mentor using the load-balancing algorithm. The mentorship is created in a `pending` state.
4. **Dashboard (Awaiting)**: The student sees their assigned mentor's profile (rating, bio, average response time) but must wait for the mentor to accept.
5. **AI Companion**: While waiting, the student can use the "AI Learning Companion" to ask questions and generate their custom Gemini roadmap.
6. **Active Mentorship**: Once the mentor accepts, the real-time `MentorChat` component unlocks, allowing two-way persistent messaging.

### 👨‍🏫 The Mentor Workflow
Trace allows users to act as mentors and manages real-time interactions with students.
1. **Authentication**: Mentors authenticate using Firebase Authentication (e.g., Google Sign-In) and complete an onboarding flow (`/mentor/onboarding`) to create their professional profile.
2. **Requests Inbox**: The mentor's dashboard listens in real-time via Firestore for new `MentorshipRecord` objects in the `pending` state.
3. **Review & Action**: The mentor reviews the student's profile, skills, and goals. They can **Accept** or **Decline** the request.
4. **Mentees Management**: Accepted students move to the "Active Mentees" tab.
5. **Live Chat**: The mentor can open the chat panel to reply to student messages, assign roadmap tasks, or eventually **Archive** the mentorship when complete.

---

## 🎨 UI/UX & Design System

Trace uses a highly polished, modern design language:
- **Framework**: React 19 for concurrent rendering and modern hook paradigms.
- **Styling**: **Tailwind CSS v4** is used for utility-first styling. The UI heavily relies on a clean `neutral` palette, subtle borders, and soft shadows.
- **Animations**: **Framer Motion** powers smooth layout transitions, modal fade-ins, toast notifications, and interactive hover states.
- **Icons & Avatars**: Uses **Lucide React** for consistent, beautiful SVG iconography, and **DiceBear API** to dynamically generate unique avatars for students based on their names.
- **Responsive**: Fully responsive mobile-first design, featuring an off-canvas mobile menu and a sticky bottom navigation for mobile chat.

---

## 🚀 Technical Setup & Local Development

Follow these exact steps to run the Trace Mentorship platform locally on your machine.

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9 or higher)

### Installation
1. **Clone or Extract the Repository:**
   Navigate into the project directory:
   ```bash
   cd trace-mentorship-final
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory (you can copy `.env.example`). You must provide a Google Gemini API Key for the AI features and your Firebase configuration. Get a Gemini API key for free at [Google AI Studio](https://aistudio.google.com/apikey).
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will boot up (typically at `http://localhost:3000` or `http://localhost:5173`).

---

## 🧪 How to Demo the Platform (For Evaluators)

To experience the full capability of the relational local engine and the two-way messaging, follow this exact testing path:

1. **Open Window A (Student)**: Go to `http://localhost:3000`. Click **Sign In** and authenticate. Complete the student onboarding form (e.g., choose "AI / ML"). Once submitted, you'll be assigned a mentor or wait in the pending state.
2. **Open Window B (Mentor)**: Open an incognito window or a different browser, and go to `http://localhost:3000/login`. Authenticate with a different Google account.
3. **Onboard as Mentor**: Complete the mentor onboarding at `/mentor/onboarding`. Ensure you select the domain that matches the student's request in step 1.
4. **Accept Request**: Navigate to the Mentor Dashboard. You will see the pending request from the student profile. Click **Accept**.
5. **Watch the Sync**: Look back at Window A. Instantly via Firestore, the student dashboard will automatically update from "Pending" to "Active", unlocking the chat interface.
6. **Chat**: Send a message from Window A. See it appear in Window B in real-time. Reply from Window B. See it appear in Window A.

---

## 📂 Deep-Dive Directory Structure

```text
trace-mentorship-final/
├── public/                 # Static assets (favicons, etc.)
├── src/
│   ├── components/         
│   │   ├── ui/             # Generic UI components (Button, Card, Inputs)
│   │   ├── AssistantChat.tsx # Gemini-powered AI chat interface
│   │   └── MentorChat.tsx  # The real-time, 2-way human chat interface
│   ├── data/               
│   │   └── mentors.ts      # The database of 26 Mentors and 7 Domains
│   ├── lib/                
│   │   ├── gemini.ts       # Google GenAI integration and prompt engineering
│   │   ├── store.ts        # The core LocalStorage Relational Engine
│   │   └── utils.ts        # Tailwind merge (clsx, twMerge) utilities
│   ├── pages/              
│   │   ├── mentor/         
│   │   │   ├── Dashboard.tsx # Mentor interface (Requests, Mentees, Settings)
│   │   │   └── Login.tsx     # Mentor authentication
│   │   ├── student/        
│   │   │   ├── Dashboard.tsx # Student interface (Status, AI, Mentor Chat)
│   │   │   └── Onboarding.tsx# Multi-step data collection form
│   │   ├── DomainDetail.tsx  # Dynamic pages outlining domain roadmaps
│   │   └── Landing.tsx       # Marketing landing page with testimonials
│   ├── App.tsx             # React Router configuration & Header Shell
│   ├── index.css           # Tailwind base layers and custom animations
│   └── main.tsx            # React application mount point
├── .env.example            # Template for environment variables
├── package.json            # Scripts and dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite bundler configuration
```

---

## 📜 License & Acknowledgements
- **License**: Apache-2.0 License. See the [LICENSE](LICENSE) file for details.
- Built for demonstrating complex frontend state management, AI integration, and robust UI/UX principles in modern web development.
