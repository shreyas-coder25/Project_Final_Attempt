import { useState, useEffect, useMemo } from "react";
import { mentors as staticMentors, type MentorProfile } from "@/src/data/mentors";
import { subscribeAllMentorProfiles } from "@/src/lib/store";

export function useAllMentors() {
  const [dynamicMentors, setDynamicMentors] = useState<MentorProfile[]>([]);

  useEffect(() => {
    const unsub = subscribeAllMentorProfiles(
      (data) => setDynamicMentors(data),
      (err) => console.error("Error fetching dynamic mentors:", err)
    );
    return () => unsub();
  }, []);

  const allMentors = useMemo(() => {
    const map = new Map<string, MentorProfile>();
    // 1. Add static mentors
    staticMentors.forEach(m => map.set(m.id, m));
    // 2. Override/add dynamic mentors
    dynamicMentors.forEach(m => map.set(m.id, m));
    return Array.from(map.values());
  }, [dynamicMentors]);

  return allMentors;
}
