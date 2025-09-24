// TypeScript interfaces for depositions module

export interface KeyIssue {
  id: number;
  text: string;
  element: string;
  elements?: string[];
}

export interface Deponent {
  id: number;
  name: string;
  role: string;
  type: 'friendly' | 'opposing';
  date: string;
  hasTranscript: boolean;
  transcriptType: 'none' | 'official' | 'draft';
  company: string;
  time?: string;
  timezone?: string;
  relationToCase?: string;
  status?: string;
  datetime?: string;
}

export interface ContradictionItem {
  id: string;
  title: string;
  content: string;
  citation: TranscriptCitation;
  timestamp: Date;
  followUp?: string;
  severity: 'high' | 'medium' | 'low';
  automated: boolean;
  mode: 'live' | 'offline';
  contradictionType: 'internal' | 'external';
  contradictoryTestimony: string;
}

export interface KeyIssueImpact {
  id: string;
  type: 'helps' | 'harms';
  title: string;
  content: string;
  citation: TranscriptCitation;
  timestamp: Date;
  severity: 'high' | 'medium' | 'low';
  automated: boolean;
  mode: 'live' | 'offline';
  issueId: string; // Reference to key issue
}

export interface AiMessage {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface PageLineSummary {
  page: number;
  lines: string;
  topic: string;
  summary: string;
}

export interface TranscriptEntry {
  speaker: string;
  text: string;
  time: string;
}

export interface TranscriptCitation {
  page?: number;
  line?: number;
  timeRange?: string;
  context: string;
}