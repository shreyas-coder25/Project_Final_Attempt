import { getCallable } from "./firebase";
import { normalizeRoadmap, type RoadmapMilestone } from "./store";

interface StudentContext {
  domain?: string;
  skills?: string[];
  goals?: string;
  availability?: string;
}

export async function generateRoadmap(
  domain: string,
  skills: string[],
  goals: string,
  availability: string,
): Promise<RoadmapMilestone[]> {
  const call = getCallable<StudentContext, { roadmap: RoadmapMilestone[] }>("generateRoadmap");
  const result = await call({ domain, skills, goals, availability });
  return normalizeRoadmap(result.data.roadmap || []);
}

export async function generateLearningInsights(
  domain: string,
  skills: string[],
  goals: string,
): Promise<string[]> {
  const call = getCallable<StudentContext, { insights: string[] }>("generateLearningInsights");
  const result = await call({ domain, skills, goals });
  return result.data.insights || [];
}

export async function assistantReply(
  studentProfile: StudentContext,
  message: string,
): Promise<string> {
  const call = getCallable<StudentContext & { message: string }, { reply: string }>("assistantReply");
  const result = await call({ ...studentProfile, message });
  return result.data.reply || "I could not generate a response right now.";
}
