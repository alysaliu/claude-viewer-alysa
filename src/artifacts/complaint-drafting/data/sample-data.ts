import { BookOpen, FileText, MessageSquare, Home, BarChart2, List, PenTool, Layers } from 'lucide-react';
import type { Blueprint, Document, Count, GetStartedOption, SidebarItem } from '../types/complaint-types';

export const blueprints: Blueprint[] = [
  {
    id: 1,
    name: "Complaint",
    description: "Generate a comprehensive civil complaint document with proper formatting, cause of action statements, and prayer for relief. Includes sections for parties, jurisdiction, factual allegations, and legal claims with customizable parameters for case-specific details.",
    lastUsed: "2025-05-18"
  },
  {
    id: 2,
    name: "Expert Disclosure",
    description: "Create detailed expert witness disclosure documents with qualifications, opinions, and basis for testimony.",
    lastUsed: "2025-05-15"
  },
  {
    id: 3,
    name: "Motion for Summary Judgement",
    description: "Generate comprehensive motion for summary judgment with statement of facts, legal arguments, and supporting case law.",
    lastUsed: "2025-05-12"
  },
  {
    id: 4,
    name: "Medical Summary",
    description: "Compile and summarize medical records into a coherent narrative for case presentation.",
    lastUsed: "2025-05-10"
  }
];

export const recentDocuments: Document[] = [
  {
    id: 1,
    title: "Deposition Questions - John Smith",
    type: "Deposition",
    lastModified: "2025-05-15",
    creator: "Jane Smith",
    thumbnail: "deposition"
  },
  {
    id: 2,
    title: "Davis v. Westfield Insurance - Timeline",
    type: "Timeline",
    lastModified: "2025-05-14",
    creator: "Jane Smith",
    thumbnail: "timeline"
  },
  {
    id: 3,
    title: "Witness Statement Analysis",
    type: "Analysis",
    lastModified: "2025-05-13", 
    creator: "Robert Johnson",
    thumbnail: "analysis"
  },
  {
    id: 4,
    title: "Motion to Compel - ABC Corp",
    type: "Motion",
    lastModified: "2025-05-10",
    creator: "Jane Smith",
    thumbnail: "motion"
  },
  {
    id: 5,
    title: "Insurance Demand Letter - Davis Case",
    type: "Letter",
    lastModified: "2025-05-08",
    creator: "Robert Johnson",
    thumbnail: "letter"
  }
];

export const allDocuments: Document[] = [
  {
    id: 1,
    title: "Jane Doe - Demand Letter (2)",
    path: "/Demo Law/Jane Doe MVA",
    lastModified: "2025-05-15 13:39",
    editor: "Jon Bryant",
    size: "6.77 MB"
  },
  {
    id: 2,
    title: "Jane Doe - Demand Letter (1)",
    path: "/Demo Law/Jane Doe MVA",
    lastModified: "2025-05-14 12:41",
    editor: "Jon Bryant",
    size: "6.77 MB"
  },
  {
    id: 3,
    title: "Jane Doe - Demand Letter",
    path: "/Demo Law/Jane Doe MVA",
    lastModified: "2025-05-14 11:45",
    editor: "Pam Wickersham",
    size: "6.77 MB"
  },
  {
    id: 4,
    title: "Interrogatory Responses",
    path: "/Demo Law/Jane Doe MVA",
    lastModified: "2025-05-14 10:31",
    editor: "Dan Zhang",
    size: "12.60 KB"
  },
  {
    id: 5,
    title: "test doc",
    path: "/Demo Law/Jane Doe MVA",
    lastModified: "2025-05-13 10:22",
    editor: "Pam Wickersham",
    size: "12.60 KB"
  },
  {
    id: 6,
    title: "motion to compel",
    path: "/Demo Law/Jane Doe MVA",
    lastModified: "2025-05-08 12:30",
    editor: "Pam Wickersham",
    size: "12.60 KB"
  }
];

export const sampleCounts: Count[] = [
  {
    id: 1,
    title: "Negligence",
    description: "Direct negligence claim against defendants for failure to maintain proper control of vehicle, excessive speed, and failure to avoid collision",
    selected: true,
    keyFacts: [
      "Defendant operated vehicle at excessive speed",
      "Failed to maintain proper control",
      "Failed to exercise caution at intersection",
      "Rear-ended plaintiff's vehicle"
    ],
    supportingDocs: ["Police Report", "Witness Statement - M. Garcia", "Medical Records"]
  },
  {
    id: 2,
    title: "Vicarious Liability / Respondeat Superior",
    description: "Employer liability for employee's negligent operation of company vehicle during course of employment",
    selected: true,
    keyFacts: [
      "Vehicle owned by employer (Hammer Drilling, LLC)",
      "Operated during course of employment",
      "Employee had permission to operate vehicle",
      "Acting within scope of employment"
    ],
    supportingDocs: ["Employment Records", "Vehicle Registration", "Company Policy Manual"]
  },
  {
    id: 3,
    title: "Negligent Entrustment",
    description: "Negligent entrustment of vehicle to employee driver, including negligent hiring, training, and supervision",
    selected: true,
    keyFacts: [
      "Employer entrusted vehicle to employee",
      "Failed to properly train/supervise",
      "Previous driving incidents on record",
      "Negligent hiring practices"
    ],
    supportingDocs: ["HR Files", "Training Records", "Prior Incident Reports"]
  }
];

export const sidebarItems: SidebarItem[] = [
  { id: 'overview', icon: Home, label: 'Overview', active: false },
  { id: 'timeline', icon: BarChart2, label: 'Timeline', active: false },
  { id: 'deep-dive', icon: List, label: 'Deep Dive', active: false },
  { id: 'drafting', icon: PenTool, label: 'Drafting', active: true },
  { id: 'files', icon: Layers, label: 'Files', active: false }
];