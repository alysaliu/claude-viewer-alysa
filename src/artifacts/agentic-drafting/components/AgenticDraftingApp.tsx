import React from 'react';
import { Send, X } from 'lucide-react';
import { useDraftingState } from '../hooks/useDraftingState';
import { useAssumptions } from '../hooks/useAssumptions';
import { useDraftingWorkflow } from '../hooks/useDraftingWorkflow';
import Layout from './common/Layout';
import Message from './chat/Message';
import ReviewInterface from './review/ReviewInterface';
import { getStatusBadgeColor } from '../data/sample-data';

const AgenticDraftingApp: React.FC = () => {
  const {
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
    addAssistantMessage,
    addAssistantMessageToTask,
    createDraftingTask,
    handleReviewDraft
  } = useDraftingState();

  // Assumption handling
  const {
    presentAssumptions,
    handleAssumptionResponse,
    handleCustomInput,
    toggleCustomMode,
    cancelCustomInstruction,
    confirmCustomInstruction,
    editCustomInstruction
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

  // Handle user message
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
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
  const handleDraftingTabMessage = (userMessage: any) => {
    if (!draftingTask) return;
    
    const updatedTask = {
      ...draftingTask,
      messages: [...draftingTask.messages, userMessage]
    };
    setDraftingTask(updatedTask);
  };

  // Handle task card click to switch to drafting tab
  const handleTaskCardClick = () => {
    if (draftingTask) {
      reopenDraftingTab();
      // Scroll to bottom after a brief delay to ensure tab is active
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Main render
  if (draftingTask && draftingTask.phase === 'review') {
    return (
      <ReviewInterface 
        viewMode={viewMode}
        setViewMode={setViewMode}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        jobs={jobs}
        showJobsList={showJobsList}
        setShowJobsList={setShowJobsList}
        onNotificationAction={handleNotificationAction}
        onJobClick={handleJobClick}
      />
    );
  }

  return (
    <Layout
      notifications={notifications}
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
      jobs={jobs}
      showJobsList={showJobsList}
      setShowJobsList={setShowJobsList}
      onNotificationAction={handleNotificationAction}
      onJobClick={handleJobClick}
    >
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
              <div key={tab.id} className={`flex-1 flex items-center border-r border-gray-200 last:border-r-0 ${
                activeChatTab === tab.id
                  ? 'bg-white text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <button
                  onClick={() => setActiveChatTab(tab.id)}
                  className="flex-1 px-4 py-3 text-sm font-medium transition-colors text-left"
                >
                  <span className="flex items-center">
                    {tab.title}
                    {tab.type === 'drafting' && draftingTask && (
                      <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(draftingTask.status)}`}>
                        {draftingTask.status === 'Generating' && draftingTask.phase === 'drafting' ? 'generating' : 
                         draftingTask.status === 'Needs input' ? 'input needed' : 
                         draftingTask.status === 'Draft complete' ? 'complete' : draftingTask.status}
                      </span>
                    )}
                  </span>
                </button>
                {tab.type !== 'main' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="p-1 mr-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
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
                  <Message 
                    key={message.id} 
                    message={message} 
                    draftingTask={draftingTask}
                    onTaskCardClick={handleTaskCardClick}
                  />
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
                  <Message 
                    key={message.id} 
                    message={message} 
                    isInDraftingTab={true}
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
                    onReviewDraft={handleReviewDraft}
                  />
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
    </Layout>
  );
};

export default AgenticDraftingApp;