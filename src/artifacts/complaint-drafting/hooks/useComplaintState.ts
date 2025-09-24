import { useState } from 'react';
import type { CurrentView, Blueprint, Count, DraftedComplaint } from '../types/complaint-types';

export const useComplaintState = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('homepage');
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [identifiedCounts, setIdentifiedCounts] = useState<Count[]>([]);
  const [draftedComplaint, setDraftedComplaint] = useState<DraftedComplaint | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [documentTitle, setDocumentTitle] = useState('Complaint - Michael Garcia - MVA');
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [documentSearchQuery, setDocumentSearchQuery] = useState('');
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);
  const [editedCounts, setEditedCounts] = useState<Set<number>>(new Set());
  const [editingCount, setEditingCount] = useState<number | null>(null);

  return {
    currentView,
    setCurrentView,
    selectedBlueprint,
    setSelectedBlueprint,
    isAnalyzing,
    setIsAnalyzing,
    identifiedCounts,
    setIdentifiedCounts,
    draftedComplaint,
    setDraftedComplaint,
    activeSection,
    setActiveSection,
    editingSection,
    setEditingSection,
    showChat,
    setShowChat,
    chatInput,
    setChatInput,
    documentTitle,
    setDocumentTitle,
    hasBeenSaved,
    setHasBeenSaved,
    searchQuery,
    setSearchQuery,
    documentSearchQuery,
    setDocumentSearchQuery,
    showBlueprintModal,
    setShowBlueprintModal,
    editedCounts,
    setEditedCounts,
    editingCount,
    setEditingCount,
  };
};