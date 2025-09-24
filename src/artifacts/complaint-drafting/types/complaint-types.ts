export interface Blueprint {
  id: number;
  name: string;
  description: string;
  lastUsed: string;
}

export interface Document {
  id: number;
  title: string;
  type?: string;
  path?: string;
  lastModified: string;
  creator?: string;
  editor?: string;
  size?: string;
  thumbnail?: string;
}

export interface Count {
  id: number;
  title: string;
  description: string;
  selected: boolean;
  keyFacts: string[];
  supportingDocs: string[];
  isCustom?: boolean;
}

export interface ComplaintSection {
  id: string;
  type: string;
  content: string;
  editable: boolean;
  number?: number;
  title?: string;
  supportingInfo?: {
    keyFacts: string[];
    documents: string[];
  };
}

export interface DraftedComplaint {
  caption: ComplaintSection;
  introduction: ComplaintSection;
  counts: ComplaintSection[];
  juryDemand: ComplaintSection;
  signature: ComplaintSection;
}

export interface GetStartedOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  recentItems?: any[];
  recentTitle?: string;
  hasCustomContent?: boolean;
}

export interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

export type CurrentView = 'homepage' | 'analyzing' | 'counts-review' | 'generating' | 'draft-editor';