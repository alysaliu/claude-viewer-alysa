import React from 'react';
import { FileText, ExternalLink, Eye, Download } from 'lucide-react';
import type { DraftingTask, Job } from '../types/drafting-types';

export const useDraftingWorkflow = (
  draftingTask: DraftingTask | null,
  setDraftingTask: (task: DraftingTask | null) => void,
  setDraftingStarted: (started: boolean) => void,
  addJob: (job: Job) => void,
  updateJob: (jobId: string, updates: Partial<Job>) => void,
  addNotification: (notification: any) => void,
  presentAssumptions?: (taskId: number) => void
) => {

  // Handle file upload in drafting tab
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && draftingTask) {
      const fileInfo = {
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type
      };

      // Add user message showing file upload
      const uploadMessage = {
        id: Date.now(),
        type: 'user' as const,
        content: `Uploaded: ${file.name}`,
        isFile: true,
        file: {
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`
        },
        timestamp: new Date()
      };

      const updatedTask = {
        ...draftingTask,
        uploadedFile: fileInfo,
        messages: [...draftingTask.messages, uploadMessage],
        phase: 'analyzing' as const,
        status: 'Generating' as const
      };
      setDraftingTask(updatedTask);

      // Start analysis phase
      setTimeout(() => {
        const analysisUpdatedTask = {
          ...updatedTask,
          messages: [...updatedTask.messages, {
            id: Date.now(),
            type: 'assistant' as const,
            content: "Thank you for uploading the reference complaint. I'm now analyzing it along with your case files to understand the context and identify key elements for your complaint.",
            timestamp: new Date(),
            isAnalyzing: true
          }]
        };
        setDraftingTask(analysisUpdatedTask);

        // Simulate analysis time
        setTimeout(() => {
          if (presentAssumptions) {
            presentAssumptions(analysisUpdatedTask.id);
          }
        }, 3000);
      }, 500);
    }
  };

  // Start drafting
  const startDrafting = (presentAssumptions: (taskId: number) => void) => {
    if (!draftingTask) return;

    setDraftingStarted(true);
    const startTime = Date.now();

    // Add job to jobs list
    const job: Job = {
      id: `job-${draftingTask.id}`,
      taskId: draftingTask.id,
      type: 'drafting',
      title: 'Draft Complaint',
      description: 'Davis v. Johnson - MVA Case',
      status: 'In Progress',
      startTime: startTime,
      elapsedTime: 0,
      createdAt: new Date()
    };
    addJob(job);

    setDraftingTask(currentTask => {
      if (!currentTask) return currentTask;

      // Update the confirmation message to show drafting started
      const updatedMessages = currentTask.messages.map(msg => {
        if (msg.isConfirmation) {
          return {
            ...msg,
            showBeginDrafting: false,
            isDraftingStarted: true
          };
        }
        return msg;
      });

      const draftingMessage = {
        id: Date.now(),
        type: 'assistant' as const,
        content: "I'm now drafting your complaint. This will take a few moments as I incorporate all relevant case facts and structure it according to your specifications.",
        timestamp: new Date(),
        isDrafting: true
      };

      return {
        ...currentTask,
        phase: 'drafting' as const,
        status: 'Generating' as const,
        draftingStartTime: startTime,
        elapsedTime: 0,
        messages: [...updatedMessages, draftingMessage]
      };
    });

    // Update elapsed time every second
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setDraftingTask(prev => prev ? {...prev, elapsedTime: elapsed} : null);

      // Update job elapsed time
      updateJob(job.id, { elapsedTime: elapsed });

      // Complete draft after 30 seconds
      if (elapsed >= 30) {
        clearInterval(interval);
        completeDraft();
      }
    }, 1000);
  };

  // Complete draft
  const completeDraft = () => {
    setDraftingTask(currentTask => {
      if (!currentTask) return currentTask;

      // Prevent duplicate completion (check if already completed)
      if (currentTask.phase === 'complete') return currentTask;

      // Update job status to complete
      updateJob(`job-${currentTask.id}`, {
        status: 'Complete',
        completedAt: new Date()
      });

      // Update the drafting message to show completion
      const updatedMessages = currentTask.messages.map(msg => {
        if (msg.isDrafting) {
          return {
            ...msg,
            isDrafting: false,
            isDraftingComplete: true
          };
        }
        return msg;
      });

      const completionMessage = {
        id: Date.now(),
        type: 'assistant' as const,
        content: "Your complaint draft is ready! I've incorporated all the case facts, applied the legal theories we discussed, and structured it based on your reference document.\n\nYour complaint has been saved to your case files as \"Davis v Johnson - Complaint - Draft 1.docx\".",
        timestamp: new Date(),
        isDraftComplete: true,
        actions: [
          { label: "Review Draft", icon: () => React.createElement(FileText, { size: 16 }), primary: true },
          { label: "Export to Word", icon: () => React.createElement(ExternalLink, { size: 16 }) }
        ]
      };

      return {
        ...currentTask,
        phase: 'complete' as const,
        status: 'Draft complete' as const,
        draftReady: true,
        messages: [...updatedMessages, completionMessage]
      };
    });

    // Add completion notification outside of state setter to prevent duplicates
    setTimeout(() => {
      addNotification({
        type: 'success',
        title: 'Draft Complete',
        message: 'Your complaint draft is ready for review',
        actions: [
          {
            label: 'Review Document',
            action: 'review',
            icon: () => React.createElement(Eye, { size: 14 }),
            primary: true
          },
          {
            label: 'Export to Word',
            action: 'export',
            icon: () => React.createElement(Download, { size: 14 })
          }
        ]
      });
    }, 100);
  };

  return {
    handleFileUpload,
    startDrafting,
    completeDraft
  };
};