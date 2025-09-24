import type { Message } from '../types/drafting-types';

export const mockTabMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      type: 'user',
      content: 'Can you help me analyze the medical records for the Garcia MVA case? I need to understand the extent of injuries and treatment timeline.',
      timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
    },
    {
      id: 2,
      type: 'assistant',
      content: 'I\'ve reviewed Mr. Garcia\'s medical records from the accident. Here\'s a comprehensive analysis:\n\n**Initial Injuries (Day of Accident)**\n• Cervical spine strain (whiplash)\n• Lower back contusion\n• Minor lacerations on forearm\n• Mild concussion symptoms\n\n**Treatment Timeline:**\n• Emergency room visit: CT scan, X-rays normal\n• Physical therapy: 12 weeks (3x/week initially)\n• Pain management: 6 months with Dr. Williams\n• MRI at 3 months showed disc bulging at L4-L5\n\n**Current Status:**\n• Ongoing lower back pain (4/10 severity)\n• Limited range of motion\n• Unable to return to construction work\n\nThe medical evidence supports significant ongoing impairment affecting his ability to work. Total medical costs: $47,832.',
      timestamp: new Date(Date.now() - 86400000 * 2 + 120000), // 2 days ago + 2 minutes
    },
    {
      id: 3,
      type: 'user',
      content: 'What\'s the prognosis and likelihood of permanent disability?',
      timestamp: new Date(Date.now() - 86400000 * 2 + 300000), // 2 days ago + 5 minutes
    },
    {
      id: 4,
      type: 'assistant',
      content: 'Based on Dr. Martinez\'s independent medical examination and the 8-month treatment history:\n\n**Prognosis:**\n• Cervical strain: Good recovery (90% resolved)\n• Lumbar disc bulge: Guarded prognosis\n• Chronic pain syndrome: Likely permanent\n\n**Disability Assessment:**\n• 15-20% permanent partial disability rating expected\n• Unable to perform heavy lifting (construction work)\n• May require career retraining\n• Future medical care needs: $15,000-25,000\n\n**Supporting Evidence:**\n• Functional capacity evaluation shows significant limitations\n• Pain management specialist recommends ongoing treatment\n• Vocational expert confirms inability to return to previous work\n\nThis supports a strong claim for permanent disability and future wage loss.',
      timestamp: new Date(Date.now() - 86400000 * 2 + 480000), // 2 days ago + 8 minutes
    }
  ],
  2: [
    {
      id: 5,
      type: 'user',
      content: 'I need help calculating damages for the Garcia case. Can you break down past and future economic losses?',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: 6,
      type: 'assistant',
      content: 'Here\'s a comprehensive damage calculation for Mr. Garcia:\n\n**Past Economic Losses:**\n• Medical expenses: $47,832\n• Lost wages (8 months): $52,000\n  - Construction worker: $6,500/month\n  - Total time off work: 8 months\n• Property damage: $8,500 (vehicle)\n**Past Economic Total: $108,332**\n\n**Future Economic Losses:**\n• Future medical care: $20,000 (conservative estimate)\n• Lost earning capacity: $280,000\n  - Current age: 34, work life expectancy: 31 years\n  - Reduced to light duty work ($3,500/month vs $6,500)\n  - Annual loss: $36,000\n  - Present value: $280,000 (using 3% discount rate)\n**Future Economic Total: $300,000**\n\n**Non-Economic Damages:**\n• Pain and suffering: $150,000-200,000\n• Loss of enjoyment of life: $75,000-100,000\n\n**Total Claim Value: $633,332 - $708,332**',
      timestamp: new Date(Date.now() - 86400000 + 180000), // 1 day ago + 3 minutes
    }
  ],
  3: [
    {
      id: 7,
      type: 'user',
      content: 'We need to prepare our expert witnesses for deposition. What key points should Dr. Martinez focus on?',
      timestamp: new Date(Date.now() - 43200000), // 12 hours ago
    },
    {
      id: 8,
      type: 'assistant',
      content: '**Expert Witness Preparation - Dr. Martinez (Orthopedic Surgeon)**\n\n**Key Testimony Points:**\n1. **Mechanism of Injury**\n   - Rear-end collision consistent with reported injuries\n   - Explain how whiplash and lumbar trauma occur\n\n2. **Medical Causation**\n   - Clear connection between accident and disc bulging\n   - Rule out pre-existing conditions\n   - Timeline supports accident causation\n\n3. **Permanency Assessment**\n   - 15-20% permanent partial disability rating\n   - Ongoing pain management needs\n   - Functional limitations well-documented\n\n4. **Future Care Needs**\n   - Conservative estimate: $20,000\n   - May need injections, physical therapy\n   - Potential for surgery if conservative treatment fails\n\n**Potential Challenges:**\n• Defense may argue pre-existing arthritis\n• Counter with: no prior complaints or treatment\n• Emphasize: accident accelerated natural wear\n\n**Documents to Review:**\n• All medical records and imaging\n• Functional capacity evaluation\n• Pain management notes',
      timestamp: new Date(Date.now() - 43200000 + 240000), // 12 hours ago + 4 minutes
    },
    {
      id: 9,
      type: 'user',
      content: 'What about the vocational expert testimony?',
      timestamp: new Date(Date.now() - 43200000 + 600000), // 12 hours ago + 10 minutes
    },
    {
      id: 10,
      type: 'assistant',
      content: '**Vocational Expert Preparation - Sarah Thompson, CRC**\n\n**Key Testimony Areas:**\n\n1. **Pre-Injury Earning Capacity**\n   - Construction worker: $78,000/year\n   - 15 years experience, skilled carpenter\n   - Strong work history, no gaps in employment\n\n2. **Post-Injury Limitations**\n   - No lifting over 25 pounds\n   - Cannot work at heights\n   - Limited bending/twisting\n   - Sedentary to light duty work only\n\n3. **Job Market Analysis**\n   - Available positions: office work, light assembly\n   - Realistic wage: $35,000-42,000/year\n   - Wage loss: $36,000-43,000/year\n\n4. **Retraining Needs**\n   - Computer skills training: 6-12 months\n   - Cost: $8,000-12,000\n   - Success depends on motivation and aptitude\n\n**Potential Defense Arguments:**\n• "He can find other work"\n• Counter: Limited options at his age/education level\n• Geographic limitations in rural area\n\n**Supporting Data:**\n• Labor market surveys\n• Wage data from Bureau of Labor Statistics\n• Employer interviews about accommodation',
      timestamp: new Date(Date.now() - 43200000 + 720000), // 12 hours ago + 12 minutes
    }
  ]
};

export const mockChatTabs = [
  { id: 1, name: 'Medical Records Review', isDocumentTab: false, associatedJobId: null },
  { id: 2, name: 'Damage Calculations', isDocumentTab: false, associatedJobId: null },
  { id: 3, name: 'Expert Witness Prep', isDocumentTab: false, associatedJobId: null },
  { id: 4, name: 'New Chat', isDocumentTab: false, associatedJobId: null, createdFrom: 'ai-assistant' as const }
];