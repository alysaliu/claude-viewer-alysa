// Contradiction detection data for enhanced AI analysis

export const contradictionTypes = [
  { 
    type: 'Weather Conditions', 
    text: 'Witness described weather as "heavy rain," then "light drizzle," then "clear and sunny"', 
    severity: 'high' as const,
    followUp: 'Review weather reports from March 15th to establish actual conditions'
  },
  { 
    type: 'Cell Phone Usage', 
    text: 'Initially denied texting, then admitted to sending text 3 minutes before collision', 
    severity: 'high' as const,
    followUp: 'Examine complete phone records and GPS data for distracted driving evidence'
  },
  { 
    type: 'Vehicle Speed', 
    text: 'Speed estimates vary from 25 mph (company report) to 35-40 mph (testimony)', 
    severity: 'medium' as const,
    followUp: 'Review accident reconstruction and skid mark analysis'
  },
  { 
    type: 'Traffic Light Color', 
    text: 'Testimony shifted from "yellow" to "maybe just turned red" when confronted with camera evidence', 
    severity: 'high' as const,
    followUp: 'Obtain traffic camera footage to establish actual light sequence'
  },
  { 
    type: 'Prior Accidents', 
    text: 'Initially denied any prior accidents, then revealed 2022 fender-bender', 
    severity: 'medium' as const,
    followUp: 'Request complete driving and employment records from Quick Delivery Inc.'
  },
  { 
    type: 'Timeline Inconsistency', 
    text: 'Phone records show text sent at 2:47 PM, contradicts earlier testimony about phone usage', 
    severity: 'high' as const,
    followUp: 'Cross-reference all electronic evidence with witness timeline'
  }
];