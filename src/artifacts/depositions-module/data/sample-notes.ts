// Sample notes content for live simulation
export const getSampleNotesContent = (deponentName?: string) => {
  const name = deponentName || 'Martinez';
  
  return `Live Notes - ${name} Deposition - ${new Date().toLocaleDateString()}

Key Observations:
- Defendant seems nervous when discussing phone usage
- Hesitates before answering speed-related questions  
- Story about weather conditions keeps changing
- Good eye contact until traffic light questions come up
- Voice gets quieter when discussing moments before collision

Questions to explore further:
- Exact timeline of phone call vs accident
- Get vehicle computer data for speed verification
- Check weather records for that day
- Ask about glasses/vision - squinting frequently

Strategy notes:
- Focus credibility attack on inconsistencies 
- Phone records will be key evidence
- Defendant's demeanor suggests consciousness of guilt
- Weather contradiction could undermine entire testimony

Follow-up items:
- Subpoena phone carrier records
- Request vehicle diagnostic data
- Get official weather report
- Schedule expert witness on accident reconstruction`;
};