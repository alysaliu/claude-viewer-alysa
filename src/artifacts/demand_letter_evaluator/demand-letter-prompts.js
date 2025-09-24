// Realistic demand letter section prompts for evaluation testing

export const DEMAND_LETTER_PROMPTS = {
  // Introduction & Liability Statement prompts
  "Introduction & Liability Statement": {
    original: `You are drafting the introduction and liability section of a personal injury demand letter. Based on the incident report and initial investigation, write a clear statement establishing liability.

Include:
- Date, time, and location of incident
- Clear statement of defendant's negligence
- Causal connection between negligence and injuries
- Professional but assertive tone

Use the provided facts to craft 2-3 paragraphs that establish the foundation for the demand.`,

    modified: `Draft the introduction and liability section for a personal injury demand letter. Establish fault clearly while remaining factual and professional.

Requirements:
- State facts chronologically with specific dates/times when available
- Identify specific negligent acts or omissions
- Avoid speculation - only include facts supported by evidence
- If details are unclear or disputed, note: "Based on available evidence" or similar qualifier
- Maintain professional tone throughout
- End with clear statement linking defendant's actions to client's damages

Length: 2-3 focused paragraphs that set the foundation for the entire demand.`
  },

  // Incident Facts prompts
  "Incident Facts": {
    original: `Write a detailed account of the incident for a demand letter. Present the facts in chronological order, focusing on the defendant's negligent actions and how they caused the incident.

Include all relevant details about:
- Weather and road conditions
- Traffic patterns and signals
- Actions of all parties involved
- Witness observations
- Physical evidence at scene

Write in third person, past tense. Be thorough but concise.`,

    modified: `Create a factual narrative of the incident for inclusion in a demand letter. Present events chronologically with precision and objectivity.

Guidelines:
- Use specific times, dates, and locations when documented
- Describe observable actions and conditions objectively  
- Include relevant environmental factors (weather, lighting, traffic)
- Reference police reports, witness statements, or photos when citing facts
- If information is incomplete or contradictory, acknowledge: "According to [source]" or "Initial reports indicate"
- Avoid legal conclusions - present facts that allow reader to draw inferences
- Use neutral language while clearly establishing the sequence of events

Focus on creating a clear, factual foundation that supports the liability argument without overstatement.`
  },

  // Medical Summary prompts  
  "Medical Summary": {
    original: `Extract medical procedures and treatments from the records and list them in the demand letter with dates when available. Focus on major procedures, surgeries, and ongoing treatments that demonstrate the severity of injuries.

Include:
- All surgical procedures with dates
- Major diagnostic tests (MRI, CT scans, etc.)
- Specialist consultations
- Physical therapy and rehabilitation
- Current treatment status

Present in chronological order with clear medical terminology.`,

    modified: `Summarize medical treatment from provided records for demand letter inclusion. Be precise and factual about all medical interventions.

Requirements:
- List treatments chronologically with exact dates when documented
- Include ALL procedures: surgical, diagnostic, and therapeutic
- If no major procedures occurred, explicitly state: "Treatment consisted of conservative care only" or "No surgical intervention was required"
- For missing or unclear dates, note: "Date unclear from records" or "Approximately [timeframe]"
- Include current treatment status and prognosis when documented
- Use proper medical terminology while remaining accessible
- Distinguish between completed and ongoing treatments
- If records are incomplete, note limitations: "Based on available medical records" 

Ensure accuracy - do not assume or extrapolate treatments not clearly documented in the provided records.`
  },

  // Damages & Financial Losses prompts
  "Damages & Financial Losses": {
    original: `Calculate and present all economic damages for the demand letter. Include past medical expenses, lost wages, and future costs. Use specific dollar amounts with supporting documentation.

Categories to cover:
- Past medical expenses (itemized)
- Lost wages and benefits
- Future medical costs
- Property damage
- Other economic losses

Present totals clearly with backup documentation references.`,

    modified: `Compile economic damages for the demand letter with precise documentation and clear categorization.

Structure:
1. Past Medical Expenses - itemize by provider with dates and amounts
2. Lost Income - calculate based on documented wage loss with pay period details
3. Future Medical Costs - include only when supported by medical opinion
4. Property Damage - actual repair/replacement costs with estimates
5. Other Economic Losses - transportation, home care, etc. with receipts

Standards:
- Include only documented expenses with backup available
- Use exact amounts from bills/statements when available
- For estimates, clearly label as such and provide basis
- If documentation is incomplete, note: "Additional expenses may be identified upon full record review"
- Provide subtotals for each category and clear total
- Reference supporting documentation (e.g., "See Exhibit A - Medical Bills")
- Include tax implications for lost wages when applicable

Avoid speculation about future costs unless specifically supported by medical professional recommendations.`
  },

  // Settlement Demand prompts
  "Settlement Demand": {
    original: `State the settlement demand amount and provide justification. Include both economic and non-economic damages. Be firm but reasonable in the demand amount.

Components:
- Total economic damages
- Pain and suffering calculation
- Justification for non-economic damages
- Clear demand amount
- Timeline for response

End with professional but firm language about the demand.`,

    modified: `Present the settlement demand with clear justification and professional presentation.

Structure:
1. Economic Damages Summary (reference detailed breakdown above)
2. Non-Economic Damages Justification
   - Nature and extent of injuries
   - Impact on daily activities and quality of life
   - Duration of recovery/ongoing limitations
   - Age and life expectancy considerations
3. Total Settlement Demand

Requirements:
- Provide specific dollar amount for total demand
- Justify non-economic damages with concrete examples of impact
- Avoid arbitrary multipliers unless explaining methodology
- Reference medical testimony or records supporting pain/suffering claims
- Include reasonable timeline for response (typically 30 days)
- Professional tone that conveys seriousness without hostility
- Note that demand reflects current known damages - reserve right to modify if additional damages discovered

End with clear call to action and contact information for response.`
  },

  // Closing & Signature prompts
  "Closing & Signature": {
    original: `Write a professional closing for the demand letter. Reiterate the demand amount, set response timeline, and include appropriate signatures and attachments list.

Include:
- Restatement of demand amount
- Response deadline
- Consequences of non-response
- Attorney signature block
- List of attachments/exhibits

Maintain professional but firm tone.`,

    modified: `Create a professional closing that reinforces the demand and establishes clear next steps.

Elements:
1. Brief restatement of total demand amount
2. Specific response deadline (typically 30 days from date)
3. Professional statement of intent if no response received
4. Contact information for settlement discussions  
5. Attorney signature block with credentials
6. Exhibit/attachment list

Tone Guidelines:
- Professional and businesslike
- Firm but not threatening
- Leave door open for negotiation while showing resolve
- Avoid ultimatums unless litigation is imminent
- Include statement preserving all legal rights
- Reference statute of limitations awareness without specific threats

Standard closing should invite dialogue while making clear the seriousness of the claim and client's commitment to pursuing full compensation.`
  }
};

// Case type datasets for testing
export const CASE_TYPE_DATASETS = {
  mva: {
    name: "Motor Vehicle Accidents",
    description: "Car accidents, truck collisions, motorcycle crashes",
    caseCount: 25,
    selected: true
  },
  premisesLiability: {
    name: "Premises Liability", 
    description: "Slip and fall, inadequate security, property defects",
    caseCount: 18,
    selected: false
  },
  medicalMalpractice: {
    name: "Medical Malpractice",
    description: "Surgical errors, misdiagnosis, medication mistakes",
    caseCount: 15,
    selected: false
  },
  productLiability: {
    name: "Product Liability",
    description: "Defective products, design flaws, inadequate warnings",
    caseCount: 12,
    selected: false
  },
  workplaceInjury: {
    name: "Workplace Injuries",
    description: "Construction accidents, industrial injuries, third-party claims",
    caseCount: 20,
    selected: false
  },
  dogBites: {
    name: "Dog Bites & Animal Attacks",
    description: "Dog attacks, animal bites, owner liability",
    caseCount: 8,
    selected: false
  }
};

// Modifier configurations with 3-way toggle
export const MODIFIERS = {
  flaggedCases: {
    label: "Flagged Cases",
    description: "Previously identified problematic cases",
    defaultValue: "include" // include, only, exclude
  },
  edgeCases: {
    label: "Edge Cases", 
    description: "No procedures, missing dates, unclear medical records",
    defaultValue: "include" // include, only, exclude
  }
};

// Available AI models for evaluation
export const AVAILABLE_MODELS = {
  "gpt-4o": {
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Latest GPT-4 Optimized model",
    isCurrent: false,
    advancedParams: {
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0
    }
  },
  "gpt-4.1": {
    name: "GPT-4.1",
    provider: "OpenAI", 
    description: "Enhanced GPT-4.1 model",
    isCurrent: false,
    advancedParams: {
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0
    }
  },
  "gpt-5": {
    name: "GPT-5",
    provider: "OpenAI",
    description: "Next-generation GPT model", 
    isCurrent: false,
    advancedParams: {
      temperature: 0.7,
      maxTokens: 8000,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0
    }
  },
  "claude-sonnet-4": {
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    description: "Latest Claude Sonnet model",
    isCurrent: true,
    advancedParams: {
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1.0
    }
  }
};

// Evaluation comparison types
export const COMPARISON_TYPES = {
  changeModel: {
    label: "Change Model",
    description: "Compare performance across different AI models",
    icon: "🤖"
  },
  changePrompt: {
    label: "Change Prompt", 
    description: "Compare original prompt vs modified prompt",
    icon: "📝"
  }
};

// Removed legacy TEST_DATASETS - no longer needed