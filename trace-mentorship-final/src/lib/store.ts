import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { getMentorsForDomain, mentors, type MentorProfile } from "@/src/data/mentors";
import { ensureAuth, requireFirebase } from "./firebase";

export interface StudentProfile {
  uid?: string;
  name: string;
  year: string;
  branch: string;
  domain: string;
  goals: string;
  helpNeeded?: string;
  skillLevel?: string;
  skills: string[];
  availability: string;
  mentorStyle?: string;
  readinessScore?: number;
  roadmap?: RoadmapMilestone[];
  insights?: string[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  status: "upcoming" | "active" | "done";
  resources?: string[];
}

export interface MentorTask {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

export interface MentorshipRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentYear: string;
  studentBranch: string;
  studentDomain: string;
  studentGoals: string;
  studentSkills: string[];
  studentAvatar: string;
  mentorId: string;
  status: "pending" | "active" | "archived";
  createdAt: string;
  progress: number;
  roadmap: RoadmapMilestone[];
  tasks: MentorTask[];
}

export interface ChatMessage {
  id: string;
  sender: "student" | "mentor";
  text: string;
  timestamp: number;
}

export async function getStudentId(): Promise<string> {
  const user = await ensureAuth();
  return user.uid;
}

export function calculateReadinessScore(profile: Pick<StudentProfile, "skills" | "goals" | "availability" | "skillLevel">): number {
  const skillPoints = Math.min(profile.skills.length * 7, 35);
  const goalPoints = profile.goals.trim().length > 30 ? 20 : profile.goals.trim().length > 0 ? 12 : 0;
  const availabilityPoints = profile.availability.includes("10+")
    ? 25
    : profile.availability.includes("5-10")
      ? 20
      : profile.availability.includes("3-5")
        ? 15
        : 8;
  const levelPoints = profile.skillLevel?.startsWith("Advanced")
    ? 20
    : profile.skillLevel?.startsWith("Intermediate")
      ? 14
      : 8;
  return Math.min(100, skillPoints + goalPoints + availabilityPoints + levelPoints);
}

export function normalizeRoadmap(items: Partial<RoadmapMilestone>[]): RoadmapMilestone[] {
  return items.slice(0, 6).map((item, index) => ({
    id: item.id || `step_${index + 1}`,
    title: item.title || `Milestone ${index + 1}`,
    status: item.status || (index === 0 ? "active" : "upcoming"),
    resources: item.resources || [],
  }));
}

export async function saveStudentProfile(profile: StudentProfile): Promise<StudentProfile> {
  const { db } = requireFirebase();
  const user = await ensureAuth();
  const saved: StudentProfile = {
    ...profile,
    uid: user.uid,
    readinessScore: calculateReadinessScore(profile),
  };
  await setDoc(
    doc(db, "users", user.uid),
    {
      ...saved,
      role: "student",
      updatedAt: Date.now(),
    },
    { merge: true },
  );
  return saved;
}

export async function saveMentorUser(mentor: MentorProfile): Promise<void> {
  const { db } = requireFirebase();
  await ensureAuth();
  await setDoc(
    doc(db, "users", `mentor_${mentor.id}`),
    {
      role: "mentor",
      mentorId: mentor.id,
      username: mentor.username,
      name: mentor.name,
      domain: mentor.domain,
      updatedAt: Date.now(),
    },
    { merge: true },
  );
}

export function subscribeStudentProfile(
  studentId: string,
  onChange: (profile: StudentProfile | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const { db } = requireFirebase();
  return onSnapshot(
    doc(db, "users", studentId),
    (snap) => onChange(snap.exists() ? (snap.data() as StudentProfile) : null),
    onError,
  );
}

async function getAllActiveMentorships() {
  const { db } = requireFirebase();
  const snap = await getDocs(query(collection(db, "mentorships"), where("status", "!=", "archived")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MentorshipRecord);
}

export async function assignMentorForDomain(domain: string): Promise<MentorProfile> {
  const pool = getMentorsForDomain(domain);
  if (pool.length === 0) return mentors[0];
  const all = await getAllActiveMentorships();
  const counts = pool.map((mentor) => ({
    mentor,
    count: all.filter((record) => record.mentorId === mentor.id).length,
  }));
  counts.sort((a, b) => a.count - b.count);
  return counts[0].mentor;
}

export async function createMentorship(
  studentProfile: StudentProfile,
  mentorId: string,
): Promise<MentorshipRecord> {
  const { db } = requireFirebase();
  const user = await ensureAuth();
  const existing = await getDocs(
    query(
      collection(db, "mentorships"),
      where("studentId", "==", user.uid),
      where("status", "!=", "archived"),
      limit(5),
    ),
  );
  await Promise.all(existing.docs.map((snap) => updateDoc(snap.ref, { status: "archived" })));

  const record = {
    studentId: user.uid,
    studentName: studentProfile.name,
    studentYear: studentProfile.year,
    studentBranch: studentProfile.branch,
    studentDomain: studentProfile.domain,
    studentGoals: studentProfile.goals,
    studentSkills: studentProfile.skills,
    studentAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(studentProfile.name)}`,
    mentorId,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
    progress: 0,
    roadmap: studentProfile.roadmap || [],
    tasks: [],
  };
  const ref = await addDoc(collection(db, "mentorships"), record);
  return { id: ref.id, ...record };
}

export function subscribeMentorshipForStudent(
  studentId: string,
  onChange: (record: MentorshipRecord | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const { db } = requireFirebase();
  return onSnapshot(
    query(
      collection(db, "mentorships"),
      where("studentId", "==", studentId),
      where("status", "!=", "archived"),
      limit(1),
    ),
    (snap) => onChange(snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as MentorshipRecord)),
    onError,
  );
}

export function subscribeMentorshipsForMentor(
  mentorId: string,
  onChange: (records: MentorshipRecord[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const { db } = requireFirebase();
  return onSnapshot(
    query(collection(db, "mentorships"), where("mentorId", "==", mentorId), where("status", "!=", "archived")),
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MentorshipRecord)),
    onError,
  );
}

export async function updateMentorshipStatus(
  recordId: string,
  status: "pending" | "active" | "archived",
): Promise<void> {
  const { db } = requireFirebase();
  await updateDoc(doc(db, "mentorships", recordId), { status });
}

export async function deleteMentorship(recordId: string): Promise<void> {
  const { db } = requireFirebase();
  await deleteDoc(doc(db, "mentorships", recordId));
}

export async function updateRoadmapProgress(recordId: string, roadmap: RoadmapMilestone[]): Promise<void> {
  const { db } = requireFirebase();
  const done = roadmap.filter((item) => item.status === "done").length;
  const progress = roadmap.length ? Math.round((done / roadmap.length) * 100) : 0;
  await updateDoc(doc(db, "mentorships", recordId), { roadmap, progress });
}

export async function addMentorTask(recordId: string, text: string, currentTasks: MentorTask[]): Promise<void> {
  const { db } = requireFirebase();
  const task: MentorTask = {
    id: `task_${Date.now()}`,
    text,
    done: false,
    createdAt: Date.now(),
  };
  await updateDoc(doc(db, "mentorships", recordId), { tasks: [...currentTasks, task] });
}

export function subscribeChatMessages(
  mentorshipId: string,
  onChange: (messages: ChatMessage[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const { db } = requireFirebase();
  return onSnapshot(
    query(collection(db, "mentorships", mentorshipId, "messages"), orderBy("timestamp", "asc")),
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatMessage)),
    onError,
  );
}

export async function addChatMessage(
  mentorshipId: string,
  sender: "student" | "mentor",
  text: string,
): Promise<void> {
  const { db } = requireFirebase();
  await addDoc(collection(db, "mentorships", mentorshipId, "messages"), {
    sender,
    text,
    timestamp: Date.now(),
  });
}
