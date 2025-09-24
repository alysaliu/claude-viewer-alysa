import { useState, useEffect } from 'react';
import { mockDeponents } from '../data/mock-data';
import type { Deponent } from '../types/deposition-types';

interface UseDeponentsProps {
  activeView: string;
  onEditDeponent?: () => void;
  onJaneDoeProcessing?: (deponentId: string | number) => void;
}

export const useDeponents = ({ activeView, onEditDeponent, onJaneDoeProcessing }: UseDeponentsProps) => {
  const [deponents, setDeponents] = useState<Deponent[]>([]);
  const [selectedDeponent, setSelectedDeponent] = useState<Deponent | null>(null);
  const [suggestedDeponents, setSuggestedDeponents] = useState<Deponent[]>([]);
  const [editingDeponent, setEditingDeponent] = useState<Deponent | null>(null);
  const [activeDeponentTab, setActiveDeponentTab] = useState('opposing');

  // Initialize suggested deponents on component mount
  useEffect(() => {
    if (suggestedDeponents.length === 0) {
      setSuggestedDeponents([
        { 
          id: 'deponent-1', 
          name: "Jane Doe", 
          role: "Plaintiff", 
          type: "friendly",
          description: "Plaintiff in motor vehicle accident case with ongoing injuries and damages",
          relevance: "First-hand testimony about the accident, injuries sustained, and impact on daily life",
          suggested: true
        },
        { 
          id: 'deponent-2', 
          name: "Robert Martinez", 
          role: "Defendant Driver", 
          type: "opposing",
          description: "Defendant driver who caused the motor vehicle accident",
          relevance: "Key testimony about driving behavior, traffic violations, and circumstances of collision",
          suggested: true
        }
      ]);
    }
  }, []);

  // Note: Removed auto-loading of mock data to show only suggestions initially

  const handleAddDeponent = (deponent: Partial<Deponent>) => {
    const newDeponent: Deponent = {
      id: Date.now(),
      hasTranscript: false,
      company: '',
      date: '',
      type: 'opposing',
      name: '',
      role: '',
      ...deponent
    };
    setDeponents(prev => [...prev, newDeponent]);
  };

  const handleAcceptSuggestedDeponent = (suggestedDeponent: Deponent) => {
    // Check if this is Jane Doe to handle special processing
    const isJaneDoe = suggestedDeponent.name === "Jane Doe";
    
    // Calculate past date (2 weeks ago) for Jane Doe
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 14);
    const formattedPastDate = pastDate.toISOString().split('T')[0];
    const pastTime = "10:00";

    // Move from suggested to confirmed deponents, consolidate description into relationToCase and exclude relevance
    const confirmedDeponent: Deponent = { 
      ...suggestedDeponent, 
      id: Date.now(), 
      suggested: false,
      hasTranscript: false,
      status: isJaneDoe ? 'processing' : 'pending',
      relationToCase: suggestedDeponent.description || suggestedDeponent.relationToCase || '',
      // Remove relevance field - only keep in suggestions
      relevance: undefined,
      description: undefined,
      company: suggestedDeponent.company || '',
      date: isJaneDoe ? formattedPastDate : suggestedDeponent.date || '',
      time: isJaneDoe ? pastTime : suggestedDeponent.time || '',
      processingStartTime: isJaneDoe ? Date.now() : undefined
    };
    
    setDeponents(prev => [...prev, confirmedDeponent]);
    setSuggestedDeponents(prev => prev.filter(d => d.id !== suggestedDeponent.id));
    
    // Switch to Supporting tab if Jane Doe (friendly deponent)
    if (isJaneDoe) {
      setActiveDeponentTab('friendly');
    }
    
    // Trigger processing simulation for Jane Doe
    if (isJaneDoe && onJaneDoeProcessing) {
      onJaneDoeProcessing(confirmedDeponent.id);
    }
  };

  const handleDismissSuggestedDeponent = (deponentId: string | number) => {
    setSuggestedDeponents(prev => prev.filter(d => d.id !== deponentId));
  };

  const handleEditDeponent = (deponent: Deponent) => {
    setEditingDeponent(deponent);
    if (onEditDeponent) {
      onEditDeponent();
    }
  };

  const handleUpdateDeponent = (deponentId: string | number, updatedData: Partial<Deponent>) => {
    setDeponents(prev => prev.map(d => 
      d.id === deponentId 
        ? { ...d, ...updatedData } 
        : d
    ));
  };

  const handleDeleteDeponent = (deponentId: string | number) => {
    setDeponents(prev => prev.filter(d => d.id !== deponentId));
  };

  const markDeponentWithTranscript = (deponentId: string | number, transcriptType: 'none' | 'official' | 'draft' = 'draft') => {
    setDeponents(prev => prev.map(d => 
      d.id === deponentId 
        ? { ...d, hasTranscript: true, transcriptType, status: 'completed' }
        : d
    ));

    if (selectedDeponent && selectedDeponent.id === deponentId) {
      setSelectedDeponent(prev => prev ? {
        ...prev, 
        hasTranscript: true, 
        transcriptType, 
        status: 'completed'
      } : null);
    }
  };

  // Combined arrays for rendering
  const allDeponents = [...deponents, ...suggestedDeponents];
  const friendlyDeponents = allDeponents.filter(d => d.type === 'friendly');
  const opposingDeponents = allDeponents.filter(d => d.type === 'opposing');

  return {
    // State
    deponents,
    selectedDeponent,
    suggestedDeponents,
    editingDeponent,
    activeDeponentTab,
    
    // Computed
    allDeponents,
    friendlyDeponents,
    opposingDeponents,
    
    // Setters (for external components that need direct access)
    setDeponents,
    setSelectedDeponent,
    setSuggestedDeponents,
    setEditingDeponent,
    setActiveDeponentTab,
    
    // Actions
    handleAddDeponent,
    handleAcceptSuggestedDeponent,
    handleDismissSuggestedDeponent,
    handleEditDeponent,
    handleUpdateDeponent,
    handleDeleteDeponent,
    markDeponentWithTranscript
  };
};

export default useDeponents;