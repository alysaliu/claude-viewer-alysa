export interface Blueprint {
  id: number;
  name: string;
  creator: string;
  dateCreated: string;
  lastModified: string;
  description: string;
  sectionCount: number;
  sections?: Section[];
  selectedCase?: string;
  underlayFile?: UnderlayFile | null;
}

export interface Section {
  id: number;
  name: string;
  tag: string;
  isExpanded: boolean;
  steps: Step[];
}

export interface Step {
  id: number;
  type: 'text' | 'resource' | 'prompt';
  content?: string;
  prompt?: string;
  resourceId?: string;
  action: 'append' | 'prepend' | 'replace';
  parameters: Record<string, any>;
}

export interface Resource {
  id: string;
  name: string;
  icon: any;
  description: string;
  parameters: ResourceParameter[];
}

export interface ResourceParameter {
  id: string;
  name: string;
  type: 'select' | 'multiselect' | 'checkbox' | 'text' | 'prompt';
  options?: string[];
  placeholder?: string;
  default: any;
}

export interface UnderlayFile {
  name: string;
  size: string;
  uploadedAt: string;
  foundTags: string[];
}