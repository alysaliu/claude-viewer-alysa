import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Upload, Check, X, AlertCircle, ChevronRight, Loader, ExternalLink, Save, Home, BarChart2, List, PenTool, Layers, Sparkles, FileUp, File, CheckCircle, ChevronDown, Eye, Download, MessageSquare, Plus, ArrowLeft } from 'lucide-react';

const SupioComplaintDrafting = () => {
  // State management
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hi! I'm here to help you with your case. What can I assist you with today?",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [currentPhase, setCurrentPhase] = useState('initial'); // initial, upload, analyzing, assumptions, drafting, complete, review
  const [uploadedFile, setUploadedFile] = useState(null);
  const [assumptions, setAssumptions] = useState([]);
  const [assumptionResponses, setAssumptionResponses] = useState({});
  const [draftingStartTime, setDraftingStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [draftReady, setDraftReady] = useState(false);
  const [viewMode, setViewMode] = useState('clean');
  const [showChat, setShowChat] = useState(false);
  
  // Chat tab and task management
  const [activeChatTab, setActiveChatTab] = useState('main');
  const [chatTabs, setChatTabs] = useState([
    { id: 'main', title: 'AI Assistant', type: 'main' }
  ]);
  const [draftingTask, setDraftingTask] = useState(null);
  const [customInputs, setCustomInputs] = useState({});
  const [customModeAssumption, setCustomModeAssumption] = useState(null);
  const [editingCustomAssumption, setEditingCustomAssumption] = useState(null);
  const [originalResponseBeforeEdit, setOriginalResponseBeforeEdit] = useState(null);
  const [draftingStarted, setDraftingStarted] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sidebar items
  const sidebarItems = [
    { id: 'overview', icon: () => <Home size={18} />, label: 'Overview' },
    { id: 'timeline', icon: () => <BarChart2 size={18} />, label: 'Timeline' },
    { id: 'deep-dive', icon: () => <List size={18} />, label: 'Deep Dive' },
    { id: 'drafting', icon: () => <PenTool size={18} />, label: 'Drafting', active: true },
    { id: 'files', icon: () => <Layers size={18} />, label: 'Files' }
  ];

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

  // Create drafting task and new chat tab
  const createDraftingTask = () => {
    const taskId = Date.now();
    
    // Initial message for drafting tab
    const initialMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: "I'll help you draft a complaint. To ensure I create the most effective document for your case, I'll need a reference complaint to understand your preferred structure and style.\n\nPlease upload a reference complaint that you'd like me to use as a template.",
      timestamp: new Date(),
      showUpload: true
    };
    
    const task = {
      id: taskId,
      title: 'Drafting a Complaint',
      status: 'Needs input', // Needs input, Generating, Draft complete
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
    
    // Create new chat tab for drafting
    const newChatTab = {
      id: `drafting-${taskId}`,
      title: 'Drafting',
      type: 'drafting',
      taskId: taskId
    };
    
    setChatTabs(prev => [...prev, newChatTab]);
    
    // Auto-switch to drafting tab after a brief moment
    setTimeout(() => {
      setActiveChatTab(newChatTab.id);
    }, 400);
  };

  // Handle user message
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    if (activeChatTab === 'main') {
      setMessages(prev => [...prev, userMessage]);
      
      // Check if user is asking to draft a complaint
      if (currentPhase === 'initial' && inputValue.toLowerCase().includes('draft') && inputValue.toLowerCase().includes('complaint')) {
        // Add task creation card to main chat
        setTimeout(() => {
          addAssistantMessage(
            "I'll create a new drafting session for your complaint.",
            { isTaskCard: true, taskType: 'complaint-draft' }
          );
          createDraftingTask();
        }, 1000);
      } else if (currentPhase === 'initial') {
        setTimeout(() => {
          addAssistantMessage("I can help you with various tasks including drafting legal documents, analyzing case files, or answering questions about your case. What would you like to work on?");
        }, 1000);
      }
    } else {
      // Handle messages in drafting chat tab
      handleDraftingTabMessage(userMessage);
    }
    
    setInputValue('');
  };

  // Handle messages in drafting tab
  const handleDraftingTabMessage = (userMessage) => {
    if (!draftingTask) return;
    
    const updatedTask = {
      ...draftingTask,
      messages: [...draftingTask.messages, userMessage]
    };
    setDraftingTask(updatedTask);
  };

  // Add assistant message to main chat
  const addAssistantMessage = (content, options = {}) => {
    const message = {
      id: Date.now(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      ...options
    };
    
    setMessages(prev => [...prev, message]);
  };

  // Add assistant message to drafting task
  const addAssistantMessageToTask = (taskId, content, options = {}) => {
    if (!draftingTask || draftingTask.id !== taskId) return;
    
    const message = {
      id: Date.now(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      ...options
    };
    
    const updatedTask = {
      ...draftingTask,
      messages: [...draftingTask.messages, message]
    };
    setDraftingTask(updatedTask);
  };

  // Handle file upload in drafting tab
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && draftingTask) {
      const fileInfo = {
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type
      };
      
      // Add user message showing file upload
      const uploadMessage = {
        id: Date.now(),
        type: 'user',
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
        phase: 'analyzing',
        status: 'Generating'
      };
      setDraftingTask(updatedTask);
      
      // Start analysis phase
      setTimeout(() => {
        const analysisUpdatedTask = {
          ...updatedTask,
          messages: [...updatedTask.messages, {
            id: Date.now(),
            type: 'assistant',
            content: "Thank you for uploading the reference complaint. I'm now analyzing it along with your case files to understand the context and identify key elements for your complaint.",
            timestamp: new Date(),
            isAnalyzing: true
          }]
        };
        setDraftingTask(analysisUpdatedTask);
        
        // Simulate analysis time
        setTimeout(() => {
          presentAssumptions(analysisUpdatedTask.id);
        }, 3000);
      }, 500);
    }
  };

  // Present assumptions for verification
  const presentAssumptions = (taskId) => {
    setDraftingTask(currentTask => {
      if (!currentTask || currentTask.id !== taskId) return currentTask;
      
      const assumptionsList = [
        {
          id: 1,
          category: "Legal Theory",
          assumption: "Based on the case files and the reference complaint, I'm planning to structure this as a **negligence claim** with emphasis on duty of care breach by the defendant driver.",
          question: "Is negligence the primary legal theory you want to pursue, or should I also include claims for gross negligence or recklessness?",
          options: ["Negligence only", "Include gross negligence", "Include both gross negligence and recklessness"],
          selected: null
        },
        {
          id: 2,
          category: "Damages Strategy",
          assumption: "I notice medical expenses total $47,500 with ongoing treatment. The reference complaint includes future medical costs and loss of earning capacity.",
          question: "Should I include claims for future medical expenses and lost earning capacity based on Dr. Mitchell's prognosis?",
          options: ["Yes, include both", "Only future medical", "Only past damages"],
          selected: null
        },
        {
          id: 3,
          category: "Jurisdictional Basis",
          assumption: "The accident occurred in Springfield County and all parties reside here. I'll assert jurisdiction based on the location of the incident and parties' residence.",
          question: "Are there any additional jurisdictional considerations I should address?",
          options: ["No, location and residence are sufficient", "Add amount in controversy", "Include federal question jurisdiction"],
          selected: null
        },
        {
          id: 4,
          category: "Defendant Information",
          assumption: "I've identified the primary defendant as the other driver. The case files suggest potential employer liability under respondeat superior.",
          question: "Should I name the driver's employer (ABC Delivery Co.) as an additional defendant?",
          options: ["Yes, include the employer", "No, driver only"],
          selected: null
        }
      ];
      
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
        type: 'assistant',
        content: "I've analyzed your reference complaint and case files. Before I begin drafting, I want to confirm these key decisions that will shape your complaint:",
        timestamp: new Date(),
        showAssumptions: true
      };
      
      return {
        ...currentTask,
        phase: 'assumptions',
        status: 'Needs input',
        assumptions: assumptionsList,
        messages: [...updatedMessages, assumptionsMessage]
      };
    });
  };

  // Handle assumption response
  const handleAssumptionResponse = (assumptionId, option) => {
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
              type: 'assistant',
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
  const handleCustomInput = (assumptionId, value) => {
    setCustomInputs(prev => ({
      ...prev,
      [assumptionId]: value
    }));
  };

  // Toggle custom mode for an assumption
  const toggleCustomMode = (assumptionId) => {
    setCustomModeAssumption(assumptionId);
    setEditingCustomAssumption(null);
    // Initialize with existing custom input if it exists
    if (!customInputs[assumptionId]) {
      setCustomInputs(prev => ({
        ...prev,
        [assumptionId]: ''
      }));
    }
  };

  // Cancel custom instruction - always return to preset options
  const cancelCustomInstruction = () => {
    if (customModeAssumption !== null) {
      // Clear the response to return to preset options (no selection)
      const updatedTask = {
        ...draftingTask,
        assumptionResponses: {
          ...draftingTask.assumptionResponses,
          [customModeAssumption]: undefined
        }
      };
      setDraftingTask(updatedTask);
      
      setCustomInputs(prev => ({
        ...prev,
        [customModeAssumption]: ''
      }));
    }
    setCustomModeAssumption(null);
    setEditingCustomAssumption(null);
    setOriginalResponseBeforeEdit(null);
  };

  // Confirm custom instruction
  const confirmCustomInstruction = (assumptionId) => {
    const customText = customInputs[assumptionId];
    if (!customText || !customText.trim()) return;

    handleAssumptionResponse(assumptionId, `Custom: ${customText.trim()}`);
    setCustomModeAssumption(null);
  };

  // Edit custom instruction
  const editCustomInstruction = (assumptionId) => {
    const currentResponse = draftingTask.assumptionResponses[assumptionId];
    
    // Store the original response so we can restore it if cancelled
    setOriginalResponseBeforeEdit(currentResponse);
    
    if (currentResponse && currentResponse.startsWith('Custom: ')) {
      setCustomInputs(prev => ({
        ...prev,
        [assumptionId]: currentResponse.replace('Custom: ', '')
      }));
    }
    setEditingCustomAssumption(assumptionId);
    setCustomModeAssumption(assumptionId);
  };

  // Start drafting
  const startDrafting = () => {
    if (!draftingTask) return;
    
    setDraftingStarted(true);
    const startTime = Date.now();
    
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
        type: 'assistant',
        content: "I'm now drafting your complaint. This will take a few moments as I incorporate all relevant case facts and structure it according to your specifications.",
        timestamp: new Date(),
        isDrafting: true
      };
      
      return {
        ...currentTask,
        phase: 'drafting',
        status: 'Generating',
        draftingStartTime: startTime,
        elapsedTime: 0,
        messages: [...updatedMessages, draftingMessage]
      };
    });
    
    // Update elapsed time every second
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setDraftingTask(prev => prev ? {...prev, elapsedTime: elapsed} : null);
      
      // Complete draft after 5 seconds
      if (elapsed >= 5) {
        clearInterval(interval);
        completeDraft();
      }
    }, 1000);
  };

  // Complete draft
  const completeDraft = () => {
    setDraftingTask(currentTask => {
      if (!currentTask) return currentTask;
      
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
        type: 'assistant',
        content: "Your complaint draft is ready! I've incorporated all the case facts, applied the legal theories we discussed, and structured it based on your reference document.\n\nYour complaint has been saved to your case files as \"Davis v Johnson - Complaint - Draft 1.docx\".",
        timestamp: new Date(),
        isDraftComplete: true,
        actions: [
          { label: "Review Draft", icon: () => <FileText size={16} />, primary: true },
          { label: "Export to Word", icon: () => <ExternalLink size={16} /> }
        ]
      };
      
      return {
        ...currentTask,
        phase: 'complete',
        status: 'Draft complete',
        draftReady: true,
        messages: [...updatedMessages, completionMessage]
      };
    });
  };

  // Handle review draft click
  const handleReviewDraft = () => {
    if (!draftingTask) return;
    
    const updatedTask = {
      ...draftingTask,
      phase: 'review'
    };
    setDraftingTask(updatedTask);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Needs input':
        return 'bg-yellow-100 text-yellow-800';
      case 'Generating':
        return 'bg-blue-100 text-blue-800';
      case 'Draft complete':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle task card click to switch to drafting tab
  const handleTaskCardClick = () => {
    if (draftingTask) {
      const draftingTab = chatTabs.find(tab => tab.type === 'drafting');
      if (draftingTab) {
        setActiveChatTab(draftingTab.id);
      }
    }
  };

  // Message component
  const Message = ({ message, isInDraftingTab = false }) => {
    const isUser = message.type === 'user';
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-full ${isUser ? 'order-2' : 'order-1'}`}>
          {!isUser && (
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Supio Assistant</span>
            </div>
          )}
          
          {/* File upload message */}
          {message.isFile && (
            <div className="bg-gray-100 rounded-lg px-4 py-3 inline-block">
              <div className="flex items-center space-x-3">
                <File size={20} className="text-gray-600" />
                <div>
                  <div className="font-medium text-gray-800">{message.file.name}</div>
                  <div className="text-sm text-gray-500">{message.file.size}</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Task creation card */}
          {message.isTaskCard && draftingTask && (
            <div 
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors max-w-2xl"
              onClick={handleTaskCardClick}
            >
              <div className="mb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <PenTool size={20} className="text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{draftingTask.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-3 flex-shrink-0 ${getStatusBadgeColor(draftingTask.status)}`}>
                          {draftingTask.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Started {draftingTask.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {draftingTask.status === 'Generating' && draftingTask.phase === 'drafting' && (
                    <div className="flex items-center space-x-2">
                      <Loader className="animate-spin" size={14} />
                      <span>Drafting... {draftingTask.elapsedTime}s</span>
                    </div>
                  )}
                  {draftingTask.status === 'Needs input' && draftingTask.phase === 'assumptions' && (
                    <span>Verifying assumptions</span>
                  )}
                  {draftingTask.status === 'Needs input' && draftingTask.phase === 'upload' && (
                    <span>Needs reference doc</span>
                  )}
                  {draftingTask.status === 'Draft complete' && (
                    <span>Ready for review</span>
                  )}
                </div>
                <div className="text-blue-600 text-sm font-medium">
                  Click to view →
                </div>
              </div>
            </div>
          )}
          
          {/* Regular message */}
          {!message.isFile && !message.isTaskCard && (
            <div className={`rounded-lg px-4 py-3 ${
              isUser 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-200 text-gray-800'
            }`}>
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* Upload interface */}
              {message.showUpload && isInDraftingTab && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center py-6 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Click to upload reference complaint</span>
                    <span className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX</span>
                  </button>
                </div>
              )}
              
              {/* Analyzing indicator */}
              {message.isAnalyzing && (
                <div className="mt-4 flex items-center space-x-2 text-blue-600">
                  <Loader className="animate-spin" size={16} />
                  <span className="text-sm">Analyzing reference document and case files...</span>
                </div>
              )}
              
              {/* Analysis complete indicator */}
              {message.isAnalyzingComplete && (
                <div className="mt-4 flex items-center space-x-2 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm">Analysis complete</span>
                </div>
              )}
              
              {/* Begin Drafting button */}
              {message.showBeginDrafting && isInDraftingTab && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={startDrafting}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Begin Drafting
                    <ChevronRight size={20} className="ml-2" />
                  </button>
                </div>
              )}
              
              {/* Drafting started indicator */}
              {message.isDraftingStarted && (
                <div className="mt-4 flex items-center space-x-2 text-blue-600">
                  <span className="text-sm">Drafting started...</span>
                </div>
              )}
              
              {/* Assumptions list */}
              {message.showAssumptions && isInDraftingTab && draftingTask && draftingTask.assumptions.length > 0 && (
                <div className="mt-4 space-y-4">
                  {draftingTask.assumptions.map((assumption, index) => {
                    const currentResponse = draftingTask.assumptionResponses[assumption.id];
                    const isCustomResponse = currentResponse && currentResponse.startsWith('Custom: ');
                    const isInCustomMode = customModeAssumption === assumption.id;
                    
                    return (
                      <div key={assumption.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {assumption.category}
                          </span>
                          {currentResponse && (
                            <CheckCircle size={16} className="text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{assumption.assumption}</p>
                        <p className="text-sm font-medium text-gray-900 mb-2">{assumption.question}</p>
                        
                        {/* Show custom input mode */}
                        {isInCustomMode ? (
                          <div className="space-y-3">
                            <textarea
                              key={assumption.id}
                              value={customInputs[assumption.id] || ''}
                              onChange={(e) => handleCustomInput(assumption.id, e.target.value)}
                              placeholder="Enter your custom instruction for this aspect of the complaint..."
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows="3"
                              autoFocus
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={cancelCustomInstruction}
                                className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                              >
                                Cancel Instruction
                              </button>
                              <button
                                onClick={() => confirmCustomInstruction(assumption.id)}
                                disabled={!customInputs[assumption.id]?.trim()}
                                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        ) : isCustomResponse ? (
                          /* Show confirmed custom response with edit option */
                          <div className="space-y-3">
                            <textarea
                              value={currentResponse.replace('Custom: ', '')}
                              disabled
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-700 resize-none"
                              rows="3"
                            />
                            <div className="flex justify-end">
                              <button
                                onClick={() => editCustomInstruction(assumption.id)}
                                disabled={draftingStarted}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                  draftingStarted
                                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                    : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                                }`}
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Show preset options */
                          <div className="space-y-2">
                            {assumption.options.map((option, optIndex) => (
                              <button
                                key={optIndex}
                                onClick={() => !draftingStarted && handleAssumptionResponse(assumption.id, option)}
                                disabled={draftingStarted}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                  currentResponse === option
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : draftingStarted
                                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                            
                            {/* Custom instruction trigger button */}
                            <button
                              onClick={() => !draftingStarted && toggleCustomMode(assumption.id)}
                              disabled={draftingStarted}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm border border-gray-200 transition-colors ${
                                draftingStarted
                                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                  : 'text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              Provide custom instruction...
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Drafting progress */}
              {message.isDrafting && isInDraftingTab && draftingTask && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Loader className="animate-spin" size={16} />
                    <span className="text-sm">Drafting complaint...</span>
                    <span className="text-sm font-medium">{draftingTask.elapsedTime}s elapsed</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Incorporating case facts and legal arguments...
                  </div>
                </div>
              )}
              
              {/* Drafting complete indicator */}
              {message.isDraftingComplete && (
                <div className="mt-4 flex items-center space-x-2 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm">Drafting completed in 5 seconds!</span>
                </div>
              )}
              
              {/* Draft complete actions */}
              {message.isDraftComplete && message.actions && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {message.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (action.label === "Review Draft") {
                          handleReviewDraft();
                        }
                      }}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        action.primary
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {action.icon()}
                      <span className="ml-2">{action.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="text-xs text-gray-400 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };

  // Review interface component
  const ReviewInterface = () => (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Davis v. Johnson - MVA Case</h1>
          <div className="flex items-center space-x-3">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Update case
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Case history
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-white border-r border-gray-200">
          <div className="p-4 space-y-1">
            {sidebarItems.map(item => (
              <div
                key={item.id}
                className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
                  item.active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon()}
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Document Editor */}
        <div className="flex-1 bg-white">
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="font-medium text-gray-900">Complaint - Davis v. Johnson</h2>
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                  98% Complete
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('clean')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'clean' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Clean View
                  </button>
                  <button
                    onClick={() => setViewMode('changes')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'changes' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Changes View
                  </button>
                  <button
                    onClick={() => setViewMode('compare')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'compare' ? 'bg-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Compare
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Document Content */}
          <div className="p-8 prose max-w-none overflow-auto">
            <h1 className="text-center text-2xl font-bold mb-8">
              IN THE CIRCUIT COURT OF SPRINGFIELD COUNTY<br />
              STATE OF ILLINOIS, LAW DIVISION
            </h1>

            <div className="mb-8">
              <p className="font-bold">SARAH DAVIS,</p>
              <p className="ml-8">Plaintiff,</p>
              <p className="mt-2">v.</p>
              <p className="mt-2 font-bold">MICHAEL JOHNSON,</p>
              <p className="font-bold">and <span className="bg-yellow-200">[INSURANCE COMPANY - needs confirmation]</span>,</p>
              <p className="ml-8">Defendants.</p>
            </div>

            <h2 className="text-center font-bold text-xl mb-6">COMPLAINT AT LAW</h2>

            <p className="mb-4">
              NOW COMES the Plaintiff, <span className="font-semibold">SARAH DAVIS</span>, by and through undersigned counsel, 
              and brings this Complaint against Defendants <span className="font-semibold">MICHAEL JOHNSON</span> and{' '}
              <span className="bg-yellow-200">[INSURANCE COMPANY - needs confirmation]</span>, and in support states as follows:
            </p>

            <h3 className="font-bold mt-6 mb-3">PARTIES</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Plaintiff <span className="font-semibold">SARAH DAVIS</span> is an individual residing in Springfield County, Illinois.
              </li>
              <li>
                Defendant <span className="font-semibold">MICHAEL JOHNSON</span> is an individual residing in Springfield County, Illinois.
              </li>
              <li>
                {viewMode === 'changes' && <span className="line-through text-gray-400">Defendant XYZ INSURANCE is a corporation...</span>}
                <span className={viewMode === 'changes' ? "bg-blue-100" : ""}>
                  Defendant <span className="bg-yellow-200">[INSURANCE COMPANY]</span> is believed to be the insurance carrier
                  for Defendant MICHAEL JOHNSON.
                </span>
              </li>
            </ol>

            <h3 className="font-bold mt-6 mb-3">FACTS</h3>
            <ol className="list-decimal pl-6 space-y-2" start="4">
              <li>
                On <span className="font-semibold">March 15, 2024</span>, at approximately 2:30 PM, Plaintiff was lawfully operating
                her motor vehicle eastbound on Oak Street in Springfield, Illinois.
              </li>
              <li>
                At said time and place, Defendant MICHAEL JOHNSON was operating his motor vehicle
                westbound on Oak Street, approaching the intersection with Main Street.
              </li>
              <li>
                {viewMode === 'changes' && (
                  <span className="line-through text-gray-400">Defendant JOHNSON was under the influence of alcohol...</span>
                )}
                <span className={viewMode === 'changes' ? "bg-blue-100" : ""}>
                  Defendant JOHNSON was distracted by his mobile device and failed to observe the traffic signal
                  at the intersection of Oak Street and Main Street, running a red light.
                </span>
              </li>
              <li>
                As a direct result of Defendant JOHNSON's negligent operation of his vehicle, 
                his vehicle collided with Plaintiff's vehicle in the intersection, causing significant damage
                and injuries to Plaintiff.
              </li>
            </ol>

            <h3 className="font-bold mt-6 mb-3">COUNT I - NEGLIGENCE</h3>
            <p className="mb-2">(Against Defendant MICHAEL JOHNSON)</p>
            <ol className="list-decimal pl-6 space-y-2" start="8">
              <li>Plaintiff realleges and incorporates paragraphs 1 through 7 as if fully set forth herein.</li>
              <li>
                Defendant JOHNSON owed a duty to Plaintiff and other motorists to operate his vehicle in a safe and 
                reasonable manner, including obeying traffic control devices.
              </li>
              <li>
                Defendant JOHNSON breached said duty by operating his vehicle while distracted by his mobile device,
                failing to observe the traffic signal, and running a red light.
              </li>
              <li>
                As a direct and proximate result of Defendant JOHNSON's negligence, Plaintiff sustained serious
                injuries including back injuries requiring ongoing treatment, totaling $47,500 in medical expenses.
              </li>
            </ol>

            <h3 className="font-bold mt-6 mb-3">WHEREFORE</h3>
            <p className="mb-4">
              WHEREFORE, Plaintiff SARAH DAVIS respectfully requests that this Honorable Court enter judgment
              in her favor and against Defendant MICHAEL JOHNSON for damages in excess of $50,000, together with
              costs of suit, and for such other relief as this Court deems just and proper.
            </p>
            
            <div className="mt-8 text-right">
              <p className="mb-2">Respectfully submitted,</p>
              <p className="mb-4">SARAH DAVIS, Plaintiff</p>
              <p>By: _________________________</p>
              <p>[Attorney Name]</p>
              <p>[Attorney Information]</p>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4">
              <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                Find Next Gap
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Accept All Changes
              </button>
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 space-y-4 p-4 bg-gray-50 overflow-auto">
          {/* Fill Gaps */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-gray-900 mb-4">Fill Gaps</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Insurance Company Name</p>
                <p className="text-xs text-gray-600 mt-1">Page 1, Parties section</p>
                <input
                  type="text"
                  placeholder="Enter insurance company name..."
                  className="mt-2 w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-center text-sm text-gray-500">
                2 more items need input
              </div>
            </div>
          </div>

          {/* Key Changes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-gray-900 mb-4">Strategic Adaptations</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium text-gray-900">Simplified defendant structure</p>
                  <p className="text-gray-600">Focused on individual defendant rather than commercial entity</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium text-gray-900">Updated jurisdiction</p>
                  <p className="text-gray-600">Changed venue to Springfield County based on case location</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium text-gray-900">Incorporated medical damages</p>
                  <p className="text-gray-600">Included $47,500 in medical expenses from case files</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium text-gray-900">Adapted fact pattern</p>
                  <p className="text-gray-600">Updated accident location and circumstances to match Davis v. Johnson case</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  // Main render
  if (draftingTask && draftingTask.phase === 'review') {
    return <ReviewInterface />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Davis v. Johnson - MVA Case</h1>
          <div className="flex items-center space-x-3">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Update case
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Case history
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-white border-r border-gray-200">
          <div className="p-4 space-y-1">
            {sidebarItems.map(item => (
              <div
                key={item.id}
                className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
                  item.active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon()}
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 bg-white p-6">
          <div className="h-full flex flex-col space-y-6">
            {/* Placeholder content blocks */}
            <div className="bg-gray-100 rounded-lg p-6 h-32">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 h-40">
              <div className="h-4 bg-gray-300 rounded w-64 mb-4"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-200 rounded h-20"></div>
                <div className="bg-gray-200 rounded h-20"></div>
                <div className="bg-gray-200 rounded h-20"></div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 flex-1">
              <div className="h-4 bg-gray-300 rounded w-56 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="w-[35%] border-l border-gray-200 bg-white flex flex-col">
          {/* Chat tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              {chatTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChatTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-r border-gray-200 last:border-r-0 transition-colors ${
                    activeChatTab === tab.id
                      ? 'bg-white text-blue-700 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.title}
                  {tab.type === 'drafting' && draftingTask && (
                    <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(draftingTask.status)}`}>
                      {draftingTask.status === 'Generating' && draftingTask.phase === 'drafting' ? 'generating' : 
                       draftingTask.status === 'Needs input' ? 'input needed' : 
                       draftingTask.status === 'Draft complete' ? 'complete' : draftingTask.status}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chat content */}
          {activeChatTab === 'main' ? (
            <>
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <Message key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Input area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={
                      currentPhase === 'initial' 
                        ? "Ask me to help draft a complaint..."
                        : "Type a message..."
                    }
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Drafting chat content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-4">
                  {draftingTask && draftingTask.messages.map(message => (
                    <Message key={message.id} message={message} isInDraftingTab={true} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Input area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupioComplaintDrafting;