# Final AI Integration Plan

This plan finalizes the AI integration, connecting the AI-generated roadmaps seamlessly between the mentee and the mentor.

## Goal
To make the AI-generated roadmap a collaborative tool between the student and mentor, rather than an isolated feature.

## Proposed Changes

### 1. Student to Mentor: Sharing the Roadmap
#### [MODIFY] [src/pages/student/Roadmap.tsx](file:///c:/Users/Shreyas/OneDrive/AIML%20Projects/MLSC%20Mini%20Hackathon/trace-mentorship-final/src/pages/student/Roadmap.tsx)
- Implement `onSendToMentor`.
- When clicked, it will find the student's active mentorship (via `getStudentMentorships`).
- It will automatically send a chat message to the mentor: *"I've generated my AI learning roadmap! Please review it."*
- Show a success toast or update the button state to "Sent for Approval".

### 2. Mentor Side: Viewing the Student's Roadmap
#### [NEW] [src/pages/mentor/StudentRoadmap.tsx](file:///c:/Users/Shreyas/OneDrive/AIML%20Projects/MLSC%20Mini%20Hackathon/trace-mentorship-final/src/pages/mentor/StudentRoadmap.tsx)
- Create a read-only view for the mentor to see the student's AI-generated roadmap.
- This will reuse the existing `<RoadmapView />` component, but with interactive editing disabled.

#### [MODIFY] [src/App.tsx](file:///c:/Users/Shreyas/OneDrive/AIML%20Projects/MLSC%20Mini%20Hackathon/trace-mentorship-final/src/App.tsx)
- Add a new route `/mentor/student-roadmap/:studentId` pointing to the new `StudentRoadmap` page.

#### [MODIFY] [src/pages/mentor/Dashboard.tsx](file:///c:/Users/Shreyas/OneDrive/AIML%20Projects/MLSC%20Mini%20Hackathon/trace-mentorship-final/src/pages/mentor/Dashboard.tsx)
- In the "Active Mentees" list, add a **"View Roadmap"** button next to the "Chat" button.
- This allows mentors to quickly inspect the AI roadmap and guide the student accordingly.

### 3. Polish the AI Generator Prompt
#### [MODIFY] [src/lib/gemini.ts](file:///c:/Users/Shreyas/OneDrive/AIML%20Projects/MLSC%20Mini%20Hackathon/trace-mentorship-final/src/lib/gemini.ts)
- Ensure the prompt for `generatePersonalizedRoadmap` includes engaging, real-world context and returns high-quality NPTEL / Coursera / YouTube resources.
- Currently, the prompt is solid but can be refined to ensure the `estimatedHours` and `skills` are highly realistic.

## Verification Plan

### Automated Tests
- Run `npm run build` and `npx tsc --noEmit` to verify type safety.

### Manual Verification
1. **Student:** Generates a new roadmap and clicks "Send to Mentor for Approval".
2. **Student Chat:** Verifies the automated message appears in the chat.
3. **Mentor Dashboard:** Mentor clicks "View Roadmap" on the mentee's card and sees the read-only generated roadmap.
4. **Mentor Chat:** Mentor sees the automated message and can reply directly.

## Open Questions

> [!IMPORTANT]  
> **Mentor Editing**  
> Should the mentor be able to edit the student's roadmap (e.g., adding/removing milestones), or should it remain read-only for the mentor and they just provide feedback via chat?  
> *Recommendation:* Keep it read-only for now and let them discuss changes in the chat to keep the scope manageable and collaborative.
