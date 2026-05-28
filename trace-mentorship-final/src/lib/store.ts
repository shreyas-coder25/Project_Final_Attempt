import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
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
import { auth, ensureAuth, requireFirebase } from "./firebase";

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

export function getStudentId(): string {
  return auth?.currentUser?.uid || "temp_student_id";
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
      ...mentor, // save full profile
      role: "mentor",
      updatedAt: Date.now(),
    },
    { merge: true },
  );
}

export async function saveMentorProfile(profile: MentorProfile): Promise<MentorProfile> {
  const { db } = requireFirebase();
  await ensureAuth();
  await setDoc(
    doc(db, "users", `mentor_${profile.id}`),
    {
      ...profile,
      role: "mentor",
      updatedAt: Date.now(),
    },
    { merge: true },
  );
  return profile;
}

export function subscribeMentorProfile(
  mentorId: string,
  onUpdate: (data: MentorProfile | null) => void,
  onError: (err: any) => void
) {
  const { db } = requireFirebase();
  return onSnapshot(
    doc(db, "users", `mentor_${mentorId}`),
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as MentorProfile);
      } else {
        onUpdate(null);
      }
    },
    onError
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

export async function getStudentProfile(studentId: string): Promise<StudentProfile | null> {
  const { db } = requireFirebase();
  const snap = await getDoc(doc(db, "users", studentId));
  return snap.exists() ? (snap.data() as StudentProfile) : null;
}

export async function getMentorProfile(mentorId: string): Promise<MentorProfile | null> {
  const { db } = requireFirebase();
  const snap = await getDoc(doc(db, "users", `mentor_${mentorId}`));
  return snap.exists() ? (snap.data() as MentorProfile) : null;
}

async function getAllActiveMentorships() {
  const { db } = requireFirebase();
  const snap = await getDocs(query(collection(db, "mentorships"), where("status", "!=", "archived")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MentorshipRecord);
}

export function assignMentorForDomain(domain: string): MentorProfile {
  const pool = getMentorsForDomain(domain);
  if (pool.length === 0) return mentors[0];
  return pool[0];
}

export async function createMentorship(
  studentProfile: Pick<StudentProfile, "name" | "year" | "branch" | "domain" | "goals" | "skills"> & Partial<StudentProfile>,
  mentorId: string,
): Promise<MentorshipRecord> {
  const { db } = requireFirebase();
  const user = await ensureAuth();
  const existing = await getDocs(
    query(collection(db, "mentorships"), where("studentId", "==", user.uid))
  );
  const activeDocs = existing.docs.filter((doc) => doc.data().status !== "archived");
  await Promise.all(activeDocs.map((snap) => updateDoc(snap.ref, { status: "archived" })));

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
    query(collection(db, "mentorships"), where("studentId", "==", studentId)),
    (snap) => {
      const active = snap.docs.filter((d) => d.data().status !== "archived");
      if (active.length === 0) {
        onChange(null);
      } else {
        onChange({ id: active[0].id, ...active[0].data() } as MentorshipRecord);
      }
    },
    onError,
  );
}

/**
 * @deprecated This is a mock stub. Use subscribeMentorshipForStudent() instead for real-time Firestore integration.
 */
export function getMentorshipForStudent(): MentorshipRecord | null {
  return null;
}

export function subscribeMentorshipsForMentor(
  mentorId: string,
  onChange: (records: MentorshipRecord[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const { db } = requireFirebase();
  return onSnapshot(
    query(collection(db, "mentorships"), where("mentorId", "==", mentorId)),
    (snap) => {
      const active = snap.docs.filter((d) => d.data().status !== "archived");
      onChange(active.map((d) => ({ id: d.id, ...d.data() }) as MentorshipRecord));
    },
    onError,
  );
}

/**
 * @deprecated This is a mock stub. Use subscribeMentorshipsForMentor() instead for real-time Firestore integration.
 */
export function getMentorshipsForMentor(_mentorId: string): MentorshipRecord[] {
  return [];
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

/**
 * @deprecated This is a mock stub. Use subscribeChatMessages() instead for real-time Firestore integration.
 */
export function getChatMessages(_mentorId: string, _studentId: string): ChatMessage[] {
  return [];
}

export async function addChatMessage(
  mentorshipId: string,
  sender: "student" | "mentor",
  text: string,
): Promise<void>;
export async function addChatMessage(
  mentorId: string,
  studentId: string,
  sender: "student" | "mentor",
  text: string,
): Promise<void>;
export async function addChatMessage(
  idOrMentorId: string,
  senderOrStudentId: "student" | "mentor" | string,
  textOrSender: string,
  maybeText?: string,
): Promise<void> {
  const { db } = requireFirebase();
  const mentorshipId = maybeText ? `${idOrMentorId}_${senderOrStudentId}` : idOrMentorId;
  const sender = (maybeText ? textOrSender : senderOrStudentId) as "student" | "mentor";
  const text = maybeText || textOrSender;
  await addDoc(collection(db, "mentorships", mentorshipId, "messages"), {
    sender,
    text,
    timestamp: Date.now(),
  });
}
