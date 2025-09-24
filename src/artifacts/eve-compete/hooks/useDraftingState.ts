import { useState, useRef, useEffect } from 'react';
import type {
  Message,
  DraftingTask,
  ChatTab,
  Job,
  Notification,
  CurrentPhase,
  ViewMode
} from '../types/drafting-types';
import { initialNotifications, sampleAssumptions } from '../data/sample-data';

export const useDraftingState = () => {
  // Core state
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState('');
  const [currentPhase, setCurrentPhase] = useState<CurrentPhase>('initial');
  const [viewMode, setViewMode] = useState<ViewMode>('clean');

  // Chat tabs and task management
  const [activeChatTab, setActiveChatTab] = useState('main');
  const [chatTabs, setChatTabs] = useState<ChatTab[]>([
    { id: 'main', title: 'AI Assistant', type: 'main' }
  ]);
  const [draftingTask, setDraftingTask] = useState<DraftingTask | null>(null);
  const [draftingStarted, setDraftingStarted] = useState(false);

  // Assumption handling
  const [customInputs, setCustomInputs] = useState<Record<number, string>>({});
  const [customModeAssumption, setCustomModeAssumption] = useState<number | null>(null);
  const [editingCustomAssumption, setEditingCustomAssumption] = useState<number | null>(null);
  const [originalResponseBeforeEdit, setOriginalResponseBeforeEdit] = useState<string | null>(null);

  // Notification and jobs state
  const [showNotifications, setShowNotifications] = useState(false);
  const [showJobsList, setShowJobsList] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Scroll to bottom when drafting task messages change
  useEffect(() => {
    if (draftingTask && draftingTask.messages && activeChatTab !== 'main') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [draftingTask?.messages, activeChatTab]);

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Element;
      if (!target.closest('.notification-panel-container') && !target.closest('.jobs-panel-container')) {
        setShowNotifications(false);
        setShowJobsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Chat tab management
  const closeTab = (tabId: string) => {
    if (tabId === 'main') return;

    setChatTabs(prev => prev.filter(tab => tab.id !== tabId));

    if (activeChatTab === tabId) {
      setActiveChatTab('main');
    }
  };

  const reopenDraftingTab = () => {
    if (!draftingTask) return;

    const existingTab = chatTabs.find(tab => tab.type === 'drafting');
    if (existingTab) {
      setActiveChatTab(existingTab.id);
      return;
    }

    const newDraftingTab: ChatTab = {
      id: `drafting-${draftingTask.id}`,
      title: 'Drafting',
      type: 'drafting',
      taskId: draftingTask.id
    };

    setChatTabs(prev => [...prev, newDraftingTab]);
    setActiveChatTab(newDraftingTab.id);
  };

  // Job management
  const addJob = (job: Job) => {
    setJobs(prev => [...prev, job]);
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, ...updates } : job
    ));
  };

  const handleJobClick = (job: Job) => {
    if (job.type === 'drafting' && draftingTask && job.taskId === draftingTask.id) {
      reopenDraftingTab();
      setShowJobsList(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Notification management
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleNotificationAction = (action: string, notificationId: number) => {
    if (action === 'review') {
      handleReviewDraft();
      setShowNotifications(false);
    } else if (action === 'export') {
      console.log('Exporting to Word...');
      setShowNotifications(false);
    }
  };

  // Message handling
  const addMessage = (messageData: Partial<Message>) => {
    const message: Message = {
      id: Date.now(),
      timestamp: new Date(),
      ...messageData
    } as Message;

    setMessages(prev => [...prev, message]);
  };

  const addAssistantMessage = (content: string, options: Partial<Message> = {}) => {
    const message: Message = {
      id: Date.now(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      ...options
    };

    setMessages(prev => [...prev, message]);
  };

  const addAssistantMessageToTask = (taskId: number, content: string, options: Partial<Message> = {}) => {
    if (!draftingTask || draftingTask.id !== taskId) return;

    const message: Message = {
      id: Date.now(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      ...options
    };

    const updatedTask: DraftingTask = {
      ...draftingTask,
      messages: [...draftingTask.messages, message]
    };
    setDraftingTask(updatedTask);
  };

  // Task creation and management
  const createDraftingTask = () => {
    const taskId = Date.now();

    const initialMessage: Message = {
      id: Date.now() + 1,
      type: 'assistant',
      content: "I'll help you draft a complaint. To ensure I create the most effective document for your case, I'll need a reference complaint to understand your preferred structure and style.\n\nPlease upload a reference complaint that you'd like me to use as a template.",
      timestamp: new Date(),
      showUpload: true
    } as Message;

    const task: DraftingTask = {
      id: taskId,
      title: 'Drafting a Complaint',
      status: 'Needs input',
      phase: 'upload',
      createdAt: new Date(),
      messages: [initialMessage],
      uploadedFile: null,
      assumptions: [],
      assumptionResponses: {},
      draftingStartTime: null,
      elapsedTime: 0,
      draftReady: false
    };

    setDraftingTask(task);

    const newChatTab: ChatTab = {
      id: `drafting-${taskId}`,
      title: 'Drafting',
      type: 'drafting',
      taskId: taskId
    };

    setChatTabs(prev => [...prev, newChatTab]);

    setTimeout(() => {
      setActiveChatTab(newChatTab.id);
    }, 400);
  };

  // Draft review
  const handleReviewDraft = () => {
    if (!draftingTask) return;

    const updatedTask: DraftingTask = {
      ...draftingTask,
      phase: 'review'
    };
    setDraftingTask(updatedTask);
  };

  return {
    // State
    messages, setMessages,
    inputValue, setInputValue,
    currentPhase, setCurrentPhase,
    viewMode, setViewMode,
    activeChatTab, setActiveChatTab,
    chatTabs, setChatTabs,
    draftingTask, setDraftingTask,
    draftingStarted, setDraftingStarted,
    customInputs, setCustomInputs,
    customModeAssumption, setCustomModeAssumption,
    editingCustomAssumption, setEditingCustomAssumption,
    originalResponseBeforeEdit, setOriginalResponseBeforeEdit,
    showNotifications, setShowNotifications,
    showJobsList, setShowJobsList,
    jobs, setJobs,
    notifications, setNotifications,
    messagesEndRef,

    // Actions
    closeTab,
    reopenDraftingTab,
    addJob,
    updateJob,
    handleJobClick,
    addNotification,
    handleNotificationAction,
    addMessage,
    addAssistantMessage,
    addAssistantMessageToTask,
    createDraftingTask,
    handleReviewDraft
  };
};