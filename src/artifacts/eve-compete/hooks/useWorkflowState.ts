import { useState } from 'react';
import type { ActiveTab } from '../types/workflow-types';

export const useWorkflowState = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documentSearchQuery, setDocumentSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return {
    searchQuery,
    setSearchQuery,
    documentSearchQuery,
    setDocumentSearchQuery,
    activeTab,
    setActiveTab,
  };
};