import { useState } from 'react';
import type { DraftingTask } from '../types/drafting-types';
import { sampleAssumptions } from '../data/sample-data';

export const useAssumptions = (
  draftingTask: DraftingTask | null,
  setDraftingTask: (task: DraftingTask | null) => void,
  customInputs: Record<number, string>,
  setCustomInputs: (inputs: Record<number, string>) => void,
  customModeAssumption: number | null,
  setCustomModeAssumption: (id: number | null) => void,
  setEditingCustomAssumption: (id: number | null) => void,
  setOriginalResponseBeforeEdit: (response: string | null) => void
) => {
  
  // Present assumptions for verification
  const presentAssumptions = (taskId: number) => {
    setDraftingTask(currentTask => {
      if (!currentTask || currentTask.id !== taskId) return currentTask;
      
      // Update the analyzing message to show completion
      const updatedMessages = currentTask.messages.map(msg => {
        if (msg.isAnalyzing) {
          return {
            ...msg,
            isAnalyzing: false,
            isAnalyzingComplete: true
          };
        }
        return msg;
      });
      
      const assumptionsMessage = {
        id: Date.now(),
        type: 'assistant' as const,
        content: "I've analyzed your reference complaint and case files. Before I begin drafting, I want to confirm these key decisions that will shape your complaint:",
        timestamp: new Date(),
        showAssumptions: true
      };
      
      return {
        ...currentTask,
        phase: 'assumptions' as const,
        status: 'Needs input' as const,
        assumptions: sampleAssumptions,
        messages: [...updatedMessages, assumptionsMessage]
      };
    });
  };

  // Handle assumption response
  const handleAssumptionResponse = (assumptionId: number, option: string) => {
    if (!draftingTask) return;
    
    const updatedResponses = {
      ...draftingTask.assumptionResponses,
      [assumptionId]: option
    };
    
    const updatedTask = {
      ...draftingTask,
      assumptionResponses: updatedResponses
    };
    setDraftingTask(updatedTask);
    
    // Check if all assumptions have been answered using the updated responses
    const allAnswered = draftingTask.assumptions.every(a => 
      updatedResponses[a.id] !== undefined
    );
    
    if (allAnswered) {
      // Add a slight delay before showing the confirmation
      setTimeout(() => {
        setDraftingTask(currentTask => {
          if (!currentTask) return currentTask;
          
          const existingConfirmation = currentTask.messages.find(m => m.isConfirmation);
          if (!existingConfirmation) {
            const confirmationMessage = {
              id: Date.now(),
              type: 'assistant' as const,
              content: "Perfect! I have all the information I need. I'll now draft your complaint based on these confirmed parameters.",
              timestamp: new Date(),
              isConfirmation: true,
              showBeginDrafting: true
            };
            
            return {
              ...currentTask,
              messages: [...currentTask.messages, confirmationMessage]
            };
          }
          return currentTask;
        });
      }, 100);
    }
  };

  // Handle custom text input for assumptions
  const handleCustomInput = (assumptionId: number, value: string) => {
    setCustomInputs({
      ...customInputs,
      [assumptionId]: value
    });
  };

  // Toggle custom mode for an assumption
  const toggleCustomMode = (assumptionId: number) => {
    setCustomModeAssumption(assumptionId);
    setEditingCustomAssumption(null);
    // Initialize with existing custom input if it exists
    if (!customInputs[assumptionId]) {
      setCustomInputs({
        ...customInputs,
        [assumptionId]: ''
      });
    }
  };

  // Cancel custom instruction - always return to preset options
  const cancelCustomInstruction = () => {
    if (customModeAssumption !== null && draftingTask) {
      // Clear the response to return to preset options (no selection)
      const updatedTask = {
        ...draftingTask,
        assumptionResponses: {
          ...draftingTask.assumptionResponses,
          [customModeAssumption]: undefined
        }
      };
      setDraftingTask(updatedTask);
      
      setCustomInputs({
        ...customInputs,
        [customModeAssumption]: ''
      });
    }
    setCustomModeAssumption(null);
    setEditingCustomAssumption(null);
    setOriginalResponseBeforeEdit(null);
  };

  // Confirm custom instruction
  const confirmCustomInstruction = (assumptionId: number) => {
    const customText = customInputs[assumptionId];
    if (!customText || !customText.trim()) return;

    handleAssumptionResponse(assumptionId, `Custom: ${customText.trim()}`);
    setCustomModeAssumption(null);
  };

  // Edit custom instruction
  const editCustomInstruction = (assumptionId: number) => {
    if (!draftingTask) return;
    
    const currentResponse = draftingTask.assumptionResponses[assumptionId];
    
    // Store the original response so we can restore it if cancelled
    setOriginalResponseBeforeEdit(currentResponse);
    
    if (currentResponse && currentResponse.startsWith('Custom: ')) {
      setCustomInputs({
        ...customInputs,
        [assumptionId]: currentResponse.replace('Custom: ', '')
      });
    }
    setEditingCustomAssumption(assumptionId);
    setCustomModeAssumption(assumptionId);
  };

  return {
    presentAssumptions,
    handleAssumptionResponse,
    handleCustomInput,
    toggleCustomMode,
    cancelCustomInstruction,
    confirmCustomInstruction,
    editCustomInstruction
  };
};