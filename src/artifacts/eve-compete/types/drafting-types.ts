import React from 'react';

export interface Message {
  id: number;
  type: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  isFile?: boolean;
  file?: {
    name: string;
    size: string;
  };
  showUpload?: boolean;
  isAnalyzing?: boolean;
  isAnalyzingComplete?: boolean;
  showAssumptions?: boolean;
  isConfirmation?: boolean;
  showBeginDrafting?: boolean;
  isDraftingStarted?: boolean;
  isDrafting?: boolean;
  isDraftingComplete?: boolean;
  isDraftComplete?: boolean;
  isTaskCard?: boolean;
  taskType?: string;
  isDocumentTypeSelection?: boolean;
  actions?: MessageAction[];
}

export interface MessageAction {
  label: string;
  icon: () => React.ReactNode;
  primary?: boolean;
}

export interface ChatTab {
  id: string;
  title: string;
  type: 'main' | 'drafting';
  taskId?: number;
}

export interface DraftingTask {
  id: number;
  title: string;
  status: 'Needs input' | 'Generating' | 'Draft complete';
  phase: 'upload' | 'analyzing' | 'assumptions' | 'drafting' | 'complete' | 'review';
  createdAt: Date;
  messages: Message[];
  uploadedFile: UploadedFile | null;
  assumptions: Assumption[];
  assumptionResponses: Record<number, string>;
  draftingStartTime: number | null;
  elapsedTime: number;
  draftReady: boolean;
}

export interface UploadedFile {
  name: string;
  size: string;
  type: string;
}

export interface Assumption {
  id: number;
  category: string;
  assumption: string;
  question: string;
  options: string[];
  selected: string | null;
}

export interface Job {
  id: string;
  taskId: number;
  type: 'document-generation' | 'data-analysis' | 'research' | 'other';
  title: string;
  description: string;
  status: 'In Progress' | 'Complete';
  startTime: number;
  elapsedTime: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface DocumentGenerationJob extends Job {
  type: 'document-generation';
  creationMethod: 'blueprint' | 'reference';
  blueprintName?: string; // Name of the blueprint used (if blueprint method)
  referenceFile?: string; // Name of the reference file used (if reference method)
  documentType?: string; // Optional document type provided by user
  additionalInstructions?: string; // Additional instructions provided by user
  savedAsBlueprint?: boolean; // Whether this job has been saved as a blueprint
}

export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
  jobId?: string;
}

export interface NotificationAction {
  label: string;
  action: string;
  icon: () => React.ReactNode;
  primary?: boolean;
}

export interface SidebarItem {
  id: string;
  icon: () => React.ReactNode;
  label: string;
  active?: boolean;
}

export type CurrentPhase = 'initial' | 'upload' | 'analyzing' | 'assumptions' | 'drafting' | 'complete' | 'review';
export type ViewMode = 'clean' | 'changes' | 'compare';