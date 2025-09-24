import { Blueprint, Resource } from '../types/blueprint-types';
import { FileText, Plus, Users, Calendar, FileCheck, Database, AlertCircle, DollarSign } from 'lucide-react';

export const sampleBlueprints: Blueprint[] = [
  {
    id: 1,
    name: 'Demand Letter - MVA',
    creator: 'Sarah Chen',
    dateCreated: '2024-08-10',
    lastModified: '2024-08-14',
    description: 'Motor vehicle accident demand letter template',
    sectionCount: 7,
    sections: [
      {
        id: 1,
        name: 'Introduction',
        tag: 'SEC_INTRO',
        isExpanded: true,
        steps: [
          {
            id: 1,
            type: 'text',
            content: 'We represent [CLIENT_NAME] in connection with the motor vehicle accident that occurred on [ACCIDENT_DATE] at [ACCIDENT_LOCATION]. This letter serves as formal notice of our client\'s claim and demand for settlement.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 2,
        name: 'Incident Description',
        tag: 'SEC_INCIDENT',
        isExpanded: true,
        steps: [
          {
            id: 2,
            type: 'resource',
            resourceId: 'chronology',
            action: 'append',
            parameters: {
              event_types: ['Incident'],
              format: 'Narrative'
            }
          }
        ]
      },
      {
        id: 3,
        name: 'Liability',
        tag: 'SEC_LIABILITY',
        isExpanded: true,
        steps: [
          {
            id: 3,
            type: 'text',
            content: 'The facts clearly establish that your insured was negligent and solely responsible for this motor vehicle collision.',
            action: 'append',
            parameters: {}
          },
          {
            id: 4,
            type: 'resource',
            resourceId: 'chronology',
            action: 'append',
            parameters: {
              event_types: ['Incident'],
              format: 'Narrative'
            }
          },
          {
            id: 5,
            type: 'prompt',
            prompt: 'Analyze the police report for liability factors. Include specific citations to the police report, witness statements, traffic violations, and any admissions of fault. Focus on establishing clear negligence.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 4,
        name: 'Medical Treatment',
        tag: 'SEC_MEDICAL',
        isExpanded: true,
        steps: [
          {
            id: 6,
            type: 'resource',
            resourceId: 'medical_records',
            action: 'append',
            parameters: {
              record_types: ['Emergency Room Reports', 'Discharge Summaries', 'Progress Notes'],
              include_diagnoses: true
            }
          },
          {
            id: 7,
            type: 'prompt',
            prompt: 'Focus on motor vehicle accident injuries. Highlight emergency treatment, ongoing therapy, and prognosis. Emphasize the connection between the collision and all injuries.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 5,
        name: 'Damages - Pain and Suffering',
        tag: 'SEC_PAIN_SUFFERING',
        isExpanded: true,
        steps: [
          {
            id: 8,
            type: 'prompt',
            prompt: 'Describe the client\'s pain and suffering from the motor vehicle accident, including physical pain from injuries, emotional trauma from the crash, loss of enjoyment of life, and impact on daily activities. Include specific examples of how the collision has affected driving, work, and family life.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 6,
        name: 'Economic Damages',
        tag: 'SEC_ECONOMIC',
        isExpanded: true,
        steps: [
          {
            id: 9,
            type: 'text',
            content: 'Our client has incurred the following economic damages as a direct result of your insured\'s negligence:',
            action: 'append',
            parameters: {}
          },
          {
            id: 10,
            type: 'prompt',
            prompt: 'List all economic damages including medical expenses, lost wages, vehicle damage and rental costs, and future medical costs. Include specific dollar amounts where available.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 7,
        name: 'Settlement Demand',
        tag: 'SEC_DEMAND',
        isExpanded: true,
        steps: [
          {
            id: 11,
            type: 'text',
            content: 'In consideration of the foregoing, we demand settlement in the amount of $[DEMAND_AMOUNT]. This demand is valid for thirty (30) days from the date of this letter.',
            action: 'append',
            parameters: {}
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Demand Letter - Premises Liability',
    creator: 'Michael Rodriguez',
    dateCreated: '2024-08-08',
    lastModified: '2024-08-12',
    description: 'Premises liability demand letter template',
    sectionCount: 7,
    sections: [
      {
        id: 1,
        name: 'Introduction',
        tag: 'SEC_INTRO',
        isExpanded: true,
        steps: [
          {
            id: 1,
            type: 'text',
            content: 'We represent [CLIENT_NAME] regarding the premises liability incident that occurred on [INCIDENT_DATE] at [PROPERTY_ADDRESS]. This letter constitutes formal notice of our client\'s claim.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 2,
        name: 'Incident Description',
        tag: 'SEC_INCIDENT',
        isExpanded: true,
        steps: [
          {
            id: 2,
            type: 'resource',
            resourceId: 'chronology',
            action: 'append',
            parameters: {
              event_types: ['Incident'],
              format: 'Narrative'
            }
          }
        ]
      },
      {
        id: 3,
        name: 'Liability',
        tag: 'SEC_LIABILITY',
        isExpanded: true,
        steps: [
          {
            id: 3,
            type: 'text',
            content: 'As the property owner/occupier, your insured owed a duty of care to maintain the premises in a reasonably safe condition and breached that duty.',
            action: 'append',
            parameters: {}
          },
          {
            id: 4,
            type: 'resource',
            resourceId: 'chronology',
            action: 'append',
            parameters: {
              event_types: ['Incident'],
              format: 'Narrative'
            }
          },
          {
            id: 5,
            type: 'prompt',
            prompt: 'Analyze liability for premises accidents. Include specific dangerous conditions, lack of warnings, failure to inspect or repair, notice issues, and relevant safety standards. Cite any incident reports or inspection records.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 4,
        name: 'Medical Treatment',
        tag: 'SEC_MEDICAL',
        isExpanded: true,
        steps: [
          {
            id: 6,
            type: 'resource',
            resourceId: 'medical_records',
            action: 'append',
            parameters: {
              record_types: ['Emergency Room Reports', 'Diagnostic Results', 'Progress Notes'],
              include_diagnoses: true
            }
          },
          {
            id: 7,
            type: 'prompt',
            prompt: 'Focus on premises liability injuries. Highlight emergency treatment for slip/fall or impact injuries, ongoing rehabilitation, and prognosis. Emphasize the connection between the dangerous condition and all injuries.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 5,
        name: 'Damages - Pain and Suffering',
        tag: 'SEC_PAIN_SUFFERING',
        isExpanded: true,
        steps: [
          {
            id: 8,
            type: 'prompt',
            prompt: 'Detail the client\'s pain and suffering from the premises accident, including physical pain from the fall/injury, emotional trauma, loss of enjoyment of life, and ongoing limitations. Include specific examples of how the incident has affected daily activities, mobility, and confidence in public spaces.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 6,
        name: 'Economic Damages',
        tag: 'SEC_ECONOMIC',
        isExpanded: true,
        steps: [
          {
            id: 9,
            type: 'text',
            content: 'Our client has incurred the following economic damages as a direct result of the dangerous condition on your property:',
            action: 'append',
            parameters: {}
          },
          {
            id: 10,
            type: 'prompt',
            prompt: 'Calculate and list all economic losses including medical bills, lost income, future treatment costs, and any damaged property. Provide supporting documentation references.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 7,
        name: 'Settlement Demand',
        tag: 'SEC_DEMAND',
        isExpanded: true,
        steps: [
          {
            id: 11,
            type: 'text',
            content: 'Therefore, we demand settlement in the amount of $[DEMAND_AMOUNT] to resolve this matter. This offer remains open for thirty (30) days from the date of this correspondence.',
            action: 'append',
            parameters: {}
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Expert Disclosure',
    creator: 'Jennifer Liu',
    dateCreated: '2024-08-05',
    lastModified: '2024-08-11',
    description: 'Expert Disclosure - CO',
    sectionCount: 4,
    sections: [
      {
        id: 1,
        name: 'Expert Identification',
        tag: 'SEC_EXPERT_ID',
        isExpanded: true,
        steps: [
          {
            id: 1,
            type: 'text',
            content: 'Pursuant to C.R.C.P. 26(a)(2), Plaintiff hereby discloses the following expert witnesses who may be called to testify at trial:',
            action: 'append',
            parameters: {}
          },
          {
            id: 2,
            type: 'resource',
            resourceId: 'witness_list',
            action: 'append',
            parameters: {
              witness_types: ['Expert Witnesses'],
              include_summary: false,
              sort_by: 'Type'
            }
          }
        ]
      },
      {
        id: 2,
        name: 'Medical Providers',
        tag: 'SEC_PROVIDERS',
        isExpanded: true,
        steps: [
          {
            id: 3,
            type: 'text',
            content: 'The following treating physicians and healthcare providers may testify regarding their observations, treatment, and opinions:',
            action: 'append',
            parameters: {}
          },
          {
            id: 4,
            type: 'resource',
            resourceId: 'providers_list',
            action: 'append',
            parameters: {
              provider_types: ['Doctors', 'Physical Therapists'],
              include_summary: true,
              sort_by: 'First Date Seen'
            }
          },
          {
            id: 5,
            type: 'prompt',
            prompt: 'Summarize the anticipated testimony and opinions of each treating provider, including their qualifications, the subject matter of their testimony, and the substance of their expected opinions.',
            action: 'append',
            parameters: {}
          },
          {
            id: 6,
            type: 'prompt',
            prompt: 'Detail each provider\'s education, training, experience, publications, and professional certifications that qualify them to offer opinions in this case.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 3,
        name: 'Expert Witnesses',
        tag: 'SEC_EXPERTS',
        isExpanded: true,
        steps: [
          {
            id: 7,
            type: 'resource',
            resourceId: 'witness_list',
            action: 'append',
            parameters: {
              witness_types: ['Expert Witnesses'],
              include_summary: false,
              sort_by: 'Type'
            }
          },
          {
            id: 8,
            type: 'prompt',
            prompt: 'Summarize the anticipated testimony and opinions of each non-treating expert witness, including their qualifications and the substance of their expected opinions.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 4,
        name: 'Reservation of Rights',
        tag: 'SEC_RESERVATION',
        isExpanded: true,
        steps: [
          {
            id: 9,
            type: 'text',
            content: 'Plaintiff reserves the right to supplement this disclosure as discovery progresses and to call any expert disclosed by Defendant as a rebuttal witness.',
            action: 'append',
            parameters: {}
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Complaint',
    creator: 'David Thompson',
    dateCreated: '2024-08-01',
    lastModified: '2024-08-09',
    description: 'Complaint - CO',
    sectionCount: 6,
    sections: [
      {
        id: 1,
        name: 'Caption and Parties',
        tag: 'SEC_CAPTION',
        isExpanded: true,
        steps: [
          {
            id: 1,
            type: 'text',
            content: 'IN THE DISTRICT COURT IN AND FOR [COUNTY] COUNTY, COLORADO',
            action: 'append',
            parameters: {}
          },
          {
            id: 2,
            type: 'resource',
            resourceId: 'key_entities',
            action: 'append',
            parameters: {
              entity_types: ['Plaintiffs', 'Defendants'],
              include_contact: false,
              include_roles: true
            }
          }
        ]
      },
      {
        id: 2,
        name: 'Jurisdiction and Venue',
        tag: 'SEC_JURISDICTION',
        isExpanded: true,
        steps: [
          {
            id: 3,
            type: 'text',
            content: 'This Court has jurisdiction over this matter pursuant to C.R.S. § [STATUTE]. Venue is proper in this judicial district pursuant to C.R.C.P. 98.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 3,
        name: 'Factual Background',
        tag: 'SEC_FACTS',
        isExpanded: true,
        steps: [
          {
            id: 4,
            type: 'resource',
            resourceId: 'chronology',
            action: 'append',
            parameters: {
              event_types: ['Incident', 'Legal'],
              format: 'Narrative',
              date_range: 'All Events'
            }
          },
          {
            id: 5,
            type: 'prompt',
            prompt: 'Organize factual allegations into numbered paragraphs. Include key dates, locations, and circumstances that support your causes of action.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 4,
        name: 'Legal Theories and Claims',
        tag: 'SEC_CLAIMS',
        isExpanded: true,
        steps: [
          {
            id: 6,
            type: 'text',
            content: 'Plaintiff realleges and incorporates by reference all preceding paragraphs as if fully set forth herein.',
            action: 'append',
            parameters: {}
          },
          {
            id: 7,
            type: 'resource',
            resourceId: 'legal_issues',
            action: 'append',
            parameters: {
              analysis_depth: 'Include Case Law',
              jurisdiction: 'Colorado State'
            }
          },
          {
            id: 8,
            type: 'prompt',
            prompt: 'Draft causes of action based on the legal theories identified. For each claim, plead all required elements with specific factual support. Use separate numbered counts as needed.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 5,
        name: 'Damages',
        tag: 'SEC_DAMAGES',
        isExpanded: true,
        steps: [
          {
            id: 9,
            type: 'text',
            content: 'As a direct and proximate result of Defendant\'s conduct, Plaintiff has suffered and will continue to suffer damages including but not limited to:',
            action: 'append',
            parameters: {}
          },
          {
            id: 10,
            type: 'prompt',
            prompt: 'Plead damages comprehensively including economic losses, pain and suffering, and any punitive damages if applicable. Be specific but not excessive.',
            action: 'append',
            parameters: {}
          }
        ]
      },
      {
        id: 6,
        name: 'Prayer for Relief',
        tag: 'SEC_PRAYER',
        isExpanded: true,
        steps: [
          {
            id: 11,
            type: 'text',
            content: 'WHEREFORE, Plaintiff respectfully requests that this Court enter judgment in favor of Plaintiff and against Defendant for:',
            action: 'append',
            parameters: {}
          },
          {
            id: 12,
            type: 'prompt',
            prompt: 'Draft specific prayer for relief including monetary damages, injunctive relief if applicable, attorney fees, costs, and general relief clause.',
            action: 'append',
            parameters: {}
          }
        ]
      }
    ]
  }
];

export const sampleCases = [
  'Jane Doe v. Acme Corp',
  'Smith v. Johnson Medical',
  'Estate of Williams',
  'Rodriguez v. City of Springfield'
];

export const availableResources: Resource[] = [
  { 
    id: 'case_summary', 
    name: 'Case Summary', 
    icon: FileText, 
    description: 'Generate a summary of the case',
    parameters: [
      { id: 'length', name: 'Length', type: 'select', options: ['Brief (1 paragraph)', 'Standard (2-3 paragraphs)', 'Detailed (full page)'], default: 'Standard (2-3 paragraphs)' },
      { id: 'focus', name: 'Focus Areas', type: 'multiselect', options: ['Liability', 'Damages', 'Timeline', 'Key Players', 'Medical Issues'], default: [] },
      { id: 'prompt', name: 'Additional Instructions', type: 'prompt', placeholder: 'e.g., Emphasize the defendant\'s negligence and focus on emotional impact', default: '' }
    ]
  },
  { 
    id: 'key_entities', 
    name: 'Key Entities', 
    icon: Users, 
    description: 'Extract key people and organizations',
    parameters: [
      { id: 'entity_types', name: 'Entity Types', type: 'multiselect', options: ['Plaintiffs', 'Defendants', 'Witnesses', 'Experts', 'Medical Providers', 'Insurance Companies'], default: ['Plaintiffs', 'Defendants'] },
      { id: 'include_contact', name: 'Include Contact Info', type: 'checkbox', default: true },
      { id: 'include_roles', name: 'Include Roles/Relationships', type: 'checkbox', default: true }
    ]
  },
  { 
    id: 'chronology', 
    name: 'Chronology Events', 
    icon: Calendar, 
    description: 'List events in chronological order',
    parameters: [
      { id: 'date_range', name: 'Date Range', type: 'select', options: ['All Events', 'Last 30 Days', 'Last 90 Days', 'Last Year', 'Custom Range'], default: 'All Events' },
      { id: 'event_types', name: 'Event Types', type: 'multiselect', options: ['Medical', 'Legal', 'Communication', 'Incident', 'Treatment'], default: [] },
      { id: 'format', name: 'Format', type: 'select', options: ['Bulleted List', 'Table', 'Narrative'], default: 'Bulleted List' }
    ]
  },
  { 
    id: 'case_facts', 
    name: 'Case Facts', 
    icon: FileCheck, 
    description: 'Extract important case facts',
    parameters: [
      { id: 'fact_categories', name: 'Categories', type: 'multiselect', options: ['Disputed Facts', 'Undisputed Facts', 'Key Evidence', 'Witness Statements'], default: ['Undisputed Facts'] },
      { id: 'priority', name: 'Priority Level', type: 'select', options: ['All Facts', 'High Priority Only', 'High and Medium Priority'], default: 'All Facts' },
      { id: 'prompt', name: 'Extraction Focus', type: 'prompt', placeholder: 'e.g., Focus on facts that establish causation and timeline inconsistencies', default: '' }
    ]
  },
  { 
    id: 'medical_records', 
    name: 'Medical Records Summary', 
    icon: Plus, 
    description: 'Summarize medical records',
    parameters: [
      { id: 'providers', name: 'Filter by Provider', type: 'text', placeholder: 'e.g., Springfield General Hospital', default: '' },
      { id: 'record_types', name: 'Record Types', type: 'multiselect', options: ['Discharge Summaries', 'Operative Reports', 'Progress Notes', 'Diagnostic Results', 'Prescriptions'], default: [] },
      { id: 'include_diagnoses', name: 'Include Diagnosis Codes', type: 'checkbox', default: false }
    ]
  },
  { 
    id: 'providers_list', 
    name: 'Providers List', 
    icon: Users, 
    description: 'Generate list of providers',
    parameters: [
      { id: 'provider_types', name: 'Provider Types', type: 'multiselect', options: ['Doctors', 'Physical Therapists', 'Chiropractors', 'All'], default: ['Doctors'] },
      { id: 'include_summary', name: 'Include Testimony Summary', type: 'checkbox', default: false },
      { id: 'sort_by', name: 'Sort By', type: 'select', options: ['Name', 'Facility', 'Type', 'First Date Seen'], default: 'Relevance' }
    ]
  },
  { 
    id: 'financials', 
    name: 'Financials', 
    icon: DollarSign, 
    description: 'Access extracted financial information including bills, liens, and payment details',
    parameters: [
      { id: 'financial_types', name: 'Financial Types', type: 'multiselect', options: ['Bills', 'Liens', 'Payments', 'Outstanding Balances', 'Insurance Claims'], default: ['Bills'] },
      { id: 'filter_by_provider', name: 'Filter by Provider', type: 'text', placeholder: 'e.g., Springfield Medical Center', default: '' },
      { id: 'filter_by_physician', name: 'Filter by Physician', type: 'text', placeholder: 'e.g., Dr. Smith', default: '' },
      { id: 'min_amount', name: 'Minimum Amount', type: 'text', placeholder: 'e.g., 500', default: '' },
      { id: 'max_amount', name: 'Maximum Amount', type: 'text', placeholder: 'e.g., 10000', default: '' },
      { id: 'status_filter', name: 'Payment Status', type: 'multiselect', options: ['Paid', 'Unpaid', 'Partially Paid', 'In Collections'], default: ['Unpaid', 'Partially Paid'] },
      { id: 'include_details', name: 'Include Financial Details', type: 'checkbox', default: true },
      { id: 'prompt', name: 'Additional Filters', type: 'prompt', placeholder: 'e.g., Focus on bills related to the accident date range or specific injury treatment', default: '' }
    ]
  }
];