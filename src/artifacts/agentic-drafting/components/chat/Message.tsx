import React, { useRef } from 'react';
import { 
  Sparkles, File, Upload, Loader, CheckCircle, ChevronRight, 
  PenTool, X 
} from 'lucide-react';
import type { 
  Message as MessageType, 
  DraftingTask, 
  Assumption 
} from '../../types/drafting-types';
import { getStatusBadgeColor } from '../../data/sample-data';

interface MessageProps {
  message: MessageType;
  isInDraftingTab?: boolean;
  draftingTask?: DraftingTask | null;
  customInputs?: Record<number, string>;
  customModeAssumption?: number | null;
  draftingStarted?: boolean;
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
}

const Message: React.FC<MessageProps> = ({
  message,
  isInDraftingTab = false,
  draftingTask,
  customInputs = {},
  customModeAssumption,
  draftingStarted = false,
  onFileUpload,
  onStartDrafting,
  onAssumptionResponse,
  onCustomInput,
  onToggleCustomMode,
  onCancelCustomInstruction,
  onConfirmCustomInstruction,
  onEditCustomInstruction,
  onReviewDraft,
  onTaskCardClick
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
                <div className="font-medium text-gray-800">{message.file?.name}</div>
                <div className="text-sm text-gray-500">{message.file?.size}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Task creation card */}
        {message.isTaskCard && draftingTask && (
          <div 
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors max-w-2xl"
            onClick={onTaskCardClick}
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
                  onChange={onFileUpload}
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
                  onClick={onStartDrafting}
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
                {draftingTask.assumptions.map((assumption) => {
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
                            onChange={(e) => onCustomInput?.(assumption.id, e.target.value)}
                            placeholder="Enter your custom instruction for this aspect of the complaint..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={onCancelCustomInstruction}
                              className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                              Cancel Instruction
                            </button>
                            <button
                              onClick={() => onConfirmCustomInstruction?.(assumption.id)}
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
                            rows={3}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => onEditCustomInstruction?.(assumption.id)}
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
                              onClick={() => !draftingStarted && onAssumptionResponse?.(assumption.id, option)}
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
                            onClick={() => !draftingStarted && onToggleCustomMode?.(assumption.id)}
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
                <span className="text-sm">Drafting completed in 30 seconds!</span>
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
                        onReviewDraft?.();
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

export default Message;