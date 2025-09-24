// Enhanced mock data with realistic MVA deposition content

export const mockKeyIssues = [
  { id: 1, text: "Defendant's adherence to traffic laws at intersection", element: "Breach" },
  { id: 2, text: "Impact of weather conditions on visibility and vehicle control", element: "Causation" },
  { id: 3, text: "Cell phone distraction as contributing factor", element: "Breach" },
  { id: 4, text: "Extent of plaintiff's medical treatment and ongoing care needs", element: "Damages" },
];

export const mockDeponents = [
  { 
    id: 1, 
    name: "Jane Doe", 
    role: "Plaintiff", 
    type: "friendly", 
    date: "2024-07-15",
    hasTranscript: false,
    transcriptType: "none"
  },
  { 
    id: 3, 
    name: "Robert Martinez", 
    role: "Defendant Driver", 
    type: "opposing", 
    date: "2024-07-26",
    hasTranscript: true,
    transcriptType: "official"
  }
];

// Enhanced MVA deposition content with realistic contradictions
export const realisticTranscriptContent = [
  { speaker: "ATTORNEY", text: "Can you state your name for the record?", time: "00:15:23" },
  { speaker: "WITNESS", text: "Robert Martinez.", time: "00:15:25" },
  { speaker: "ATTORNEY", text: "And what is your occupation?", time: "00:15:27" },
  { speaker: "WITNESS", text: "I'm a delivery driver.", time: "00:15:30" },
  { speaker: "ATTORNEY", text: "On March 15th, 2024, were you driving southbound on Main Street?", time: "00:16:15" },
  { speaker: "WITNESS", text: "Yes, I was.", time: "00:16:17" },
  { speaker: "ATTORNEY", text: "What was the weather condition at the time of the accident?", time: "00:16:20" },
  { speaker: "WITNESS", text: "It was raining. Pretty heavy rain, actually.", time: "00:16:25" },
  { speaker: "ATTORNEY", text: "Were you familiar with that intersection?", time: "00:16:30" },
  { speaker: "WITNESS", text: "Yes, I drive through there almost every day on my route.", time: "00:16:35" },
  { speaker: "ATTORNEY", text: "What was your approximate speed when approaching the intersection?", time: "00:17:15" },
  { speaker: "WITNESS", text: "I was going about 35 miles per hour, maybe a little less because of the rain.", time: "00:17:20" },
  { speaker: "ATTORNEY", text: "The speed limit on that section of Main Street is 25 miles per hour, correct?", time: "00:17:25" },
  { speaker: "WITNESS", text: "Oh, I thought it was 35. I mean, I was going the speed limit.", time: "00:17:30" },
  { speaker: "ATTORNEY", text: "Let me direct your attention to the traffic light. What color was it when you first saw it?", time: "00:18:45" },
  { speaker: "WITNESS", text: "It was yellow. I thought I could make it through.", time: "00:18:50" },
  { speaker: "ATTORNEY", text: "How far were you from the intersection when you first saw the yellow light?", time: "00:18:55" },
  { speaker: "WITNESS", text: "Maybe 100 feet or so.", time: "00:19:00" },
  { speaker: "ATTORNEY", text: "Were you using your cell phone at any point during your drive that day?", time: "00:22:30" },
  { speaker: "WITNESS", text: "No, I don't use my phone while driving.", time: "00:22:35" },
  { speaker: "ATTORNEY", text: "I'm showing you what's been marked as Exhibit A. These are your cell phone records from March 15th. Do you see the call at 2:47 PM?", time: "00:23:15" },
  { speaker: "WITNESS", text: "Oh, that. Yeah, I did take one quick call from dispatch. But it was hands-free.", time: "00:23:25" },
  { speaker: "ATTORNEY", text: "The call lasted 3 minutes and 42 seconds. That's a quick call?", time: "00:23:30" },
  { speaker: "WITNESS", text: "Well, dispatch had some route changes. I had to pull over to write them down.", time: "00:23:35" },
  { speaker: "ATTORNEY", text: "Earlier you said you didn't use your phone while driving. Were you pulled over when you took this call?", time: "00:23:40" },
  { speaker: "WITNESS", text: "I... well, I was slowing down to pull over when the accident happened.", time: "00:23:45" },
  { speaker: "ATTORNEY", text: "Let's go back to the weather conditions. You said it was raining heavily?", time: "00:25:10" },
  { speaker: "WITNESS", text: "Actually, it was more like a light drizzle when the accident happened.", time: "00:25:15" },
  { speaker: "ATTORNEY", text: "A moment ago you described it as 'pretty heavy rain.' Which is accurate?", time: "00:25:20" },
  { speaker: "WITNESS", text: "Well, the weather was changing. It went from heavy to light, you know?", time: "00:25:25" },
  { speaker: "ATTORNEY", text: "What happened immediately after the collision?", time: "00:26:45" },
  { speaker: "WITNESS", text: "I got out to check on the other driver. She seemed okay, just shaken up.", time: "00:26:50" },
  { speaker: "ATTORNEY", text: "Did you call 911?", time: "00:26:55" },
  { speaker: "WITNESS", text: "Yes, right away.", time: "00:26:57" },
  { speaker: "ATTORNEY", text: "What did you tell the 911 operator?", time: "00:27:00" },
  { speaker: "WITNESS", text: "That there had been an accident at Main and Fifth, and that we needed police and possibly an ambulance.", time: "00:27:05" },
  { speaker: "ATTORNEY", text: "Did you admit fault to anyone at the scene?", time: "00:27:30" },
  { speaker: "WITNESS", text: "No, I just said I was sorry it happened. I mean, anyone would feel bad about an accident.", time: "00:27:35" },
  { speaker: "ATTORNEY", text: "The police report indicates you said 'I didn't see her coming' to Officer Johnson. Do you recall that?", time: "00:27:45" },
  { speaker: "WITNESS", text: "I might have said something like that. I was pretty rattled.", time: "00:27:50" }
];