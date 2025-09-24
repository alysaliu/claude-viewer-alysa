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

  const presentAssumptions = (taskId: number) => {
    if (!draftingTask || draftingTask.id !== taskId) return;

    setTimeout(() => {
      const analysisCompleteTask = {
        ...draftingTask,
        messages: [...draftingTask.messages.map(msg =>
          msg.isAnalyzing ? { ...msg, isAnalyzing: false, isAnalyzingComplete: true } : msg
        ), {
          id: Date.now(),
          type: 'assistant' as const,
          content: "I've analyzed your reference complaint and case files. Based on this analysis, I've prepared a draft structure with key assumptions about how to approach your complaint. Please review these assumptions and let me know if you'd like to modify any of them.",
          timestamp: new Date(),
          showAssumptions: true
        }],
        phase: 'assumptions' as const,
        status: 'Needs input' as const,
        assumptions: sampleAssumptions
      };
      setDraftingTask(analysisCompleteTask);
    }, 2000);
  };

  const handleAssumptionResponse = (assumptionId: number, option: string) => {
    if (!draftingTask) return;

    const updatedAssumptions = draftingTask.assumptions.map(assumption =>
      assumption.id === assumptionId
        ? { ...assumption, selected: option }
        : assumption
    );

    const updatedResponses = {
      ...draftingTask.assumptionResponses,
      [assumptionId]: option
    };

    setDraftingTask({
      ...draftingTask,
      assumptions: updatedAssumptions,
      assumptionResponses: updatedResponses
    });

    // Check if all assumptions are answered
    const allAnswered = updatedAssumptions.every(assumption => assumption.selected !== null);

    if (allAnswered) {
      setTimeout(() => {
        const confirmationMessage = {
          id: Date.now(),
          type: 'assistant' as const,
          content: "Perfect! I have all the information I need. I'll now draft your complaint incorporating your preferences for legal theories, damages, jurisdiction, and defendants.\n\n**Summary of your choices:**\n• Legal approach: " + updatedAssumptions[0].selected + "\n• Damages strategy: " + updatedAssumptions[1].selected + "\n• Jurisdictional basis: " + updatedAssumptions[2].selected + "\n• Defendant scope: " + updatedAssumptions[3].selected,
          timestamp: new Date(),
          isConfirmation: true,
          showBeginDrafting: true
        };

        setDraftingTask(currentTask => currentTask ? {
          ...currentTask,
          messages: [...currentTask.messages, confirmationMessage]
        } : null);
      }, 1000);
    }
  };

  const handleCustomInput = (assumptionId: number, value: string) => {
    setCustomInputs({
      ...customInputs,
      [assumptionId]: value
    });
  };

  const toggleCustomMode = (assumptionId: number) => {
    if (customModeAssumption === assumptionId) {
      setCustomModeAssumption(null);
    } else {
      setCustomModeAssumption(assumptionId);
      // Store original response for potential cancellation
      const currentAssumption = draftingTask?.assumptions.find(a => a.id === assumptionId);
      if (currentAssumption?.selected) {
        setOriginalResponseBeforeEdit(currentAssumption.selected);
      }
    }
  };

  const cancelCustomInstruction = () => {
    setCustomModeAssumption(null);
    setOriginalResponseBeforeEdit(null);
  };

  const confirmCustomInstruction = (assumptionId: number) => {
    const customValue = customInputs[assumptionId];
    if (customValue && draftingTask) {
      handleAssumptionResponse(assumptionId, customValue);
      setCustomModeAssumption(null);
      setOriginalResponseBeforeEdit(null);
    }
  };

  const editCustomInstruction = (assumptionId: number) => {
    setEditingCustomAssumption(assumptionId);
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