import type { ContradictionItem, KeyIssueImpact } from '../types/deposition-types';

// Sample contradictions to be detected during live simulation
export const sampleContradictions: ContradictionItem[] = [
  {
    id: 'contradiction_1',
    title: 'Speed Testimony Inconsistency (Internal)',
    content: 'Speed claim: "25 mph, the speed limit"',
    citation: { timeRange: '02:33', page: 2, line: 12, context: 'Q: So you were traveling at 25 mph? A: Yes, that\'s right. The speed limit.' },
    timestamp: new Date(Date.now() - 3600000),
    followUp: 'Cross-examine on specific speed. Request vehicle computer data if available.',
    severity: 'high',
    automated: true,
    mode: 'live',
    contradictionType: 'internal',
    contradictoryTestimony: '04:42 / Page 3:19: "might have been going 35, maybe 40"'
  },
  {
    id: 'contradiction_2',
    title: 'Weather Description vs Meteorological Data (External)',
    content: 'Weather claim: "clear and sunny, perfect visibility"',
    citation: { timeRange: '00:53', page: 1, line: 13, context: 'Q: Can you describe the weather conditions that day? A: It was... well, it was clear. Clear and sunny, perfect visibility.' },
    timestamp: new Date(Date.now() - 2400000),
    followUp: 'Present weather service records and police report as exhibits. Use in closing for credibility argument.',
    severity: 'high',
    automated: false,
    mode: 'live',
    contradictionType: 'external',
    contradictoryTestimony: 'Police Report.pdf p.3 - "road surface wet, 0.2" rainfall recorded"'
  },
  {
    id: 'contradiction_3',
    title: 'Phone Usage Denial vs Records (External)',
    content: 'Phone usage claim: "I never use my phone while driving, ever"',
    citation: { timeRange: '04:14', page: 3, line: 11, context: 'Q: Were you using your cell phone at any point before the accident? A: No, I never use my phone while driving. That\'s dangerous.' },
    timestamp: new Date(Date.now() - 1800000),
    followUp: 'Present phone records as exhibit. Subpoena carrier for detailed call logs.',
    severity: 'high',
    automated: false,
    mode: 'live',
    contradictionType: 'external',
    contradictoryTestimony: 'Phone Records.pdf p.1 - 3-min call ended 2:50 PM vs 911 call 2:50:30 PM'
  }
];

// Sample key issue impacts to be analyzed from transcript
export const sampleKeyIssueImpacts: KeyIssueImpact[] = [
  {
    id: 'helps_1',
    type: 'helps',
    title: 'Admits Speeding at Intersection',
    content: 'Defendant admits driving 35 mph in 25 mph zone approaching intersection: "I was going about 35 miles per hour, maybe a little less because of the rain."',
    citation: { timeRange: '17:20', page: 2, line: 20, context: 'Q: What was your approximate speed when approaching the intersection? A: I was going about 35 miles per hour, maybe a little less because of the rain.' },
    timestamp: new Date(Date.now() - 2100000),
    severity: 'high',
    automated: false,
    mode: 'live',
    issueId: '1' // Adherence to traffic laws
  },
  {
    id: 'helps_2',
    type: 'helps',
    title: 'Phone Distraction During Driving',
    content: 'After confronted with phone records, defendant admits taking 3:42 call while driving: "Well, I was slowing down to pull over when the accident happened."',
    citation: { timeRange: '23:45', page: 3, line: 15, context: 'Q: Earlier you said you didn\'t use your phone while driving. Were you pulled over when you took this call? A: I... well, I was slowing down to pull over when the accident happened.' },
    timestamp: new Date(Date.now() - 1500000),
    severity: 'high',
    automated: false,
    mode: 'live',
    issueId: '3' // Cell phone distraction
  },
  {
    id: 'helps_3',
    type: 'helps',
    title: 'Weather Impacted Visibility',
    content: 'Defendant admits weather conditions affected visibility: "I didn\'t see her coming" during rainy conditions.',
    citation: { timeRange: '27:50', page: 4, line: 8, context: 'Q: The police report indicates you said "I didn\'t see her coming" to Officer Johnson. Do you recall that? A: I might have said something like that. I was pretty rattled.' },
    timestamp: new Date(Date.now() - 1200000),
    severity: 'high',
    automated: false,
    mode: 'live',
    issueId: '2' // Weather conditions impact
  },
  {
    id: 'helps_4',
    type: 'helps',
    title: 'Knew Phone Use Violated Traffic Safety',
    content: 'Defendant acknowledges company policy against phone use while driving, showing awareness that cell phone use compromises driving safety.',
    citation: { timeRange: '22:35', page: 3, line: 5, context: 'Q: Were you using your cell phone at any point during your drive that day? A: No, I don\'t use my phone while driving. Company policy.' },
    timestamp: new Date(Date.now() - 1800000),
    severity: 'medium',
    automated: false,
    mode: 'live',
    issueId: '3' // Cell phone distraction
  },
  {
    id: 'helps_5',
    type: 'helps',
    title: 'Violated Traffic Light Law',
    content: 'Defendant admits proceeding through yellow light from 100 feet away: "It was yellow. I thought I could make it through."',
    citation: { timeRange: '18:50', page: 2, line: 25, context: 'Q: Let me direct your attention to the traffic light. What color was it when you first saw it? A: It was yellow. I thought I could make it through.' },
    timestamp: new Date(Date.now() - 1650000),
    severity: 'high',
    automated: false,
    mode: 'live',
    issueId: '1' // Traffic laws adherence
  },
  {
    id: 'harms_1',
    type: 'harms',
    title: 'Weather Defense Argument',
    content: 'Defendant suggests changing weather conditions contributed to accident: "Well, the weather was changing. It went from heavy to light, you know?"',
    citation: { timeRange: '25:25', page: 4, line: 2, context: 'Q: A moment ago you described it as "pretty heavy rain." Which is accurate? A: Well, the weather was changing. It went from heavy to light, you know?' },
    timestamp: new Date(Date.now() - 1200000),
    severity: 'medium',
    automated: false,
    mode: 'live',
    issueId: '2' // Weather conditions impact
  }
];