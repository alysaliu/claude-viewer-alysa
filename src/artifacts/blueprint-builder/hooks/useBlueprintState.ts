import { useState } from 'react';
import type { Blueprint, Section, Step, UnderlayFile } from '../types/blueprint-types';

export const useBlueprintState = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'builder'
  const [currentBlueprintId, setCurrentBlueprintId] = useState<number | null>(null);
  const [blueprintName, setBlueprintName] = useState('New Blueprint');
  const [blueprintDescription, setBlueprintDescription] = useState('');
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUnderlayModal, setShowUnderlayModal] = useState(false);
  const [underlayFile, setUnderlayFile] = useState<UnderlayFile | null>(null);
  const [showUnderlayPreview, setShowUnderlayPreview] = useState(false);

  const addSection = () => {
    const newSection: Section = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      tag: `SEC_${Date.now().toString(36).toUpperCase()}`,
      isExpanded: true,
      steps: [
        {
          id: Date.now() + 1,
          type: 'text',
          content: '',
          action: 'append',
          parameters: {}
        }
      ]
    };
    setSections([...sections, newSection]);
  };

  const updateSectionName = (sectionId: number, name: string) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, name } : section
    ));
  };

  const deleteSection = (sectionId: number) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const toggleSection = (sectionId: number) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section
    ));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < sections.length) {
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
      setSections(newSections);
    }
  };

  const addStep = (sectionId: number) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newStep: Step = {
          id: Date.now(),
          type: 'text',
          content: '',
          action: section.steps.length === 0 ? 'append' : 'append',
          parameters: {}
        };
        return {
          ...section,
          steps: [...section.steps, newStep]
        };
      }
      return section;
    }));
  };

  const updateStep = (sectionId: number, stepId: number, updates: Partial<Step>) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          steps: section.steps.map(step => 
            step.id === stepId ? { ...step, ...updates } : step
          )
        };
      }
      return section;
    }));
  };

  const updateStepParameter = (sectionId: number, stepId: number, paramId: string, value: any) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          steps: section.steps.map(step => {
            if (step.id === stepId) {
              return {
                ...step,
                parameters: {
                  ...step.parameters,
                  [paramId]: value
                }
              };
            }
            return step;
          })
        };
      }
      return section;
    }));
  };

  const deleteStep = (sectionId: number, stepId: number) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newSteps = section.steps.filter(step => step.id !== stepId);
        // If no steps remain, add a default text step
        if (newSteps.length === 0) {
          newSteps.push({
            id: Date.now(),
            type: 'text',
            content: '',
            action: 'append',
            parameters: {}
          });
        }
        return {
          ...section,
          steps: newSteps
        };
      }
      return section;
    }));
  };

  return {
    // State
    currentView, setCurrentView,
    currentBlueprintId, setCurrentBlueprintId,
    blueprintName, setBlueprintName,
    blueprintDescription, setBlueprintDescription,
    showEditDetailsModal, setShowEditDetailsModal,
    sections, setSections,
    selectedCase, setSelectedCase,
    showPreview, setShowPreview,
    generatedContent, setGeneratedContent,
    isGenerating, setIsGenerating,
    showUnderlayModal, setShowUnderlayModal,
    underlayFile, setUnderlayFile,
    showUnderlayPreview, setShowUnderlayPreview,
    
    // Actions
    addSection,
    updateSectionName,
    deleteSection,
    toggleSection,
    moveSection,
    addStep,
    updateStep,
    updateStepParameter,
    deleteStep
  };
};