import { useState, useEffect } from 'react';
import { mockKeyIssues } from '../data/mock-data';
import type { KeyIssue } from '../types/deposition-types';

interface UseKeyIssuesProps {
  activeView: string;
}

export const useKeyIssues = ({ activeView }: UseKeyIssuesProps) => {
  const [keyIssues, setKeyIssues] = useState<KeyIssue[]>([]);
  const [suggestedKeyIssues, setSuggestedKeyIssues] = useState<KeyIssue[]>([]);

  // Initialize suggested key issues on component mount
  useEffect(() => {
    if (suggestedKeyIssues.length === 0) {
      setSuggestedKeyIssues([
        { id: 1, text: "Defendant's adherence to traffic laws at intersection", element: "Breach", suggested: true },
        { id: 2, text: "Impact of weather conditions on visibility and vehicle control", element: "Causation", suggested: true },
        { id: 3, text: "Cell phone distraction as contributing factor", element: "Breach", suggested: true },
        { id: 4, text: "Extent of plaintiff's medical treatment and ongoing care needs", element: "Damages", suggested: true },
      ]);
    }
  }, []);

  // Note: Removed auto-loading of mock data to show only suggestions initially

  const handleAddKeyIssue = (issue: Omit<KeyIssue, 'id'>) => {
    // Use next available numeric ID to maintain consistency with sample data
    const nextId = Math.max(...keyIssues.map(k => k.id), ...suggestedKeyIssues.map(s => s.id), 0) + 1;
    setKeyIssues(prev => [...prev, { id: nextId, ...issue }]);
  };

  const handleAcceptSuggestedIssue = (suggestedIssue: KeyIssue) => {
    // Move from suggested to confirmed issues - keep the original ID
    const confirmedIssue = { ...suggestedIssue, suggested: false };
    setKeyIssues(prev => [...prev, confirmedIssue]);
    setSuggestedKeyIssues(prev => prev.filter(i => i.id !== suggestedIssue.id));
  };

  const handleDismissSuggestedIssue = (issueId: string | number) => {
    setSuggestedKeyIssues(prev => prev.filter(i => i.id !== issueId));
  };

  const handleEditKeyIssue = (issueId: string | number, updatedData: Partial<KeyIssue>) => {
    setKeyIssues(prev => prev.map(i => 
      i.id === issueId 
        ? { ...i, ...updatedData } 
        : i
    ));
  };

  const handleDeleteKeyIssue = (issueId: string | number) => {
    setKeyIssues(prev => prev.filter(i => i.id !== issueId));
  };

  const handleSuggestKeyIssues = () => {
    // This function is kept for compatibility but not used in the new flow
    const suggestedIssues = [
      { id: Date.now() + 1, text: "Product defect claims under warranty law", element: "Duty" },
      { id: Date.now() + 2, text: "Breach of implied warranty of merchantability", element: "Breach" },
      { id: Date.now() + 3, text: "Corporate relationship between parent and subsidiary companies", element: "Causation" }
    ];
    setKeyIssues(prev => [...prev, ...suggestedIssues]);
  };

  return {
    // State
    keyIssues,
    suggestedKeyIssues,
    
    // Setters (for external components that need direct access)
    setKeyIssues,
    setSuggestedKeyIssues,
    
    // Actions
    handleAddKeyIssue,
    handleAcceptSuggestedIssue,
    handleDismissSuggestedIssue,
    handleEditKeyIssue,
    handleDeleteKeyIssue,
    handleSuggestKeyIssues
  };
};

export default useKeyIssues;