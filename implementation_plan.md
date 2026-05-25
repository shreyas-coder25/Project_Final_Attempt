# Trace Mentorship - Firebase Implementation Plan

This updated plan details the shift to a serverless architecture using Firebase, as requested to save time and streamline development. We will use Firebase for Authentication and Database (Firestore), eliminating the need for a separate Node.js/Express backend.

## User Review Required

> [!IMPORTANT]  
> **Firebase Configuration**: You will need to create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/), enable Authentication (Google Provider), and initialize a Firestore Database. You will then need to provide the Firebase configuration keys to put in the `.env` file.
> 
> **Gemini AI Integration**: Since we are dropping the custom backend, we will keep the Gemini API calls on the frontend for the hackathon demo, or use Firebase Cloud Functions if you prefer to hide the API key. For maximum speed, keeping it on the frontend (as it currently is) is the fastest approach.

## Open Questions

1. Are you okay with keeping the Gemini API call on the frontend for the sake of the hackathon demo speed, or do you want to set up Firebase Cloud Functions to secure the Gemini API key?
2. Do you want me to execute the Firebase setup and write the code directly into your files, or would you prefer I just provide the code snippets for you to copy/paste?

---

## Proposed Changes

### Phase 1: Firebase Authentication & Setup (Current Focus)
* **Setup**: Install the `firebase` npm package.
* **Config**: Create `src/lib/firebase.ts` to initialize the Firebase App, Auth, and Firestore instances using environment variables.
* **Authentication**: 
  * Implement Google Sign-In using `signInWithPopup(auth, googleProvider)`.
  * Update `MentorLogin.tsx` and the `App.tsx` navigation to reflect real authentication states via `onAuthStateChanged`.
  * Save the newly authenticated user's profile to Firestore.

### Phase 2: Firestore Database Migration
We will replace the `localStorage` mock store (`src/lib/store.ts`) with Firestore.

* **Collections**:
  * `users` (Stores student and mentor profiles)
  * `mentorships` (Stores requests and active mentorship links)
  * `messages` (Stores chat history)
* **Real-time Chat**: 
  * Implement `onSnapshot` for real-time chat functionality between Mentor and Student in `MentorChat.tsx`.
* **Data Fetching**:
  * Update logic to fetch available mentors, submit onboarding data, and accept/decline mentorships via Firestore queries.

### Phase 3: AI Roadmap & Branch Expansion
* **AI Roadmap Generator**: Integrate the Gemini prompt into the onboarding flow to generate a personalized roadmap based on the user's selected domain and skills. Save this generated roadmap to the user's Firestore document.
* **Branch Expansion**: Update `domains` and `domainSkills` in `Onboarding.tsx` to include non-tech branches like Civil, Mechanical, and Electrical.

---

## Verification Plan

### Automated Tests
* N/A for this rapid hackathon phase.

### Manual Verification
1. **Google Auth**: Click "Mentor Login" or "Find My Mentor" and successfully authenticate via a Google popup.
2. **Firestore Sync**: Verify that upon completing onboarding, a document is created in the `users` and `mentorships` collections in the Firebase Console.
3. **Real-time Chat**: Have a student and mentor open the chat side-by-side; verify that messages appear instantly using `onSnapshot`.
