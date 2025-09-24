import { useState, useEffect } from 'react';
import { Home, BarChart2, Layers, List, PenTool, ChevronDown, MoreVertical, Zap, Send, Plus, MoreHorizontal, FileText, X, Bell, Briefcase, MessageSquare, Eye, Upload, Paperclip, Search, Check, ChevronRight, MessageCircle, FileBarChart, Edit } from 'lucide-react';


// Import organized components and hooks
import DraftingView from './eve-compete/components/views/DraftingView';
import CaseOverviewView from './eve-compete/components/views/CaseOverviewView';
import ExploreView from './eve-compete/components/views/ExploreView';
import DocumentCanvasView from './eve-compete/components/views/DocumentCanvasView';
import NotificationPanel from './eve-compete/components/panels/NotificationPanel';
import JobsListPanel from './eve-compete/components/panels/JobsListPanel';
import SourceSelectorModal from './eve-compete/components/modals/SourceSelectorModal';
import UnifiedLibraryModal from './eve-compete/components/modals/UnifiedLibraryModal';
import Message from './eve-compete/components/chat/Message';
import { useWorkflowState } from './eve-compete/hooks/useWorkflowState';
import { useWorkflowActions } from './eve-compete/hooks/useWorkflowActions';
import { useDraftingState } from './eve-compete/hooks/useDraftingState';
import { useAssumptions } from './eve-compete/hooks/useAssumptions';
import { useDraftingWorkflow } from './eve-compete/hooks/useDraftingWorkflow';

// Import new custom hooks
import { useModalState } from './eve-compete/hooks/useModalState';
import { useChatTabs } from './eve-compete/hooks/useChatTabs';
import { useJobsState } from './eve-compete/hooks/useJobsState';

const SupioDocumentHomepage = () => {
  // Custom hooks for state management
  const [modalState, modalActions] = useModalState();
  const [chatTabState, chatTabActions] = useChatTabs();
  const [jobsState, jobsActions] = useJobsState();

  // Extract commonly used state for backward compatibility
  const {
    showMoreMenu, showAIPanel, showUnifiedModal, showPromptsModal,
    unifiedModalDefaultTab, selectedBlueprintId, openInExampleMode,
    showToast, toastMessage, showCanvas
  } = modalState;

  const {
    setShowMoreMenu, setShowAIPanel, setShowUnifiedModal, setShowPromptsModal,
    setUnifiedModalDefaultTab, setSelectedBlueprintId, setOpenInExampleMode,
    setShowToast, setToastMessage, setShowCanvas,
    closeUnifiedModal, showToastMessage
  } = modalActions;

  const {
    chatTabs, activeChatTab, tabMessages, tabFiles, tabStagedFiles, conversationInputs
  } = chatTabState;

  const {
    setChatTabs, setActiveChatTab, setTabMessages, setTabFiles, setTabStagedFiles,
    setConversationInputs, updateConversationInput,
    getTabLastMessageTimestamp, getFirstRealConversation, findStagedConversation,
    isConversationStaged, getVisibleAITabs
  } = chatTabActions;

  const { jobs, notifications, selectedJob } = jobsState;
  const { setSelectedJob, addJob, updateJob, addNotification } = jobsActions;
  const [documentChatMode, setDocumentChatMode] = useState<'draft' | 'explain'>('explain');
  const [hasDocumentSelection, setHasDocumentSelection] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [chatContext, setChatContext] = useState<'section' | 'document'>('section');
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [conversationSources, setConversationSources] = useState<Record<number, Set<string>>>({});
  const [deepResearchMode, setDeepResearchMode] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'answer' | 'analysis' | 'document'>('answer');
  const [showOutputFormatDropdown, setShowOutputFormatDropdown] = useState(false);
  const [showAITabMenu, setShowAITabMenu] = useState(false);

  // Independent state for Actions card
  const [actionsDeepResearchMode, setActionsDeepResearchMode] = useState(false);
  const [actionsOutputFormat, setActionsOutputFormat] = useState<'answer' | 'analysis' | 'document'>('answer');
  const [actionsShowOutputFormatDropdown, setActionsShowOutputFormatDropdown] = useState(false);
  const [actionsFiles, setActionsFiles] = useState<Array<{id: string; name: string; size: number; type: string; file: File}>>([]);

  // Conversation-level file storage (shared between AI Assistant and Explore tab)
  const [conversationFiles, setConversationFiles] = useState<Record<string, Array<{id: string; name: string; size: number; type: string; file: File; conversationId: string}>>>({});

  // Independent state for AI Assistant (now only for staging)
  const [aiAssistantStagedFiles, setAiAssistantStagedFiles] = useState<Array<{id: string; name: string; size: number; type: string; file: File}>>([]);

  // Default conversation ID (shared between AI Assistant and first Explore tab)
  const DEFAULT_CONVERSATION_ID = 'main-conversation';
  const [savedBlueprints, setSavedBlueprints] = useState<Array<{id: string; title: string; description: string; referenceFile: string; documentType?: string; additionalInstructions?: string}>>([]);

  const workflowState = useWorkflowState();
  const workflowActions = useWorkflowActions({
    setActiveTab: workflowState.setActiveTab,
  });

  // Drafting state for complete workflow
  const {
    // State
    messages, setMessages,
    currentPhase, setCurrentPhase,
    viewMode, setViewMode,
    draftingTask, setDraftingTask,
    draftingStarted, setDraftingStarted,
    customInputs, setCustomInputs,
    customModeAssumption, setCustomModeAssumption,
    editingCustomAssumption, setEditingCustomAssumption,
    originalResponseBeforeEdit, setOriginalResponseBeforeEdit,
    showNotifications, setShowNotifications,
    showJobsList, setShowJobsList,
    messagesEndRef,

    // Functions
    addMessage,
    addAssistantMessage,
    addAssistantMessageToTask,
    createDraftingTask,
    reopenDraftingTask,
  } = useDraftingState();

  // Assumptions management
  const {
    handleAssumptionResponse,
    handleCustomInput,
    toggleCustomMode,
    cancelCustomInstruction,
    confirmCustomInstruction,
    editCustomInstruction,
    presentAssumptions,
  } = useAssumptions(
    draftingTask,
    setDraftingTask,
    customInputs,
    setCustomInputs,
    customModeAssumption,
    setCustomModeAssumption,
    setEditingCustomAssumption,
    setOriginalResponseBeforeEdit
  );

  // Drafting workflow
  const {
    handleFileUpload,
    startDrafting,
    completeDraft
  } = useDraftingWorkflow(
    draftingTask,
    setDraftingTask,
    setDraftingStarted,
    addJob,
    updateJob,
    addNotification,
    presentAssumptions
  );

  // Handle AI chat submit
  const handleAIChatSubmit = () => {
    const currentInput = getCurrentConversationInput();
    if (!currentInput.trim()) return;
    if (!hasSelectedSources()) return; // Block if no sources selected

    const userMessage = currentInput;
    setCurrentConversationInput('');

    let currentFiles: Array<{id: string; name: string; size: number; type: string; file: File}> = [];

    // Handle files based on context (AI Assistant vs Explore tab)
    const conversationId = getCurrentConversationId();

    if (workflowState.activeTab === 'explore') {
      // Explore tab: move staged files to conversation storage
      currentFiles = getActiveTabStagedFiles();
      if (currentFiles.length > 0) {
        if (conversationId) {
          // Add to conversation-level storage
          addFilesToConversation(conversationId, currentFiles);
        } else {
          // Fallback to tab-level storage for non-conversation contexts
          setTabFiles(prev => ({
            ...prev,
            [activeChatTab]: [...(prev[activeChatTab] || []), ...currentFiles]
          }));
        }
        // Clear staged files
        setTabStagedFiles(prev => ({
          ...prev,
          [activeChatTab]: []
        }));
      }
    } else if (showAIPanel) {
      // AI Assistant: move staged files to conversation storage
      const currentTabFiles = tabStagedFiles[activeChatTab] || [];
      currentFiles = currentTabFiles;
      if (currentTabFiles.length > 0 && conversationId) {
        addFilesToConversation(conversationId, currentTabFiles);
        // Clear staged files for this tab
        setTabStagedFiles(prev => ({
          ...prev,
          [activeChatTab]: []
        }));
      }
    }

    // Create message content with file context
    let messageContent = userMessage;
    if (currentFiles.length > 0) {
      const fileList = currentFiles.map(f => f.name).join(', ');
      messageContent = `${userMessage}\n\n📎 **Attached files:** ${fileList}`;
    }

    // Clear uploaded files from the tab (but keep them in selectedSources for future use)
    if (currentFiles.length > 0) {
      setTabFiles(prev => ({
        ...prev,
        [activeChatTab]: []
      }));
    }

    // Add user message to active tab
    addMessageToTab(activeChatTab, {
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
    });

    // Simulate AI response after delay
    setTimeout(() => {
      let responseContent = "I'm ready to assist with the Garcia MVA case. I can help analyze evidence, draft documents, review medical records, calculate damages, or answer legal questions. What would you like me to focus on?";

      if (currentFiles.length > 0) {
        responseContent = `I can see you've uploaded ${currentFiles.length} file${currentFiles.length > 1 ? 's' : ''}: ${currentFiles.map(f => f.name).join(', ')}.

I've analyzed these documents and can help you with:

• **Key Evidence Review** - Extract critical facts and timeline
• **Document Summarization** - Highlight important findings
• **Legal Analysis** - Identify strengths and weaknesses
• **Damage Calculations** - Review medical bills and lost wages
• **Case Strategy** - Recommend next steps

What specific aspect would you like me to focus on first?`;
      }

      addMessageToTab(activeChatTab, {
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      });
    }, 1000);
  };

  // Helper functions for per-tab messages
  const getActiveTabMessages = () => {
    return tabMessages[activeChatTab] || [];
  };

  const addMessageToTab = (tabId: number, message: any) => {
    const isFirstMessage = !(tabMessages[tabId] && tabMessages[tabId].length > 0);

    setTabMessages(prev => ({
      ...prev,
      [tabId]: [...(prev[tabId] || []), message]
    }));

    // If this is the first message in a conversation, give it high priority for AI Assistant ordering
    if (isFirstMessage && message.type === 'user') {
      const now = Date.now();
      console.log(`First message added to tab ${tabId}, promoting to high priority: ${now}`);
      setChatTabs(prev => prev.map(tab =>
        tab.id === tabId
          ? { ...tab, aiPosition: now }
          : tab
      ));
    }
  };

  // Helper functions for per-tab files
  const getActiveTabFiles = () => {
    return tabFiles[activeChatTab] || [];
  };

  // Helper functions for tab message info
  const getTabLastMessage = (tabId: number) => {
    const tabMessageList = tabMessages[tabId] || [];
    if (tabMessageList.length === 0) return null;
    return tabMessageList[tabMessageList.length - 1];
  };

  const getTabLastMessageSnippet = (tabId: number) => {
    const lastMessage = getTabLastMessage(tabId);
    if (!lastMessage) return '';

    // Extract text content from message, truncate to ~50 characters
    const content = lastMessage.content || '';
    const cleanContent = content.replace(/\*\*(.*?)\*\*/g, '$1').replace(/📎.*$/m, '').trim();
    return cleanContent.length > 50 ? cleanContent.substring(0, 50) + '...' : cleanContent;
  };

  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;

    return timestamp.toLocaleDateString();
  };

  const getSortedChatTabs = (excludeEmpty = false) => {
    let filteredTabs = [...chatTabs];

    // Filter conversations based on context
    if (excludeEmpty) {
      // For Explore: show real conversations + staged conversations created from Explore
      filteredTabs = chatTabs.filter(tab => {
        const messages = tabMessages[tab.id] || [];
        const isStaged = messages.length === 0;

        if (isStaged) {
          // Only show staged conversations that were created from Explore
          return tab.createdFrom === 'explore';
        }
        // Always show real conversations (with messages)
        return true;
      });
    }

    return filteredTabs.sort((a, b) => {
      const aTimestamp = getTabLastMessageTimestamp(a.id);
      const bTimestamp = getTabLastMessageTimestamp(b.id);
      const aIsStaged = !aTimestamp;
      const bIsStaged = !bTimestamp;

      // If in Explore context (excludeEmpty=true), staged conversations go to the top
      if (excludeEmpty) {
        if (aIsStaged && !bIsStaged) return -1; // a (staged) comes first
        if (!aIsStaged && bIsStaged) return 1;  // b (staged) comes first
      } else {
        // Default behavior: staged conversations go to the bottom
        if (aIsStaged && !bIsStaged) return 1;  // b comes first
        if (!aIsStaged && bIsStaged) return -1; // a comes first
      }

      // Both staged or both real - sort by timestamp or ID
      if (!aTimestamp && !bTimestamp) return a.id - b.id;

      // Most recent messages first for real conversations
      return bTimestamp!.getTime() - aTimestamp!.getTime();
    });
  };

  // Move tab to leftmost position (after staged conversation)
  const moveTabToLeftmost = (tabId: number) => {
    const now = Date.now();
    console.log(`Moving tab ${tabId} to leftmost position with priority ${now}`);
    setChatTabs(prev => prev.map(tab =>
      tab.id === tabId
        ? { ...tab, aiPosition: now }
        : tab
    ));
  };

  // Handle opening AI Assistant - ensures proper staged conversation setup
  const handleOpenAIAssistant = () => {
    setShowAIPanel(true);

    // Find or create AI Assistant's staged conversation
    const aiStaged = findStagedConversation('ai-assistant');

    if (aiStaged && !aiStaged.hiddenInAI) {
      // Switch to existing AI Assistant staged conversation
      setActiveChatTab(aiStaged.id);
    } else {
      // Get visible AI Assistant tabs
      const visibleAITabs = getVisibleAITabs();

      if (visibleAITabs.length > 0) {
        // Switch to leftmost visible tab
        setActiveChatTab(visibleAITabs[0].id);
      } else {
        // Create new AI Assistant staged conversation if none exists
        const newTabId = Math.max(...chatTabs.map(tab => tab.id)) + 1;
        const newTab = {
          id: newTabId,
          name: 'New Chat',
          isDocumentTab: false,
          associatedJobId: null,
          createdFrom: 'ai-assistant' as const
        };
        setChatTabs(prev => [...prev, newTab]);

        // Initialize sources for new conversation
        const defaultSources = new Set([
          "msg1", "msg2", "disc1", "disc2", "ev1", "ev2", "fin1", "fin2"
        ]);
        setConversationSources(prev => ({
          ...prev,
          [newTabId]: defaultSources
        }));

        setActiveChatTab(newTabId);
      }
    }
  };

  // Helper functions for conversation files
  const getConversationFiles = (conversationId: string) => {
    return conversationFiles[conversationId] || [];
  };

  const addFilesToConversation = (conversationId: string, files: Array<{id: string; name: string; size: number; type: string; file: File}>) => {
    const filesWithConversationId = files.map(file => ({ ...file, conversationId }));
    setConversationFiles(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), ...filesWithConversationId]
    }));
  };

  const getCurrentConversationId = () => {
    // AI Assistant and Explore tab share conversation IDs based on the active tab
    if (showAIPanel || workflowState.activeTab === 'explore') {
      // Tab 1 (default) uses the main conversation, others get unique IDs
      if (activeChatTab === 1) {
        return DEFAULT_CONVERSATION_ID;
      } else {
        return `conversation-${activeChatTab}`;
      }
    }
    // Actions tab has its own files (not conversation-based)
    return null;
  };

  // Helper functions for staged files
  const addFileToTabStaging = (tabId: number, file: File) => {
    const fileObj = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    };

    setTabStagedFiles(prev => ({
      ...prev,
      [tabId]: [...(prev[tabId] || []), fileObj]
    }));

    // Auto-add uploaded file to current conversation's sources
    const fileSourceId = `uploaded-${fileObj.id}`;
    console.log(`Auto-selecting uploaded file: ${fileSourceId} for tab ${tabId}`);
    console.log(`File object created:`, fileObj);
    setConversationSources(prev => {
      const currentSources = prev[tabId] || new Set<string>();
      const newSet = new Set(currentSources);
      newSet.add(fileSourceId);
      console.log(`Updated sources for tab ${tabId}:`, [...newSet]);
      console.log(`Full conversation sources after update:`, Object.fromEntries(
        Object.entries({...prev, [tabId]: newSet}).map(([key, value]) => [key, [...(value as Set<string>)]])
      ));
      return {
        ...prev,
        [tabId]: newSet
      };
    });

    return fileObj;
  };

  const getActiveTabStagedFiles = () => {
    return tabStagedFiles[activeChatTab] || [];
  };

  const addFileToTab = (tabId: number, file: File) => {
    const fileObj = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    };

    setTabFiles(prev => ({
      ...prev,
      [tabId]: [...(prev[tabId] || []), fileObj]
    }));

    // Auto-select uploaded files as sources
    const fileSourceId = `uploaded-${fileObj.id}`;
    setSelectedSources(prev => new Set([...prev, fileSourceId]));

    return fileObj;
  };

  const removeFileFromTab = (tabId: number, fileId: string) => {
    setTabFiles(prev => ({
      ...prev,
      [tabId]: (prev[tabId] || []).filter(file => file.id !== fileId)
    }));

    // Auto-deselect removed files from sources
    const fileSourceId = `uploaded-${fileId}`;
    setConversationSources(prev => {
      const currentSources = prev[tabId] || new Set<string>();
      const newSet = new Set(currentSources);
      newSet.delete(fileSourceId);
      return {
        ...prev,
        [tabId]: newSet
      };
    });
  };

  // Actions card file handlers
  const handleActionsFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const fileObj = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      };

      setActionsFiles(prev => [...prev, fileObj]);
    });
  };

  const handleActionsFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleActionsFileUpload(e.target.files);
    }
  };

  const removeActionsFile = (fileId: string) => {
    setActionsFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // AI Assistant file handlers
  const handleAiAssistantFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      console.log(`handleAiAssistantFileUpload: Processing file ${file.name} for tab ${activeChatTab}`);

      // Check file size limit
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      // Add to tab staging and auto-select as source using per-conversation state
      addFileToTabStaging(activeChatTab, file);
    });
  };

  const handleAiAssistantFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAiAssistantFileUpload(e.target.files);
    }
  };

  const removeAiAssistantFile = (fileId: string) => {
    // Remove from staged files (displayed files)
    setAiAssistantStagedFiles(prev => prev.filter(file => file.id !== fileId));
    // Also remove from permanent files in case it exists there
    setAiAssistantFiles(prev => prev.filter(file => file.id !== fileId));
    // Remove from selected sources in current conversation
    setConversationSources(prev => {
      const currentSources = prev[activeChatTab] || new Set<string>();
      const newSet = new Set(currentSources);
      newSet.delete(`uploaded-${fileId}`);
      return {
        ...prev,
        [activeChatTab]: newSet
      };
    });
  };

  // Handle chat file upload
  const handleChatFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      addFileToTabStaging(activeChatTab, file);
    });
  };

  // Handle drag and drop for chat files (Explore tab)
  const handleChatFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleChatFileUpload(e.dataTransfer.files);
    }
  };

  // Handle drag and drop for AI Assistant files
  const handleAiAssistantFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleAiAssistantFileUpload(e.dataTransfer.files);
    }
  };

  const handleChatFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleChatFileUpload(e.target.files);
    }
  };

  // Initialize default sources for conversations
  useEffect(() => {
    // Different source selections for each dummy conversation
    const initialConversationSources: Record<number, Set<string>> = {
      // Medical Records Review - focused on medical and evidence sources
      1: new Set(["msg1", "msg2", "ev1", "ev2"]),

      // Damage Calculations - focused on financial and discovery sources
      2: new Set(["fin1", "fin2", "disc1", "disc2", "ev1"]),

      // Expert Witness Prep - comprehensive source selection
      3: new Set(["msg1", "disc1", "disc2", "ev1", "ev2", "fin1"]),

      // New Chat (AI Assistant default) - all sources selected
      4: new Set(["msg1", "msg2", "disc1", "disc2", "ev1", "ev2", "fin1", "fin2"])
    };

    setConversationSources(initialConversationSources);
  }, []); // Empty dependency array means this only runs on mount


  // Close output format dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking inside the dropdown or on the button
      if (target.closest('[data-output-format-dropdown]') || target.closest('[data-output-format-button]')) {
        return;
      }
      setShowOutputFormatDropdown(false);
    };

    if (showOutputFormatDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOutputFormatDropdown]);

  // Close AI tab menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking inside the dropdown menu
      if (!target.closest('.ai-tab-menu-container') && !target.closest('.ai-tab-dropdown')) {
        setShowAITabMenu(false);
      }
    };

    if (showAITabMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAITabMenu]);

  // Get sources for current conversation
  const getCurrentConversationSources = () => {
    const sources = conversationSources[activeChatTab] || new Set<string>();
    console.log(`Getting sources for tab ${activeChatTab}:`, [...sources]);
    return sources;
  };

  // Set sources for current conversation
  const setCurrentConversationSources = (sources: Set<string>) => {
    setConversationSources(prev => ({
      ...prev,
      [activeChatTab]: sources
    }));
  };

  // Get input for current conversation
  const getCurrentConversationInput = () => {
    return conversationInputs[activeChatTab] || '';
  };

  // Set input for current conversation
  const setCurrentConversationInput = (input: string) => {
    setConversationInputs(prev => ({
      ...prev,
      [activeChatTab]: input
    }));
  };

  const getSelectedSourcesCount = () => {
    return getCurrentConversationSources().size;
  };

  const hasSelectedSources = () => {
    return getSelectedSourcesCount() > 0;
  };

  // Handle sending chat messages from document canvas
  const handleSendChatMessage = (message: string, simulateResponse: boolean, responseContent?: string) => {
    // Add user message to active tab
    addMessageToTab(activeChatTab, {
      type: 'user',
      content: message,
      timestamp: new Date(),
    });

    if (simulateResponse && responseContent) {
      // Simulate AI response after delay
      setTimeout(() => {
        addMessageToTab(activeChatTab, {
          type: 'assistant',
          content: responseContent,
          timestamp: new Date(),
        });
      }, 1000);
    }
  };

  // Handle adding new chat tab
  const handleAddChatTab = () => {
    const currentContext = workflowState.activeTab === 'explore' ? 'explore' : 'ai-assistant';

    if (currentContext === 'ai-assistant') {
      // For AI Assistant, use the same logic as handleOpenAIAssistant
      const aiStaged = findStagedConversation('ai-assistant');

      if (aiStaged && !aiStaged.hiddenInAI) {
        // Switch to existing AI Assistant staged conversation
        setActiveChatTab(aiStaged.id);
        return;
      } else {
        // Get visible AI Assistant tabs
        const visibleAITabs = getVisibleAITabs();

        if (visibleAITabs.length > 0) {
          // Check if there's already a staged conversation among visible tabs
          const visibleStaged = visibleAITabs.find(tab =>
            tab.createdFrom === 'ai-assistant' && isConversationStaged(tab.id)
          );

          if (visibleStaged) {
            setActiveChatTab(visibleStaged.id);
            return;
          }
        }

        // Create new AI Assistant staged conversation
        const newTabId = Math.max(...chatTabs.map(tab => tab.id)) + 1;
        const newTab = {
          id: newTabId,
          name: 'New Chat',
          isDocumentTab: false,
          associatedJobId: null,
          createdFrom: 'ai-assistant' as const
        };
        setChatTabs(prev => [...prev, newTab]);

        // Initialize sources for new conversation
        const defaultSources = new Set([
          "msg1", "msg2", "disc1", "disc2", "ev1", "ev2", "fin1", "fin2"
        ]);
        setConversationSources(prev => ({
          ...prev,
          [newTabId]: defaultSources
        }));

        setActiveChatTab(newTabId);
      }
    } else {
      // For Explore, use existing logic
      const existingStaged = findStagedConversation('explore');
      if (existingStaged) {
        // Switch to existing staged conversation
        setActiveChatTab(existingStaged.id);
        return;
      }

      // Create new conversation
      const newTabId = Math.max(...chatTabs.map(tab => tab.id)) + 1;
      const newTab = {
        id: newTabId,
        name: 'New Chat',
        isDocumentTab: false,
        associatedJobId: null,
        createdFrom: 'explore' as const
      };
      setChatTabs([...chatTabs, newTab]);

      // Initialize sources for new conversation
      const defaultSources = new Set([
        "msg1", "msg2", "disc1", "disc2", "ev1", "ev2", "fin1", "fin2"
      ]);
      setConversationSources(prev => ({
        ...prev,
        [newTabId]: defaultSources
      }));

      setActiveChatTab(newTabId);
    }
  };

  // Handle creating document-specific tab
  const handleCreateDocumentTab = (tabName: string, jobId: string) => {
    // Check if a tab for this job already exists
    const existingTab = chatTabs.find(tab => tab.associatedJobId === jobId);

    if (existingTab) {
      // If tab exists, just switch to it
      setActiveChatTab(existingTab.id);
    } else {
      // Create new document tab
      const newTabId = Math.max(...chatTabs.map(tab => tab.id)) + 1;
      const newTab = { id: newTabId, name: tabName, isDocumentTab: true, associatedJobId: jobId };
      setChatTabs([...chatTabs, newTab]);
      setActiveChatTab(newTabId);
    }
  };

  // Helper function to check if a document tab is currently active (associated canvas is open)
  const isDocumentTabActive = (tab: { isDocumentTab: boolean; associatedJobId: string | null }) => {
    if (!tab.isDocumentTab || !tab.associatedJobId) return true; // Regular tabs are always active
    return showCanvas && selectedJob?.id === tab.associatedJobId;
  };

  // Handle closing chat tab - hide from AI Assistant instead of deleting
  const handleCloseChatTab = (tabId: number) => {
    const currentContext = workflowState.activeTab === 'explore' ? 'explore' : 'ai-assistant';

    if (currentContext === 'ai-assistant') {
      // In AI Assistant: hide the tab instead of deleting it
      setChatTabs(prev => prev.map(tab =>
        tab.id === tabId ? { ...tab, hiddenInAI: true } : tab
      ));

      // If closing active tab, switch to leftmost visible AI tab (most recent)
      if (activeChatTab === tabId) {
        const visibleAITabs = getVisibleAITabs().filter(tab => tab.id !== tabId);
        if (visibleAITabs.length > 0) {
          // Select the first tab in the sorted order (leftmost/most recent)
          setActiveChatTab(visibleAITabs[0].id);
        }
      }
    } else {
      // In Explore: keep current delete behavior for now
      if (chatTabs.filter(tab => !tab.hiddenInAI).length === 1) return; // Don't close last visible tab

      const updatedTabs = chatTabs.filter(tab => tab.id !== tabId);
      setChatTabs(updatedTabs);

      // If closing active tab, switch to the first remaining tab
      if (activeChatTab === tabId) {
        setActiveChatTab(updatedTabs[0].id);
      }
    }
  };


  // Handle task card click to switch to drafting tab
  const handleTaskCardClick = () => {
    if (draftingTask) {
      // Find the drafting tab and switch to it
      const draftingTab = chatTabs.find(tab => tab.name === 'Drafting');
      if (draftingTab) {
        setActiveChatTab(draftingTab.id);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  // Handle draft document request from actions pane
  const handleDraftDocumentRequest = () => {
    setUnifiedModalDefaultTab('draft'); // Default to Documents tab
    setShowUnifiedModal(true);
  };

  // Handle prompts library request from document chat
  const handlePromptsLibraryRequest = () => {
    setShowPromptsModal(true);
  };

  // Handle blueprint selection
  const handleSelectBlueprint = (blueprintId: string) => {
    setShowUnifiedModal(false);

    if (blueprintId === 'complaint') {
      // Show toast notification
      setToastMessage('Drafting has started');
      setShowToast(true);

      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);

      // Add job to jobs menu
      const jobId = `job-${Date.now()}`;
      const taskId = Date.now();
      const job = {
        id: jobId,
        title: 'Complaint Drafting',
        description: 'Drafting a legal complaint document',
        type: 'document-generation' as const,
        status: 'In Progress' as const,
        taskId: taskId,
        startTime: Date.now(),
        elapsedTime: 0,
        createdAt: new Date(),
        creationMethod: 'blueprint' as const,
        blueprintName: 'Complaint Template'
      };
      addJob(job);

      // Simulate job completion after 30 seconds
      setTimeout(() => {
        // Update job status
        updateJob(jobId, {
          status: 'Complete',
          elapsedTime: 30000,
          completedAt: new Date()
        });

        // Add notification
        addNotification({
          type: 'success',
          title: 'Draft Complete',
          message: 'Your complaint has been drafted successfully. Click to review.',
          actions: [{
            label: 'Review Draft',
            action: 'review',
            icon: () => <Eye className="h-4 w-4" />,
            primary: true
          }],
          jobId: jobId
        });
      }, 30000);
    } else if (blueprintId.startsWith('saved-')) {
      // Handle saved blueprints
      const savedBlueprint = savedBlueprints.find(bp => bp.id === blueprintId);
      if (savedBlueprint) {
        // Show toast notification
        const docTypeText = savedBlueprint.documentType ? ` ${savedBlueprint.documentType}` : '';
        setToastMessage(`Drafting${docTypeText} has started using saved blueprint "${savedBlueprint.title}"`);
        setShowToast(true);

        // Hide toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000);

        // Add job to jobs menu
        const jobId = `job-${Date.now()}`;
        const taskId = Date.now();
        const jobTitle = savedBlueprint.documentType ?
          `${savedBlueprint.documentType.charAt(0).toUpperCase() + savedBlueprint.documentType.slice(1)} Drafting` :
          `${savedBlueprint.title} Drafting`;
        const job = {
          id: jobId,
          title: jobTitle,
          description: `Drafting ${savedBlueprint.documentType || 'document'} using saved blueprint "${savedBlueprint.title}"`,
          type: 'document-generation' as const,
          status: 'In Progress' as const,
          taskId: taskId,
          startTime: Date.now(),
          elapsedTime: 0,
          createdAt: new Date(),
          creationMethod: 'blueprint' as const,
          blueprintName: savedBlueprint.title,
          referenceFile: savedBlueprint.referenceFile,
          documentType: savedBlueprint.documentType,
          additionalInstructions: savedBlueprint.additionalInstructions
        };
        addJob(job);

        // Simulate job completion after 30 seconds
        setTimeout(() => {
          // Update job status
          updateJob(jobId, {
            status: 'Complete',
            elapsedTime: 30000,
            completedAt: new Date()
          });

          // Show notification
          addNotification({
            type: 'success',
            title: 'Draft Complete',
            message: `Your ${savedBlueprint.documentType || 'document'} draft is ready for review`,
            actions: [{
              label: 'Review Draft',
              action: 'review',
              icon: () => <Eye className="h-4 w-4" />,
              primary: true
            }],
            jobId: jobId
          });
        }, 30000);
      }
    } else {
      console.log(`${blueprintId} selected - coming soon!`);
    }
  };

  // Handle reference document selection
  const handleSelectReferenceDocument = (file: File, documentType?: string, additionalInstructions?: string) => {
    setShowUnifiedModal(false);

    // Show toast notification
    const docTypeText = documentType ? ` ${documentType}` : '';
    setToastMessage(`Drafting${docTypeText} has started using ${file.name}`);
    setShowToast(true);

    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);

    // Add job to jobs menu
    const jobId = `job-${Date.now()}`;
    const taskId = Date.now();
    const jobTitle = documentType ?
      `${documentType.charAt(0).toUpperCase() + documentType.slice(1)} Drafting` :
      'Reference Document Drafting';
    const job = {
      id: jobId,
      title: jobTitle,
      description: `Drafting ${documentType || 'document'} based on ${file.name}`,
      type: 'document-generation' as const,
      status: 'In Progress' as const,
      taskId: taskId,
      startTime: Date.now(),
      elapsedTime: 0,
      createdAt: new Date(),
      creationMethod: 'reference' as const,
      referenceFile: file.name,
      documentType: documentType,
      additionalInstructions: additionalInstructions
    };
    addJob(job);

    // Simulate job completion after 30 seconds
    setTimeout(() => {
      // Update job status
      updateJob(jobId, {
        status: 'Complete',
        elapsedTime: 30000,
        completedAt: new Date()
      });

      // Add notification
      addNotification({
        type: 'success',
        title: 'Draft Complete',
        message: `Your document based on ${file.name} has been drafted successfully. Click to review.`,
        actions: [{
          label: 'Review Draft',
          action: 'review',
          icon: () => <Eye className="h-4 w-4" />,
          primary: true
        }],
        jobId: jobId
      });
    }, 30000);
  };

  // Handle saving reference as blueprint
  const handleSaveReferenceAsBlueprint = (title: string, description: string, referenceFile: string, documentType?: string, additionalInstructions?: string, starred: boolean = false) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const newBlueprint = {
      id: `saved-${Date.now()}`,
      title,
      description,
      referenceFile,
      documentType,
      additionalInstructions,
      createdBy: 'You',
      dateCreated: formattedDate
    };

    setSavedBlueprints(prev => [newBlueprint, ...prev]);

    // Handle starred blueprint
    if (starred) {
      // This would normally be saved to a persistent storage
      // For now, we'll use sessionStorage as a temporary solution
      const starredBlueprintIds = JSON.parse(sessionStorage.getItem('starredBlueprints') || '[]');
      starredBlueprintIds.push(newBlueprint.id);
      sessionStorage.setItem('starredBlueprints', JSON.stringify(starredBlueprintIds));
    }

    // Find and update the job to mark it as saved
    const relatedJob = jobs.find(job => {
      if (job.type === 'document-generation') {
        const docJob = job as any; // Type assertion since we know it's a DocumentGenerationJob
        return docJob.creationMethod === 'reference' &&
               (docJob.referenceFile === referenceFile || docJob.documentType === documentType);
      }
      return false;
    });

    if (relatedJob) {
      updateJob(relatedJob.id, { ...relatedJob, savedAsBlueprint: true } as any);
    }

    // Show success toast
    setToastMessage(`Blueprint "${title}" has been saved`);
    setShowToast(true);

    // Hide toast after delay
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Handle notification actions
  const handleNotificationAction = (action: string, notificationId: number) => {
    if (action === 'review') {
      // Find the notification to get associated job ID
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && notification.title === 'Draft Complete') {
        // Find the specific job using the jobId stored in the notification
        const associatedJob = jobs.find(job => job.id === (notification as any).jobId);

        if (associatedJob) {
          // Navigate to canvas view for this specific job
          setTimeout(() => {
            setSelectedJob(associatedJob);
            setShowCanvas(true);
            setShowNotifications(false);

            // If this job has an associated document tab, switch to it and open AI panel
            const existingTab = chatTabs.find(tab => tab.associatedJobId === associatedJob.id);
            if (existingTab) {
              setActiveChatTab(existingTab.id);
              handleOpenAIAssistant();
            }
          }, 0);
        } else {
          // Fallback: Find the most recent completed job
          const completedJob = jobs
            .filter(job => job.status === 'Complete')
            .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))[0];

          if (completedJob) {
            setTimeout(() => {
              setSelectedJob(completedJob);
              setShowCanvas(true);
              setShowNotifications(false);

              // If this job has an associated document tab, switch to it and open AI panel
              const existingTab = chatTabs.find(tab => tab.associatedJobId === completedJob.id);
              if (existingTab) {
                setActiveChatTab(existingTab.id);
                handleOpenAIAssistant();
              }
            }, 0);
          }
        }
      }
    }
    console.log('Notification action:', action, 'for notification:', notificationId);
  };

  // Handle job click - navigate to canvas view
  const handleJobClick = (job: any) => {
    // Use setTimeout to ensure state updates happen after current event loop
    setTimeout(() => {
      setSelectedJob(job);
      setShowCanvas(true);
      setShowJobsList(false);

      // If this job has an associated document tab, switch to it and open AI panel
      const existingTab = chatTabs.find(tab => tab.associatedJobId === job.id);
      if (existingTab) {
        setActiveChatTab(existingTab.id);
        setShowAIPanel(true);
      }
    }, 0);
  };

  // Handle back from canvas
  const handleBackFromCanvas = () => {
    setShowCanvas(false);
    setSelectedJob(null);
  };

  // Handle navigation to Explore with message
  const handleNavigateToExplore = (message: string) => {
    // Switch to Explore tab
    workflowActions.handleTabClick('explore');

    // Add the user message to the chat
    setTimeout(() => {
      addMessage({
        id: Date.now(),
        type: 'user',
        content: message,
        timestamp: new Date(),
      });
    }, 100);
  };

  // Create sidebar items with icons
  const sidebarItems = [
    { id: 'overview', icon: <Home size={18} />, label: 'Overview' },
    { id: 'explore', icon: <MessageSquare size={18} />, label: 'Explore' },
    { id: 'timeline', icon: <BarChart2 size={18} />, label: 'Timeline' },
    { id: 'drafting', icon: <PenTool size={18} />, label: 'Drafting' },
    { id: 'files', icon: <Layers size={18} />, label: 'Files' }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          [title] {
            position: relative;
          }
          [title]:hover:after {
            animation-delay: 0.3s !important;
          }
        `
      }} />
      <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Nav - Extends full width including over sidebar */}
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-900">Michael Garcia - MVA</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50 flex items-center">
              Export
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Print
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10 w-48">
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Open Case History
                  </button>
                </div>
              )}
            </div>

            {/* Jobs and Notifications in main header */}
            <div className="flex items-center space-x-2">
              {/* Notification Bell */}
              <div className="relative notification-panel-container">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowJobsList(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Bell size={18} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    </div>
                  )}
                </button>
                {showNotifications && (
                  <NotificationPanel
                    notifications={notifications}
                    onNotificationAction={handleNotificationAction}
                  />
                )}
              </div>

              {/* Jobs List */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowJobsList(!showJobsList);
                    setShowNotifications(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Briefcase size={18} />
                  {jobs.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{jobs.length}</span>
                    </div>
                  )}
                </button>
                {showJobsList && (
                  <JobsListPanel
                    jobs={jobs}
                    onJobClick={handleJobClick}
                    onSaveReferenceAsBlueprint={handleSaveReferenceAsBlueprint}
                  />
                )}
              </div>
            </div>

            <button
              onClick={() => showAIPanel ? setShowAIPanel(false) : handleOpenAIAssistant()}
              disabled={workflowState.activeTab === 'explore'}
              className={`px-4 py-2 rounded text-sm font-medium flex items-center transition-colors ${
                workflowState.activeTab === 'explore'
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-teal-700 text-white hover:bg-teal-800'
              }`}
            >
              <Zap className="mr-2 h-4 w-4" />
              AI Assistant
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <div className="w-48 bg-white border-r border-gray-200 flex flex-col z-0 overflow-y-auto">
          <div className="mt-4 flex-1">
            {sidebarItems.map(item => (
              <div
                key={item.id}
                className={`flex items-center px-4 py-2 ${
                  showCanvas
                    ? (item.id === 'drafting' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100')
                    : (workflowState.activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100')
                } cursor-pointer`}
                onClick={() => {
                  if (item.id !== 'timeline' && item.id !== 'files') {
                    // Close canvas if open when navigating to other tabs
                    setShowCanvas(false);
                    setSelectedJob(null);

                    workflowActions.handleTabClick(item.id as any);
                    // Hide AI panel when entering Explore
                    if (item.id === 'explore') {
                      setShowAIPanel(false);
                      // Switch to first real conversation in Explore, or staged Explore conversation if it exists
                      const stagedExplore = findStagedConversation('explore');
                      const firstReal = getFirstRealConversation();

                      if (stagedExplore) {
                        setActiveChatTab(stagedExplore.id);
                      } else if (firstReal) {
                        setActiveChatTab(firstReal.id);
                      }
                    }
                  }
                }}
              >
                <div className="mr-3">{item.icon}</div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Scrolls independently */}
        <main
          className="flex-1 overflow-auto transition-all duration-300"
          style={{ marginRight: showAIPanel ? '30rem' : '0' }}
        >
          {showCanvas && selectedJob ? (
            selectedJob.type === 'document-generation' ? (
              <DocumentCanvasView
                job={jobs.find(j => j.id === selectedJob.id) || selectedJob}
                onBack={handleBackFromCanvas}
                onOpenAIAssistant={handleOpenAIAssistant}
                onCreateDocumentTab={handleCreateDocumentTab}
                onDocumentSelectionChange={(hasSelection, text) => {
                  setHasDocumentSelection(hasSelection);
                  setSelectedText(text || '');
                }}
                onSendChatMessage={handleSendChatMessage}
                onSaveReferenceAsBlueprint={handleSaveReferenceAsBlueprint}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Canvas for {selectedJob.type} jobs coming soon</p>
              </div>
            )
          ) : workflowState.activeTab === 'overview' ? (
              <CaseOverviewView
              aiPanelOpen={showAIPanel}
              onOpenAIPanel={() => {
                handleOpenAIAssistant();
                // If there's an active drafting task, create a drafting tab
                if (draftingTask && !showAIPanel) {
                  setTimeout(() => {
                    reopenDraftingTab();
                  }, 100);
                }
              }}
              onDraftDocumentRequest={handleDraftDocumentRequest}
              onNavigateToExplore={handleNavigateToExplore}
              onOpenLibraryModal={() => setShowUnifiedModal(true)}
              // File upload props - Independent for Actions card
              handleChatFileInputChange={handleActionsFileInputChange}
              getActiveTabFiles={() => actionsFiles}
              removeFileFromTab={(_, fileId) => removeActionsFile(fileId)}
              // Deep research mode props - Independent for Actions card
              deepResearchMode={actionsDeepResearchMode}
              setDeepResearchMode={setActionsDeepResearchMode}
              // Source selection props
              selectedSources={getCurrentConversationSources()}
              setShowSourcePicker={(show) => setShowSourcePicker(show)}
              getSelectedSourcesCount={() => getCurrentConversationSources().size}
              hasSelectedSources={() => getCurrentConversationSources().size > 0}
              // Output format props - Independent for Actions card
              outputFormat={actionsOutputFormat}
              setOutputFormat={setActionsOutputFormat}
            />
          ) : workflowState.activeTab === 'explore' ? (
            <ExploreView
              aiChatInput={getCurrentConversationInput()}
              setAiChatInput={setCurrentConversationInput}
              chatTabs={getSortedChatTabs(true)}
              activeChatTab={activeChatTab}
              onOpenLibraryModal={() => setShowUnifiedModal(true)}
              setActiveChatTab={setActiveChatTab}
              messages={getActiveTabMessages()}
              draftingTask={draftingTask}
              customInputs={customInputs}
              customModeAssumption={customModeAssumption}
              draftingStarted={draftingStarted}
              jobs={jobs}
              notifications={notifications}
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              showJobsList={showJobsList}
              setShowJobsList={setShowJobsList}
              messagesEndRef={messagesEndRef}
              handleAIChatSubmit={handleAIChatSubmit}
              handleAddChatTab={handleAddChatTab}
              handleCloseChatTab={handleCloseChatTab}
              onFileUpload={handleFileUpload}
              onStartDrafting={() => startDrafting(presentAssumptions)}
              onAssumptionResponse={handleAssumptionResponse}
              onCustomInput={handleCustomInput}
              onToggleCustomMode={toggleCustomMode}
              onCancelCustomInstruction={cancelCustomInstruction}
              onConfirmCustomInstruction={confirmCustomInstruction}
              onEditCustomInstruction={editCustomInstruction}
              onReviewDraft={completeDraft}
              onTaskCardClick={handleTaskCardClick}
              onDocumentTypeSelection={(docType: string) => console.log('Document type:', docType)}
              onNotificationAction={handleNotificationAction}
              onJobClick={handleJobClick}
              // File upload and source selection props
              tabFiles={tabStagedFiles}
              getActiveTabFiles={getActiveTabStagedFiles}
              handleChatFileUpload={handleChatFileUpload}
              handleChatFileDrop={handleChatFileDrop}
              handleChatFileInputChange={handleChatFileInputChange}
              removeFileFromTab={(tabId, fileId) => {
                // Remove from staged files
                setTabStagedFiles(prev => ({
                  ...prev,
                  [tabId]: (prev[tabId] || []).filter(file => file.id !== fileId)
                }));
                // Also remove from permanent files in case it exists there
                setTabFiles(prev => ({
                  ...prev,
                  [tabId]: (prev[tabId] || []).filter(file => file.id !== fileId)
                }));
                // Remove from selected sources in current conversation
                setConversationSources(prev => {
                  const currentSources = prev[activeChatTab] || new Set<string>();
                  const newSet = new Set(currentSources);
                  newSet.delete(`uploaded-${fileId}`);
                  return {
                    ...prev,
                    [activeChatTab]: newSet
                  };
                });
              }}
              // Source selection props
              selectedSources={getCurrentConversationSources()}
              setShowSourcePicker={setShowSourcePicker}
              getSelectedSourcesCount={getSelectedSourcesCount}
              hasSelectedSources={hasSelectedSources}
              // Deep research mode props
              deepResearchMode={deepResearchMode}
              setDeepResearchMode={setDeepResearchMode}
              // Output format props
              outputFormat={outputFormat}
              setOutputFormat={setOutputFormat}
              // Tab message info helpers
              getTabLastMessageSnippet={getTabLastMessageSnippet}
              getTabLastMessageTimestamp={getTabLastMessageTimestamp}
              formatRelativeTime={formatRelativeTime}
            />
          ) : (
            <DraftingView
              searchQuery={workflowState.searchQuery}
              setSearchQuery={workflowState.setSearchQuery}
              documentSearchQuery={workflowState.documentSearchQuery}
              setDocumentSearchQuery={workflowState.setDocumentSearchQuery}
              onBlueprintClick={() => {
                setSelectedBlueprintId(undefined); // Clear any previously selected blueprint
                setUnifiedModalDefaultTab('draft');
                setShowUnifiedModal(true);
              }}
              onBlueprintItemClick={(blueprintId) => {
                setSelectedBlueprintId(blueprintId);
                setUnifiedModalDefaultTab('draft');
                setOpenInExampleMode(false); // Ensure we're in blueprint mode
                setShowUnifiedModal(true);
              }}
              onResponsesClick={workflowActions.handleResponsesClick}
              onDraftFromExampleClick={() => {
                setUnifiedModalDefaultTab('draft');
                setOpenInExampleMode(true);
                setShowUnifiedModal(true);
              }}
              jobs={jobs}
              onJobClick={handleJobClick}
              onSaveReferenceAsBlueprint={handleSaveReferenceAsBlueprint}
            />
          )}
        </main>

        {/* AI Assistant Panel */}
        {showAIPanel && (
          <div
            className="absolute right-0 top-0 h-full bg-white border-l border-gray-200 shadow-lg transition-transform duration-300 ease-in-out z-0"
            style={{ width: '30rem' }}
          >
            <div className="flex flex-col h-full">
              {/* Panel Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-900">AI Assistant</h3>
                </div>
              </div>

              {/* Chat Tabs */}
              <div className="border-b border-gray-200 relative">
                <div className="flex items-stretch overflow-x-auto">
                  {/* Tab dropdown menu - positioned outside the overflow container */}
                  {(() => {
                    const visibleTabs = getVisibleAITabs();
                    const maxVisibleTabs = 2;

                    return showAITabMenu && visibleTabs.length > maxVisibleTabs && (
                      <div
                        className="absolute right-0 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-48 ai-tab-dropdown"
                        style={{
                          zIndex: 9999,
                          top: '100%',
                          marginTop: '1px'
                        }}
                      >
                        <div className="text-xs text-gray-500 px-4 py-1 border-b border-gray-100">
                          All Tabs ({visibleTabs.length})
                        </div>
                        {visibleTabs.map((tab, index) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              console.log('Tab clicked:', tab.name, 'ID:', tab.id, 'Index:', index, 'MaxVisible:', maxVisibleTabs);

                              // If this tab is not currently in the visible tabs (index >= maxVisibleTabs),
                              // move it to leftmost position
                              if (index >= maxVisibleTabs) {
                                console.log('Moving tab to leftmost position');
                                moveTabToLeftmost(tab.id);
                              }

                              console.log('Setting active chat tab to:', tab.id);
                              setActiveChatTab(tab.id);
                              console.log('Closing hamburger menu');
                              setShowAITabMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                              activeChatTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <span className="truncate">{tab.name}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                  {/* Add Tab Button */}
                  <button
                    onClick={handleAddChatTab}
                    className="flex items-center justify-center px-3 py-3 border-r border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>

                  {/* Chat Tabs */}
                  {(() => {
                    const visibleTabs = getVisibleAITabs();
                    const maxVisibleTabs = 2;
                    const tabsToShow = visibleTabs.slice(0, maxVisibleTabs);
                    const remainingCount = visibleTabs.length - maxVisibleTabs;

                    return (
                      <>
                        {tabsToShow.map((tab) => {
                    const isTabActive = isDocumentTabActive(tab);
                    const isReadOnly = tab.isDocumentTab && !isTabActive;

                    return (
                      <div
                        key={tab.id}
                        className={`flex items-center px-4 py-3 border-r border-gray-200 text-sm whitespace-nowrap cursor-pointer min-w-0 ${
                          activeChatTab === tab.id
                            ? 'bg-white text-gray-900 border-b-2 border-b-blue-500'
                            : isReadOnly
                              ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveChatTab(tab.id)}
                        title={isReadOnly ? "Read-only: Open the associated document to edit" : undefined}
                      >
                        <span className={`truncate ${isReadOnly ? 'italic' : ''}`}>
                          {tab.name}
                          {isReadOnly && (
                            <span className="ml-1 text-xs opacity-60">(read-only)</span>
                          )}
                        </span>
                        {tab.name === 'Drafting' && draftingTask && (
                          <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            draftingTask.status === 'Generating' && draftingTask.phase === 'drafting' ? 'bg-blue-100 text-blue-800' :
                            draftingTask.status === 'Needs input' ? 'bg-yellow-100 text-yellow-800' :
                            draftingTask.status === 'Draft complete' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {draftingTask.status === 'Generating' && draftingTask.phase === 'drafting' ? 'generating' :
                             draftingTask.status === 'Needs input' ? 'input needed' :
                             draftingTask.status === 'Draft complete' ? 'complete' : draftingTask.status}
                          </span>
                        )}
                        {(() => {
                          const visibleTabs = chatTabs.filter(t =>
                            !t.hiddenInAI &&
                            (t.createdFrom !== 'explore' || !isConversationStaged(t.id))
                          );
                          return visibleTabs.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCloseChatTab(tab.id);
                              }}
                              className="ml-3 text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          );
                        })()}
                      </div>
                    );
                        })}

                        {/* Overflow indicator */}
                        {remainingCount > 0 && (
                          <div className="flex items-center px-3 py-3 border-r border-gray-200 text-gray-500 text-sm">
                            +{remainingCount}
                          </div>
                        )}

                      </>
                    );
                  })()}

                  {/* Spacer to push hamburger menu to right */}
                  <div className="flex-1"></div>

                  {/* Tab menu button - positioned at the right */}
                  {(() => {
                    const visibleTabs = getVisibleAITabs();
                    const maxVisibleTabs = 2;

                    return visibleTabs.length > maxVisibleTabs ? (
                      <div className="relative ai-tab-menu-container">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Hamburger clicked, current state:', showAITabMenu);
                            setShowAITabMenu(!showAITabMenu);
                          }}
                          className="flex items-center justify-center px-3 py-3 h-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l border-gray-200"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                      </div>
                    ) : null;
                  })()}
                </div>
              </div>


              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {getActiveTabMessages().length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {chatTabs.find(tab => tab.id === activeChatTab)?.isDocumentTab ? (
                          <PenTool className="w-8 h-8 text-gray-400" />
                        ) : (
                          <MessageSquare className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="text-gray-500">
                        {chatTabs.find(tab => tab.id === activeChatTab)?.isDocumentTab ? (
                          <p className="mb-1">Highlight a section of the document to edit, cite, or explain information.</p>
                        ) : (
                          <>
                            <p className="mb-1">Ask a question or describe a task.</p>
                            <p>You can upload or drag and drop any additional documents you want to work with.</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {getActiveTabMessages().map((message, index) => (
                      <Message
                        key={index}
                        message={message}
                        isInDraftingTab={activeChatTab > 1}
                        draftingTask={draftingTask}
                        customInputs={customInputs}
                        customModeAssumption={customModeAssumption}
                        draftingStarted={draftingStarted}
                        onFileUpload={handleFileUpload}
                        onStartDrafting={() => startDrafting(presentAssumptions)}
                        onAssumptionResponse={handleAssumptionResponse}
                        onCustomInput={handleCustomInput}
                        onToggleCustomMode={toggleCustomMode}
                        onCancelCustomInstruction={cancelCustomInstruction}
                        onConfirmCustomInstruction={confirmCustomInstruction}
                        onEditCustomInstruction={editCustomInstruction}
                        onReviewDraft={completeDraft}
                        onTaskCardClick={handleTaskCardClick}
                        onDocumentTypeSelection={(docType: string) => console.log('Document type:', docType)}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Selection indicator bar - positioned like in complaint prototype */}
              {(() => {
                const currentTab = chatTabs.find(tab => tab.id === activeChatTab);
                const isDocumentTab = currentTab?.isDocumentTab;
                const isTabActive = currentTab ? isDocumentTabActive(currentTab) : true;

                return isDocumentTab && isTabActive ? (
                  <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          chatContext === 'document' || (hasDocumentSelection && chatContext === 'section') ? 'bg-blue-500' : 'bg-gray-400'
                        }`}></div>
                        <span className={`font-medium ${
                          chatContext === 'document' || (hasDocumentSelection && chatContext === 'section') ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          Selection: {
                            chatContext === 'document' ? 'Entire Document' :
                            hasDocumentSelection ?
                              (selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText)
                              : 'No Selection'
                          }
                        </span>
                      </div>
                      <button
                        onClick={() => setChatContext(chatContext === 'section' ? 'document' : 'section')}
                        className="flex items-center text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100"
                      >
                        {chatContext === 'section' ? 'Switch to Document' : 'Switch to Selection'}
                      </button>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Uploaded Files Display */}
              {(() => {
                const currentTabFiles = tabStagedFiles[activeChatTab] || [];
                return currentTabFiles.length > 0 && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Uploaded Files ({currentTabFiles.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentTabFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm"
                      >
                        <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </div>
                        </div>
                        <button
                          onClick={() => removeFileFromTab(activeChatTab, file.id)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                );
              })()}

              {/* Chat Input */}
              <div
                className="p-6 bg-white border-t border-gray-200"
                onDrop={handleAiAssistantFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
              >
                {(() => {
                  const currentTab = chatTabs.find(tab => tab.id === activeChatTab);
                  const isTabActive = currentTab ? isDocumentTabActive(currentTab) : true;

                  return (
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        onChange={handleAiAssistantFileInputChange}
                        className="hidden"
                        id="chat-file-upload"
                        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.jpg,.jpeg,.png"
                      />
                      <div className={`border border-gray-300 rounded-lg ${isTabActive ? 'bg-white' : 'bg-gray-50'}`}>
                        <textarea
                          value={getCurrentConversationInput()}
                          onChange={(e) => setCurrentConversationInput(e.target.value)}
                          placeholder={
                            !isTabActive
                              ? "Tab is read-only. Open the associated document to continue editing."
                              : currentTab?.isDocumentTab
                                ? "Send a message"
                                : "Send a message"
                          }
                          disabled={!isTabActive}
                          className={`w-full p-3 border-0 rounded-lg resize-none focus:outline-none text-sm ${
                            isTabActive
                              ? 'text-gray-700 placeholder-gray-400'
                              : 'text-gray-400 placeholder-gray-500 cursor-not-allowed'
                          }`}
                          rows={2.5}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && isTabActive) {
                              e.preventDefault();
                              handleAIChatSubmit();
                            }
                          }}
                        />
                        <div className="flex items-center justify-between px-4 pb-3">
                          {/* Left side - Library and Upload buttons */}
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setShowUnifiedModal(true)}
                              disabled={!isTabActive}
                              className={`flex items-center text-sm border border-gray-300 rounded-md px-3 py-1.5 transition-colors ${
                                isTabActive
                                  ? 'text-gray-600 hover:text-gray-900'
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Library
                            </button>
                            <label
                              htmlFor="chat-file-upload"
                              className={`flex items-center justify-center h-8 w-8 rounded-md transition-colors cursor-pointer ${
                                isTabActive
                                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                              title="Upload files"
                            >
                              <Upload className="h-4 w-4" />
                            </label>
                            <button
                              onClick={() => setDeepResearchMode(!deepResearchMode)}
                              disabled={!isTabActive}
                              className={`flex items-center h-8 rounded-md transition-all duration-300 ease-in-out ${
                                !isTabActive
                                  ? 'text-gray-400 cursor-not-allowed px-2'
                                  : deepResearchMode
                                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 pl-2 pr-3'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2'
                              }`}
                              title="Research Mode"
                            >
                              <Search className="h-4 w-4 flex-shrink-0" />
                              {deepResearchMode && isTabActive && (
                                <span className="ml-2 text-sm font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                                  Research
                                </span>
                              )}
                            </button>
                            {/* Output Format Button - Only show if NOT a document canvas chat */}
                            {!(currentTab?.isDocumentTab && showCanvas && selectedJob?.id === currentTab?.associatedJobId) && (
                              <div className="relative">
                                <button
                                  data-output-format-button
                                  onClick={() => setShowOutputFormatDropdown(!showOutputFormatDropdown)}
                                  disabled={!isTabActive}
                                  className={`flex items-center justify-center h-8 w-8 rounded-md transition-colors ${
                                    isTabActive
                                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                      : 'text-gray-400 cursor-not-allowed'
                                  }`}
                                  title="Output Format"
                                >
                                  {outputFormat === 'analysis' ? (
                                    <FileBarChart className="h-4 w-4" />
                                  ) : outputFormat === 'document' ? (
                                    <Edit className="h-4 w-4" />
                                  ) : (
                                    <MessageCircle className="h-4 w-4" />
                                  )}
                                </button>
                                {/* Output Format Dropdown */}
                                {showOutputFormatDropdown && (
                                  <div data-output-format-dropdown className="absolute bottom-0 left-full ml-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                                    <button
                                      onClick={() => {
                                        setOutputFormat('answer');
                                        setShowOutputFormatDropdown(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                                        outputFormat === 'answer' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                      }`}
                                    >
                                      <MessageCircle className="h-4 w-4" />
                                      <span>Answer</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setOutputFormat('analysis');
                                        setShowOutputFormatDropdown(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                                        outputFormat === 'analysis' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                      }`}
                                    >
                                      <FileBarChart className="h-4 w-4" />
                                      <span>Analysis</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setOutputFormat('document');
                                        setShowOutputFormatDropdown(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 rounded-b-lg ${
                                        outputFormat === 'document' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                      }`}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span>Document</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Right side - Mode toggle, Sources, and Send button */}
                          <div className="flex items-center gap-3">
                            {/* Drafting/Research Toggle - only show for document tabs when canvas is not open */}
                            {currentTab?.isDocumentTab && isTabActive && !showCanvas && (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={handlePromptsLibraryRequest}
                                  className="flex items-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-full transition-colors"
                                >
                                  <Zap className="h-3 w-3 mr-1" />
                                  Library
                                </button>
                                <div className="flex items-center bg-gray-100 rounded-full p-1">
                                  <button
                                    onClick={() => setDocumentChatMode('draft')}
                                    className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                                      documentChatMode === 'draft'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                  >
                                    Draft
                                  </button>
                                  <button
                                    onClick={() => setDocumentChatMode('explain')}
                                    className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                                      documentChatMode === 'explain'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                  >
                                    Explain
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Source counter */}
                            <button
                              onClick={() => setShowSourcePicker(true)}
                              className={`text-xs transition-colors cursor-pointer ${
                                hasSelectedSources()
                                  ? 'text-gray-500 hover:text-gray-700'
                                  : 'text-amber-600 hover:text-amber-700 font-medium'
                              }`}
                            >
                              {hasSelectedSources()
                                ? `${getSelectedSourcesCount()} source${getSelectedSourcesCount() === 1 ? '' : 's'}`
                                : 'Select at least 1 source'
                              }
                            </button>

                            {/* Send button */}
                            <button
                              onClick={handleAIChatSubmit}
                              disabled={!getCurrentConversationInput().trim() || !isTabActive || !hasSelectedSources()}
                              className={`p-2 rounded-md transition-colors ${
                                getCurrentConversationInput().trim() && isTabActive && hasSelectedSources()
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Source Picker Modal */}
      <SourceSelectorModal
        show={showSourcePicker}
        onClose={() => setShowSourcePicker(false)}
        selectedSources={(() => {
          const sources = getCurrentConversationSources();
          console.log(`SourceSelectorModal receiving selectedSources for tab ${activeChatTab}:`, [...sources]);
          return sources;
        })()}
        onSourcesChange={setCurrentConversationSources}
        uploadedFiles={(() => {
          const conversationId = getCurrentConversationId();

          if (workflowState.activeTab === 'overview' && !showAIPanel) {
            // Actions tab - use actions files only
            return actionsFiles;
          } else if (conversationId) {
            // AI Assistant or Explore tab - use conversation files
            const files = getConversationFiles(conversationId);
            console.log(`SourceSelectorModal receiving uploadedFiles for conversation ${conversationId}:`, files.map(f => ({id: f.id, name: f.name, sourceId: `uploaded-${f.id}`})));
            return files;
          } else if (workflowState.activeTab === 'explore') {
            // Fallback for explore tabs without conversation context
            return getActiveTabFiles();
          }

          return [];
        })()}
      />

      {/* Unified Library Modal */}
      <UnifiedLibraryModal
        show={showUnifiedModal}
        onClose={() => {
          setShowUnifiedModal(false);
          setUnifiedModalDefaultTab('library'); // Reset to default
          setSelectedBlueprintId(undefined); // Reset selected blueprint
          setOpenInExampleMode(false); // Reset example mode
        }}
        defaultTab={unifiedModalDefaultTab}
        selectedBlueprintId={selectedBlueprintId}
        defaultDocumentView={openInExampleMode ? 'example' : 'blueprint'}
        onSelectBlueprint={handleSelectBlueprint}
        onSelectReferenceDocument={handleSelectReferenceDocument}
        savedBlueprints={savedBlueprints}
      />

      {/* Prompts-Only Modal */}
      <UnifiedLibraryModal
        show={showPromptsModal}
        onClose={() => setShowPromptsModal(false)}
        onSelectBlueprint={handleSelectBlueprint}
        onSelectReferenceDocument={handleSelectReferenceDocument}
        savedBlueprints={savedBlueprints}
        promptsOnly={true}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default SupioDocumentHomepage;