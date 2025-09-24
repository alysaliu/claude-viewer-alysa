import React, { useRef } from 'react';
import {
  Sparkles, File, Upload, Loader, CheckCircle, ChevronRight,
  PenTool, X, FileText, Plus, Minus
} from 'lucide-react';
import type {
  Message as MessageType,
  DraftingTask,
  Assumption
} from '../../types/drafting-types';
import { getStatusBadgeColor, sampleAssumptions } from '../../data/sample-data';
import { renderMarkdown } from '../../utils/markdown';

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
  onDocumentTypeSelection?: (documentType: string) => void;
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
  onTaskCardClick,
  onDocumentTypeSelection
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

              <div className="mt-3 ml-1">
                <div className="flex items-center">
                  <ChevronRight size={14} className="text-blue-500" />
                  <span className="ml-1 text-sm text-blue-700 font-medium">Click to continue in drafting tab</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular message */}
        {!message.isFile && !message.isTaskCard && (
          <div className={`rounded-lg px-4 py-3 max-w-2xl ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-900'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{renderMarkdown(message.content)}</p>

            {/* File upload section */}
            {message.showUpload && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <Upload size={20} className="text-blue-500 mr-2" />
                  <span className="text-blue-700 font-medium">Upload Reference Complaint</span>
                </button>
                <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX</p>
              </div>
            )}

            {/* Analyzing status */}
            {message.isAnalyzing && (
              <div className="mt-4 flex items-center space-x-2 text-blue-600">
                <Loader size={16} className="animate-spin" />
                <span className="text-sm">Analyzing document...</span>
              </div>
            )}

            {/* Analysis complete */}
            {message.isAnalyzingComplete && (
              <div className="mt-4 flex items-center space-x-2 text-green-600">
                <CheckCircle size={16} />
                <span className="text-sm">Analysis complete</span>
              </div>
            )}

            {/* Assumptions section */}
            {message.showAssumptions && draftingTask && (
              <div className="mt-4 border-t border-gray-200 pt-4 space-y-4">
                {draftingTask.assumptions.map((assumption) => (
                  <div key={assumption.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        {assumption.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{renderMarkdown(assumption.assumption)}</p>
                    <p className="text-sm font-medium text-gray-900 mb-3">{assumption.question}</p>

                    {customModeAssumption === assumption.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={customInputs[assumption.id] || ''}
                          onChange={(e) => onCustomInput?.(assumption.id, e.target.value)}
                          placeholder="Enter your custom instruction..."
                          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onConfirmCustomInstruction?.(assumption.id)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={onCancelCustomInstruction}
                            className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {assumption.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => onAssumptionResponse?.(assumption.id, option)}
                            className={`w-full text-left p-2 rounded border transition-colors text-sm ${
                              assumption.selected === option
                                ? 'border-blue-500 bg-blue-50 text-blue-900'
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                        <button
                          onClick={() => onToggleCustomMode?.(assumption.id)}
                          className="w-full text-left p-2 rounded border border-dashed border-gray-400 hover:border-gray-500 hover:bg-gray-50 transition-colors text-sm text-gray-600"
                        >
                          + Custom instruction
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Begin drafting button */}
            {message.showBeginDrafting && !message.isDraftingStarted && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <button
                  onClick={onStartDrafting}
                  disabled={draftingStarted}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                    draftingStarted
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {draftingStarted ? 'Starting...' : 'Begin Drafting'}
                </button>
              </div>
            )}

            {/* Drafting status */}
            {message.isDrafting && (
              <div className="mt-4 flex items-center space-x-2 text-blue-600">
                <Loader size={16} className="animate-spin" />
                <span className="text-sm">Drafting in progress...</span>
                {draftingTask && draftingTask.elapsedTime > 0 && (
                  <span className="text-sm text-gray-500">({draftingTask.elapsedTime}s)</span>
                )}
              </div>
            )}

            {/* Drafting complete status */}
            {message.isDraftingComplete && (
              <div className="mt-4 flex items-center space-x-2 text-green-600">
                <CheckCircle size={16} />
                <span className="text-sm">Draft generation complete</span>
              </div>
            )}

            {/* Draft complete actions */}
            {message.isDraftComplete && message.actions && (
              <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
                {message.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (action.label === "Review Draft") {
                        onReviewDraft?.();
                      }
                    }}
                    className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      action.primary
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {action.icon()}
                    <span className="ml-2">{action.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Document Type Selection */}
            {message.isDocumentTypeSelection && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <button
                  onClick={() => onDocumentTypeSelection?.('complaint')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <FileText size={16} className="mr-2" />
                  Complaint
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;