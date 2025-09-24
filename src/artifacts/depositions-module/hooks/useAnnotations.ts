import { useState, useEffect } from 'react';
import { sampleContradictions, sampleKeyIssueImpacts } from '../data/sample-annotations';
import type { ContradictionItem, KeyIssueImpact } from '../types/deposition-types';

interface UseAnnotationsProps {
  showTranscriptView: boolean;
}

export const useAnnotations = ({ showTranscriptView }: UseAnnotationsProps) => {
  const [contradictions, setContradictions] = useState<ContradictionItem[]>([]);
  const [keyIssueImpacts, setKeyIssueImpacts] = useState<KeyIssueImpact[]>([]);

  // Setup sample data for transcript analysis mode
  useEffect(() => {
    console.log('Sample data effect triggered:', {
      showTranscriptView,
      contradictionsLength: contradictions.length,
      keyIssueImpactsLength: keyIssueImpacts.length,
      shouldLoadContradictions: showTranscriptView && contradictions.length === 0,
      shouldLoadImpacts: showTranscriptView && keyIssueImpacts.length === 0
    });
    
    if (showTranscriptView) {
      // Load contradictions if empty
      if (contradictions.length === 0) {
        console.log('Loading sample contradictions...');
        setContradictions(sampleContradictions);
      }
      
      // Load key issue impacts if empty
      if (keyIssueImpacts.length === 0) {
        console.log('Loading sample key issue impacts...');
        setKeyIssueImpacts(sampleKeyIssueImpacts);
        console.log('Key issue impacts loaded:', { 
          count: sampleKeyIssueImpacts.length,
          sampleData: sampleKeyIssueImpacts 
        });
      }
    }
  }, [showTranscriptView, contradictions.length, keyIssueImpacts.length]);

  const clearAnnotations = () => {
    setContradictions([]);
    setKeyIssueImpacts([]);
  };

  const addContradiction = (contradiction: ContradictionItem) => {
    setContradictions(prev => [...prev, contradiction]);
  };

  const addKeyIssueImpact = (impact: KeyIssueImpact) => {
    setKeyIssueImpacts(prev => [...prev, impact]);
  };

  const removeContradiction = (id: string) => {
    setContradictions(prev => prev.filter(c => c.id !== id));
  };

  const removeKeyIssueImpact = (id: string) => {
    setKeyIssueImpacts(prev => prev.filter(i => i.id !== id));
  };

  return {
    // State
    contradictions,
    keyIssueImpacts,
    
    // Setters (for external components that need direct access)
    setContradictions,
    setKeyIssueImpacts,
    
    // Actions
    clearAnnotations,
    addContradiction,
    addKeyIssueImpact,
    removeContradiction,
    removeKeyIssueImpact
  };
};

export default useAnnotations;