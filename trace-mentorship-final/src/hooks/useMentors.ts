import { useState, useEffect, useMemo } from "react";
import { mentors as staticMentors, type MentorProfile } from "@/src/data/mentors";
import { subscribeAllMentorProfiles } from "@/src/lib/store";

const staticMentorsMap = new Map<string, MentorProfile>(
  staticMentors.map(m => [m.id, m])
);

let globalDynamicMentors: MentorProfile[] = [];
let globalSubscribers = new Set<(data: MentorProfile[]) => void>();
let isSubscribed = false;

export function useAllMentors() {
  const [dynamicMentors, setDynamicMentors] = useState<MentorProfile[]>(globalDynamicMentors);

  useEffect(() => {
    globalSubscribers.add(setDynamicMentors);
    
    if (!isSubscribed) {
      isSubscribed = true;
      subscribeAllMentorProfiles(
        (data) => {
          globalDynamicMentors = data;
          globalSubscribers.forEach(sub => sub(data));
        },
        (err) => console.error("Error fetching dynamic mentors:", err)
      );
    }
    
    return () => {
      globalSubscribers.delete(setDynamicMentors);
    };
  }, []);

  const allMentors = useMemo(() => {
    if (dynamicMentors.length === 0) return staticMentors;
    
    const dynamicMap = new Map(dynamicMentors.map(m => [m.id, m]));
    const merged = staticMentors.map(m => dynamicMap.has(m.id) ? dynamicMap.get(m.id)! : m);
    
    // Add any new dynamic mentors that weren't in static data
    dynamicMentors.forEach(m => {
      if (!staticMentorsMap.has(m.id)) {
        merged.push(m);
      }
    });
    
    return merged;
  }, [dynamicMentors]);

  return allMentors;
}
