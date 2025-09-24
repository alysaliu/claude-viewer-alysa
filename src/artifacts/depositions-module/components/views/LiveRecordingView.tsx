import React from 'react';
import { 
  Mic, Play, Pause, StopCircle, Search, ArrowLeft
} from 'lucide-react';
import type { Deponent, ContradictionItem } from '../../types/deposition-types';

interface LiveRecordingViewProps {
  selectedDeponent: Deponent | null;
  setSelectedDeponent: (deponent: Deponent | null) => void;
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  transcriptText: string;
  contradictions: ContradictionItem[];
  continuousNotes: string;
  setContinuousNotes: (notes: string) => void;
  formatTime: (seconds: number) => string;
  handleStartRecording: () => void;
  handlePauseRecording: () => void;
  handleStopRecording: () => void;
  setIsPaused: (paused: boolean) => void;
}

export const LiveRecordingView: React.FC<LiveRecordingViewProps> = ({
  selectedDeponent,
  setSelectedDeponent,
  isRecording,
  isPaused,
  recordingTime,
  transcriptText,
  contradictions,
  continuousNotes,
  setContinuousNotes,
  formatTime,
  handleStartRecording,
  handlePauseRecording,
  handleStopRecording,
  setIsPaused
}) => (
  <div className="bg-white rounded-lg shadow h-full flex flex-col">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setSelectedDeponent(null)}
          className="text-gray-400 hover:text-gray-600"
          title="Back to main view"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-lg font-medium text-gray-900">
          Live Deposition - {selectedDeponent?.name}
        </h3>
        <div className="flex items-center space-x-2">
          {isRecording && !isPaused && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-red-600 font-medium">RECORDING</span>
            </div>
          )}
          {isPaused && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-yellow-600 font-medium">RECORDING PAUSED</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {selectedDeponent?.role}
      </div>
    </div>
    
    <div className="flex flex-1 min-h-0">
      {/* Left Panel - Transcript */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Live Transcript</h4>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
              {formatTime(recordingTime)}
            </span>
            <div className="flex space-x-2">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Mic size={16} className="mr-2" />
                  Start Recording
                </button>
              ) : isPaused ? (
                <>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Play size={16} className="mr-2" />
                    Resume
                  </button>
                  <button
                    onClick={handleStopRecording}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <StopCircle size={16} className="mr-2" />
                    End
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handlePauseRecording}
                    className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <Pause size={16} className="mr-2" />
                    Break
                  </button>
                  <button
                    onClick={handleStopRecording}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <StopCircle size={16} className="mr-2" />
                    End
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 flex-1 overflow-y-auto border border-gray-200">
          <div className="font-mono text-sm space-y-2">
            {transcriptText ? (
              transcriptText.split('\n').map((line, idx) => {
                const timestampMatch = line.match(/^\[(\d{2}:\d{2}:\d{2})\]\s*(.+)$/);
                if (timestampMatch) {
                  const [, timestamp, content] = timestampMatch;
                  const isAttorney = content.includes('Attorney Johnson');
                  const isMartinez = content.includes('Roberto Martinez');
                  
                  return (
                    <div key={idx} className="flex">
                      <span className="text-gray-400 text-xs mr-3 mt-0.5 font-mono">{timestamp}</span>
                      <span className={`${
                        isAttorney ? 'text-blue-700' : 
                        isMartinez ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {content}
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="text-gray-600">
                    {line}
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 italic text-center py-8">
                Click "Start Recording" to begin live transcription...
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Search and Controls */}
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transcript..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Contradictions Dashboard - Expanded */}
      <div className="flex-1 border-l border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              Contradictions ({contradictions.length})
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-2"></div>
            </h4>
            <div className="text-xs text-gray-500">Real-time Analysis</div>
          </div>
        </div>
        
        {/* Contradictions Section - Takes remaining space */}
        <div className="flex-1 px-6 pb-4 overflow-hidden flex flex-col">
          {/* Auto-Detected Contradictions */}
          {contradictions.length > 0 && (
            <div className="flex-1 flex flex-col">
              <div className="space-y-2 overflow-y-auto flex-1">
                {contradictions.map((contradiction) => (
                  <div key={contradiction.id} className="p-2 bg-red-50 border-l-3 border-l-red-500 rounded text-xs">
                    <div className="flex items-center mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-white text-xs font-medium mr-2 ${
                        contradiction.contradictionType === 'internal' ? 'bg-red-600' : 'bg-orange-600'
                      }`}>
                        {contradiction.contradictionType?.toUpperCase() || 'INTERNAL'}
                      </span>
                      {contradiction.citation && (
                        <span className="text-red-600 font-mono text-xs">
                          📍{contradiction.citation.timeRange ? (
                            <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                              {contradiction.citation.timeRange}
                            </span>
                          ) : `${contradiction.citation.page}:${contradiction.citation.line}`}
                        </span>
                      )}
                    </div>
                    <div className="text-red-800 mb-1 text-xs leading-relaxed">{contradiction.content}</div>
                    {contradiction.contradictoryTestimony && (
                      <div className="text-red-700 text-xs italic">
                        vs: {contradiction.contradictoryTestimony.includes('.pdf') ? (
                          <>
                            <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                              {contradiction.contradictoryTestimony.split(' -')[0]}
                            </span>
                            {contradiction.contradictoryTestimony.split(' -')[1] && ` - ${contradiction.contradictoryTestimony.split(' -')[1]}`}
                          </>
                        ) : contradiction.contradictoryTestimony.includes(' / Page ') ? (
                          <>
                            <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                              {contradiction.contradictoryTestimony.split(' / Page ')[0]}
                            </span>
                            {contradiction.contradictoryTestimony.split(' / Page ')[1] && `: ${contradiction.contradictoryTestimony.split(': ')[1]}`}
                          </>
                        ) : contradiction.contradictoryTestimony.match(/^\d{2}:\d{2}:/) ? (
                          <>
                            <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                              {contradiction.contradictoryTestimony.split(':').slice(0, 2).join(':')}
                            </span>
                            {contradiction.contradictoryTestimony.substring(5)}
                          </>
                        ) : contradiction.contradictoryTestimony}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        
          {/* Auto-Detected Contradictions - Empty State */}
          {contradictions.length === 0 && (
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded border">
                <div className="text-xs">No contradictions detected yet</div>
                <div className="text-xs mt-1">AI will automatically flag inconsistent testimony</div>
              </div>
            </div>
          )}
        </div>

        {/* Notepad - 40% of container height */}
        <div className="border-t border-gray-200 p-6 pt-4 bg-white h-[40%] flex flex-col">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Notepad</h5>
          <textarea
            className="flex-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs resize-none"
            placeholder="Quick notes during deposition... Jot down observations, follow-up questions, key admissions, or anything else that catches your attention."
            value={continuousNotes}
            onChange={(e) => setContinuousNotes(e.target.value)}
          />
          <div className="mt-1 text-right flex-shrink-0">
            <div className="text-xs text-gray-500">
              {continuousNotes.trim() ? 'Auto-saving...' : 'Ready'}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LiveRecordingView;