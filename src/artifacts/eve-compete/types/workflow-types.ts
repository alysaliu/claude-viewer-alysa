export interface Document {
  id: number;
  title: string;
  path: string;
  lastModified: string;
  editor: string;
  size: string;
}

export interface RecentDocument {
  id: number;
  title: string;
  type: string;
  lastModified: string;
  creator: string;
  thumbnail: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
}

export interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

export interface GetStartedOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  recentItems?: Recipe[];
  recentTitle?: string;
  hasCustomContent?: boolean;
}

export type ActiveTab = 'overview' | 'explore' | 'timeline' | 'deep-dive' | 'drafting' | 'files';