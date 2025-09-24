import React, { useState, useEffect } from 'react';
import { Send, FileText, Plus, X, MoreHorizontal, MessageCircle, MessageSquare, Edit3, Zap, Upload, Paperclip, Search, FileBarChart, Edit } from 'lucide-react';
import Message from '../chat/Message';
import NotificationPanel from '../panels/NotificationPanel';
import JobsListPanel from '../panels/JobsListPanel';
import type {
  Message as MessageType,
  DraftingTask,
  Job,
  Notification
} from '../../types/drafting-types';

interface ExploreViewProps {
  // Chat state
  aiChatInput: string;
  setAiChatInput: (value: string) => void;
  chatTabs: Array<{ id: number; name: string; isDocumentTab: boolean; associatedJobId: string | null }>;
  activeChatTab: number;
  setActiveChatTab: (id: number) => void;

  // Drafting state
  messages: MessageType[];
  draftingTask: DraftingTask | null;
  customInputs: Record<number, string>;
  customModeAssumption: number | null;
  draftingStarted: boolean;

  // Jobs and notifications
  jobs: Job[];
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showJobsList: boolean;
  setShowJobsList: (show: boolean) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;

  // Event handlers
  handleAIChatSubmit: () => void;
  handleAddChatTab: () => void;
  handleCloseChatTab: (tabId: number) => void;
  onFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStartDrafting?: () => void;
  onAssumptionResponse?: (assumptionId: number, option: string) => void;
  onCustomInput?: (assumptionId: number, value: string) => void;
  onToggleCustomMode?: (assumptionId: number) => void;
  onCancelCustomInstruction?: () => void;
  onConfirmCustomInstruction?: (assumptionId: number) => void;
  onEditCustomInstruction?: (assumptionId: number) => void;
  onReviewDraft?: () => void;
  onTaskCardClick?: () => void;
  onDocumentTypeSelection?: (documentType: string) => void;
  onNotificationAction?: (action: string, notificationId: number) => void;
  onJobClick?: (job: Job) => void;
  onOpenLibraryModal?: () => void;

  // File upload props
  tabFiles?: Record<number, Array<{id: string; name: string; size: number; type: string; file: File}>>;
  getActiveTabFiles?: () => Array<{id: string; name: string; size: number; type: string; file: File}>;
  handleChatFileUpload?: (files: FileList) => void;
  handleChatFileDrop?: (e: React.DragEvent) => void;
  handleChatFileInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFileFromTab?: (tabId: number, fileId: string) => void;

  // Source selection props
  selectedSources?: Set<string>;
  setShowSourcePicker?: (show: boolean) => void;
  getSelectedSourcesCount?: () => number;
  hasSelectedSources?: () => boolean;

  // Deep research mode props
  deepResearchMode?: boolean;
  setDeepResearchMode?: (enabled: boolean) => void;

  // Output format props
  outputFormat?: 'answer' | 'analysis' | 'document';
  setOutputFormat?: (format: 'answer' | 'analysis' | 'document') => void;

  // Tab message info helpers
  getTabLastMessageSnippet?: (tabId: number) => string;
  getTabLastMessageTimestamp?: (tabId: number) => Date | null;
  formatRelativeTime?: (timestamp: Date) => string;
}

// Dummy conversation data
const dummyConversations = [
  {
    id: 'current',
    title: 'New Chat',
    lastMessage: '',
    timestamp: 'Now',
    isActive: true
  },
  {
    id: '1',
    title: 'Initial Case Investigation - Garcia MVA',
    lastMessage: 'What information should I gather for the accident...',
    timestamp: '2 hours ago',
    isActive: false
  },
  {
    id: '2',
    title: 'Client Intake Interview Questions',
    lastMessage: 'Help me prepare questions for Garcia\'s initial interview...',
    timestamp: 'Yesterday',
    isActive: false
  },
  {
    id: '3',
    title: 'Medical Provider Authorization Forms',
    lastMessage: 'Draft HIPAA authorization forms for medical records...',
    timestamp: '2 days ago',
    isActive: false
  },
  {
    id: '4',
    title: 'Statute of Limitations Research - MVA',
    lastMessage: 'What\'s the statute of limitations for personal injury...',
    timestamp: '3 days ago',
    isActive: false
  }
];

const ExploreView: React.FC<ExploreViewProps> = ({
  aiChatInput,
  setAiChatInput,
  chatTabs,
  activeChatTab,
  setActiveChatTab,
  messages,
  draftingTask,
  customInputs,
  customModeAssumption,
  draftingStarted,
  jobs,
  notifications,
  showNotifications,
  setShowNotifications,
  showJobsList,
  setShowJobsList,
  messagesEndRef,
  handleAIChatSubmit,
  handleAddChatTab,
  handleCloseChatTab,
  onFileUpload,
  onStartDrafting,
  onAssumptionResponse,
  onCustomInput,
  onToggleCustomMode,
  onCancelCustomInstruction,
  onConfirmCustomInstruction,
  onEditCustomInstruction,
  onReviewDraft,
  onTaskCardClick,
  onDocumentTypeSelection,
  onNotificationAction,
  onJobClick,
  onOpenLibraryModal,
  // File upload props
  tabFiles,
  getActiveTabFiles,
  handleChatFileUpload,
  handleChatFileDrop,
  handleChatFileInputChange,
  removeFileFromTab,
  // Source selection props
  selectedSources,
  setShowSourcePicker,
  getSelectedSourcesCount,
  hasSelectedSources,
  // Deep research mode props
  deepResearchMode,
  setDeepResearchMode,
  // Output format props
  outputFormat = 'answer',
  setOutputFormat,
  // Tab message info helpers
  getTabLastMessageSnippet,
  getTabLastMessageTimestamp,
  formatRelativeTime
}) => {
  const [showOutputFormatDropdown, setShowOutputFormatDropdown] = useState(false);

  // Get current active tab
  const currentTab = chatTabs.find(tab => tab.id === activeChatTab);
  const isDocumentCanvasChat = currentTab?.isDocumentTab || false;

  // Output format helpers
  const getOutputFormatIcon = () => {
    switch (outputFormat) {
      case 'analysis':
        return <FileBarChart className="h-4 w-4" />;
      case 'document':
        return <Edit className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const handleOutputFormatSelect = (format: 'answer' | 'analysis' | 'document') => {
    if (setOutputFormat) {
      setOutputFormat(format);
    }
    setShowOutputFormatDropdown(false);
  };

  // Close dropdown when clicking outside
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
  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar - Conversation History */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <button
              onClick={handleAddChatTab}
              className="w-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center space-x-2 border border-gray-300"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">New Chat</span>
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {chatTabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveChatTab(tab.id)}
                className={`p-3 rounded-lg cursor-pointer group transition-colors ${
                  tab.id === activeChatTab
                    ? 'bg-blue-50 text-blue-900 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <MessageCircle className={`h-4 w-4 flex-shrink-0 ${
                        tab.id === activeChatTab ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <h3 className="text-sm font-medium truncate">
                        {tab.name}
                      </h3>
                    </div>
                    <p className={`text-xs truncate ${
                      tab.id === activeChatTab ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {getTabLastMessageSnippet ? getTabLastMessageSnippet(tab.id) || 'No messages yet' :
                       tab.isDocumentTab ? 'Document chat' : 'No messages yet'}
                    </p>
                    <p className={`text-xs mt-1 ${
                      tab.id === activeChatTab ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {getTabLastMessageTimestamp && formatRelativeTime ? (
                        (() => {
                          const timestamp = getTabLastMessageTimestamp(tab.id);
                          return timestamp ? formatRelativeTime(timestamp) : 'Never';
                        })()
                      ) : 'Never'}
                    </p>
                  </div>
                  {tab.id !== activeChatTab && chatTabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseChatTab(tab.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-medium text-gray-900">
                {currentTab?.name || 'New Chat'}
              </h3>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {(draftingTask?.messages && draftingTask.messages.length > 0 ? draftingTask.messages : messages).length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-gray-500">
                  <p className="mb-1">Select the case data to work with.</p>
                  <p>Then, ask a question or<br />
                  <button
                    onClick={onOpenLibraryModal}
                    className="inline-flex items-center text-gray-500 hover:text-purple-600 transition-colors cursor-pointer"
                  >
                    <Zap className="h-4 w-4 text-purple-600 mr-1" />
                    <span className="font-semibold">select an existing prompt or workflow.</span>
                  </button></p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {(draftingTask?.messages && draftingTask.messages.length > 0 ? draftingTask.messages : messages).map((message, index) => (
                <Message
                  key={index}
                  message={message}
                  isInDraftingTab={activeChatTab > 1}
                  draftingTask={draftingTask}
                  customInputs={customInputs}
                  customModeAssumption={customModeAssumption}
                  draftingStarted={draftingStarted}
                  onFileUpload={onFileUpload}
                  onStartDrafting={onStartDrafting}
                  onAssumptionResponse={onAssumptionResponse}
                  onCustomInput={onCustomInput}
                  onToggleCustomMode={onToggleCustomMode}
                  onCancelCustomInstruction={onCancelCustomInstruction}
                  onConfirmCustomInstruction={onConfirmCustomInstruction}
                  onEditCustomInstruction={onEditCustomInstruction}
                  onReviewDraft={onReviewDraft}
                  onTaskCardClick={onTaskCardClick}
                  onDocumentTypeSelection={onDocumentTypeSelection}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Uploaded Files Display */}
        {getActiveTabFiles && getActiveTabFiles().length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <Paperclip className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Uploaded Files ({getActiveTabFiles().length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {getActiveTabFiles().map((file) => (
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
                    onClick={() => removeFileFromTab && removeFileFromTab(activeChatTab, file.id)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div
          className="p-6 bg-white border-t border-gray-200"
          onDrop={handleChatFileDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
        >
          <div className="relative">
            <input
              type="file"
              multiple
              onChange={handleChatFileInputChange}
              className="hidden"
              id="explore-file-upload"
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.jpg,.jpeg,.png"
            />
            <div className="border border-gray-300 rounded-xl bg-white shadow-sm">
              <textarea
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                placeholder="Send a message"
                className="w-full p-3 border-0 rounded-xl resize-none focus:outline-none text-sm text-gray-700 placeholder-gray-400"
                rows={2.5}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAIChatSubmit();
                  }
                }}
              />
              <div className="flex items-center justify-between px-4 pb-3">
                {/* Left side - Library and Upload buttons */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={onOpenLibraryModal}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Library
                  </button>
                  <label
                    htmlFor="explore-file-upload"
                    className="flex items-center justify-center h-8 w-8 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Upload files"
                  >
                    <Upload className="h-4 w-4" />
                  </label>
                  <button
                    onClick={() => setDeepResearchMode && setDeepResearchMode(!deepResearchMode)}
                    className={`flex items-center h-8 rounded-md transition-all duration-300 ease-in-out ${
                      deepResearchMode
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 pl-2 pr-3'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2'
                    }`}
                    title="Research Mode"
                  >
                    <Search className="h-4 w-4 flex-shrink-0" />
                    {deepResearchMode && (
                      <span className="ml-2 text-sm font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                        Research Mode
                      </span>
                    )}
                  </button>
                  {/* Output Format Button - Only show if NOT a document canvas chat */}
                  {!isDocumentCanvasChat && (
                    <div className="relative">
                      <button
                        data-output-format-button
                        onClick={() => setShowOutputFormatDropdown(!showOutputFormatDropdown)}
                        className="flex items-center justify-center h-8 w-8 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        title="Output Format"
                      >
                        {getOutputFormatIcon()}
                      </button>
                      {/* Output Format Dropdown */}
                      {showOutputFormatDropdown && (
                        <div data-output-format-dropdown className="absolute bottom-0 left-full ml-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                          <button
                            onClick={() => handleOutputFormatSelect('answer')}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                              outputFormat === 'answer' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>Answer</span>
                          </button>
                          <button
                            onClick={() => handleOutputFormatSelect('analysis')}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                              outputFormat === 'analysis' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <FileBarChart className="h-4 w-4" />
                            <span>Analysis</span>
                          </button>
                          <button
                            onClick={() => handleOutputFormatSelect('document')}
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

                {/* Right side - Source counter and Send button */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowSourcePicker && setShowSourcePicker(true)}
                    className={`text-xs transition-colors cursor-pointer ${
                      hasSelectedSources && hasSelectedSources()
                        ? 'text-gray-500 hover:text-gray-700'
                        : 'text-amber-600 hover:text-amber-700 font-medium'
                    }`}
                  >
                    {hasSelectedSources && hasSelectedSources()
                      ? `${getSelectedSourcesCount && getSelectedSourcesCount()} source${getSelectedSourcesCount && getSelectedSourcesCount() === 1 ? '' : 's'}`
                      : 'Select at least 1 source'
                    }
                  </button>
                  <button
                    onClick={handleAIChatSubmit}
                    disabled={!aiChatInput.trim() || !(hasSelectedSources && hasSelectedSources())}
                    className={`p-2 rounded-md transition-colors ${
                      aiChatInput.trim() && hasSelectedSources && hasSelectedSources()
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
        </div>
      </div>
    </div>
  );
};

export default ExploreView;