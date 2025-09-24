import React from 'react';
import { Home, BarChart2, List, PenTool, Layers, CheckCircle, X, FileText, AlertCircle } from 'lucide-react';
import type { SidebarItem, Notification } from '../types/drafting-types';

export const sidebarItems: SidebarItem[] = [
  { id: 'overview', icon: () => React.createElement(Home, { size: 18 }), label: 'Overview' },
  { id: 'timeline', icon: () => React.createElement(BarChart2, { size: 18 }), label: 'Timeline' },
  { id: 'deep-dive', icon: () => React.createElement(List, { size: 18 }), label: 'Deep Dive' },
  { id: 'drafting', icon: () => React.createElement(PenTool, { size: 18 }), label: 'Drafting', active: true },
  { id: 'files', icon: () => React.createElement(Layers, { size: 18 }), label: 'Files' }
];

export const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'info',
    title: 'Case Update Available',
    message: 'New medical records have been added to Davis v. Johnson case',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: true
  },
  {
    id: 2,
    type: 'success',
    title: 'Document Processing Complete',
    message: 'Police report analysis has been completed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true
  },
  {
    id: 3,
    type: 'warning',
    title: 'Deadline Reminder',
    message: 'Discovery deadline is approaching in 5 days',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true
  },
  {
    id: 4,
    type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance window tonight from 11 PM - 1 AM EST',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true
  }
];

export const sampleAssumptions = [
  {
    id: 1,
    category: "Legal Theory",
    assumption: "Based on the case files and the reference complaint, I'm planning to structure this as a **negligence claim** with emphasis on duty of care breach by the defendant driver.",
    question: "Is negligence the primary legal theory you want to pursue, or should I also include claims for gross negligence or recklessness?",
    options: ["Negligence only", "Include gross negligence", "Include both gross negligence and recklessness"],
    selected: null
  },
  {
    id: 2,
    category: "Damages Strategy",
    assumption: "I notice medical expenses total $47,500 with ongoing treatment. The reference complaint includes future medical costs and loss of earning capacity.",
    question: "Should I include claims for future medical expenses and lost earning capacity based on Dr. Mitchell's prognosis?",
    options: ["Yes, include both", "Only future medical", "Only past damages"],
    selected: null
  },
  {
    id: 3,
    category: "Jurisdictional Basis",
    assumption: "The accident occurred in Springfield County and all parties reside here. I'll assert jurisdiction based on the location of the incident and parties' residence.",
    question: "Are there any additional jurisdictional considerations I should address?",
    options: ["No, location and residence are sufficient", "Add amount in controversy", "Include federal question jurisdiction"],
    selected: null
  },
  {
    id: 4,
    category: "Defendant Information",
    assumption: "I've identified the primary defendant as the other driver. The case files suggest potential employer liability under respondeat superior.",
    question: "Should I name the driver's employer (ABC Delivery Co.) as an additional defendant?",
    options: ["Yes, include the employer", "No, driver only"],
    selected: null
  }
];

// Helper functions
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success': return React.createElement(CheckCircle, { size: 16, className: "text-green-500" });
    case 'warning': return React.createElement(AlertCircle, { size: 16, className: "text-yellow-500" });
    case 'error': return React.createElement(X, { size: 16, className: "text-red-500" });
    default: return React.createElement(FileText, { size: 16, className: "text-blue-500" });
  }
};

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Needs input':
      return 'bg-yellow-100 text-yellow-800';
    case 'Generating':
      return 'bg-blue-100 text-blue-800';
    case 'Draft complete':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};