import React, { useState } from 'react';
import { 
  ArrowLeft, Upload, AlertTriangle, Target, Plus, Edit3, X, Scale
} from 'lucide-react';
import type { Deponent, ContradictionItem, KeyIssueImpact, KeyIssue } from '../../types/deposition-types';
import { pageLineSummary, fullTranscriptContent } from '../../data/unified-transcript';

interface TranscriptAnalysisViewProps {
  selectedDeponent: Deponent | null;
  setSelectedDeponent: (deponent: Deponent | null) => void;
  setShowTranscriptView: (show: boolean) => void;
  activeAnalysisTab: string;
  setActiveAnalysisTab: (tab: string) => void;
  contradictions: ContradictionItem[];
  keyIssueImpacts: KeyIssueImpact[];
  keyIssues: KeyIssue[];
  continuousNotes: string;
  setContinuousNotes: (notes: string) => void;
  setShowAnnotationCreator?: (show: boolean) => void;
  handleEditAnnotation?: (id: string, data: any) => void;
  handleDeleteAnnotation?: (id: string) => void;
}

export const TranscriptAnalysisView: React.FC<TranscriptAnalysisViewProps> = ({
  selectedDeponent,
  setSelectedDeponent,
  setShowTranscriptView,
  activeAnalysisTab,
  setActiveAnalysisTab,
  contradictions,
  keyIssueImpacts,
  keyIssues,
  continuousNotes,
  setContinuousNotes,
  setShowAnnotationCreator,
  handleEditAnnotation,
  handleDeleteAnnotation
}) => {
  const [selectedPageLine, setSelectedPageLine] = useState<any>(null);
  
  // Fallback handlers for missing functions
  const handleEditAnnotationFallback = (id: string, data: any) => {
    console.log('Edit annotation:', id, data);
  };
  
  const handleDeleteAnnotationFallback = (id: string) => {
    console.log('Delete annotation:', id);
  };
  
  const setShowAnnotationCreatorFallback = (show: boolean) => {
    console.log('Show annotation creator:', show);
  };

  return (
    <div className="bg-white h-[calc(100vh-120px)] flex flex-col">
      <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setSelectedDeponent(null);
              setShowTranscriptView(false);
            }}
            className="text-gray-400 hover:text-gray-600"
            title="Back to main view"
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="text-lg font-medium text-gray-900">
            Transcript Analysis - {selectedDeponent?.name}
          </h3>
        </div>
      </div>
      
      <div className="flex h-full">
        {/* Left Side - Transcript with Page-Line Navigation */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 h-full">
          {/* Page-Line Summary Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <h4 className="px-4 py-2 text-sm font-medium text-gray-900">Page-Line Summary (Click to Navigate)</h4>
            <div className="max-h-32 overflow-y-auto">
              {pageLineSummary.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedPageLine(item)}
                  className={`px-4 py-1.5 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedPageLine?.page === item.page ? 'bg-blue-100 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-600">{item.page}:{item.lines}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded">{item.topic}</span>
                      </div>
                      <p className="text-xs text-gray-800 mt-1 break-words">{item.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Full Transcript */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 h-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Full Transcript</h4>
              <button className="flex items-center px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50">
                <Upload size={12} className="mr-1" />
                Upload Official Recording/Transcript
              </button>
            </div>
            <div className="bg-white rounded border p-3 h-full">
              <div 
                className="font-mono text-sm whitespace-pre-line select-text cursor-text"
              >
                {fullTranscriptContent.split('\n').map((line, idx) => {
                  const isPageHeader = line.includes('Page ') && line.trim().length < 30;
                  const isQuestion = line.trim().startsWith('Q.');
                  const isAnswer = line.trim().startsWith('A.');
                  const isExhibit = line.includes('Exhibit') && line.includes('Cell Phone Records');
                  const isPageNumber = /^\s*\d+\s*$/.test(line);
                  const isCaseName = line.includes('Case:') || line.includes('Date:');
                  const isTitle = line.includes('DEPOSITION OF');
                  
                  return (
                    <div 
                      key={idx} 
                      className={`${
                        isTitle ? 'font-bold text-center text-lg text-gray-900 mb-4' :
                        isCaseName ? 'text-center text-gray-700' :
                        isPageHeader ? 'font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded text-center mt-4' :
                        isQuestion ? 'text-blue-700' : 
                        isAnswer ? 'text-green-700' :
                        isExhibit ? 'font-medium text-red-700 bg-red-50 px-2 py-1 rounded text-center italic' :
                        isPageNumber ? 'text-gray-400' :
                        'text-gray-700'
                      } leading-relaxed`}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Analysis */}
        <div className="w-1/2 flex flex-col h-full">
          {/* Analysis Tabs */}
          <div className="border-b border-gray-200 px-4 pt-3">
            <nav className="-mb-px flex space-x-8">
              <button 
                onClick={() => setActiveAnalysisTab('contradictions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeAnalysisTab === 'contradictions' 
                    ? 'border-red-500 text-red-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <AlertTriangle size={16} className="inline mr-1" />
                Contradictions ({contradictions.length})
              </button>
              <button 
                onClick={() => setActiveAnalysisTab('key-issues')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeAnalysisTab === 'key-issues' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Target size={16} className="inline mr-1" />
                Key Issues ({keyIssues.length})
              </button>
            </nav>
          </div>
          
          {/* Analysis Content */}
          <div className="flex-1 p-4 overflow-y-auto h-0">
            
            {activeAnalysisTab === 'contradictions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Contradictions</h3>
                  <button
                    onClick={() => (setShowAnnotationCreator || setShowAnnotationCreatorFallback)(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center text-sm"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Contradiction
                  </button>
                </div>
                
                {contradictions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle size={48} className="mx-auto mb-3 opacity-50" />
                    <div className="font-medium">No contradictions detected</div>
                    <div className="text-sm">AI will automatically detect contradictions during testimony</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contradictions.map(contradiction => (
                      <div key={contradiction.id} className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg hover:bg-red-100 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-white text-xs font-medium ${
                              contradiction.contradictionType === 'internal' ? 'bg-red-600' : 'bg-orange-600'
                            }`}>
                              {contradiction.contradictionType?.toUpperCase() || 'INTERNAL'}
                            </span>
                            {contradiction.citation && (
                              <span className="text-red-600 font-mono text-xs">
                                📍{contradiction.citation.page && contradiction.citation.line ? (
                                  <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                                    {contradiction.citation.page}:{contradiction.citation.line}
                                  </span>
                                ) : contradiction.citation.timeRange ? (
                                  <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                                    {contradiction.citation.timeRange}
                                  </span>
                                ) : `${contradiction.citation.page}:${contradiction.citation.line}`}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => (handleEditAnnotation || handleEditAnnotationFallback)(contradiction.id, {})}
                              className="text-gray-400 hover:text-blue-600" 
                              title="Edit"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button 
                              onClick={() => (handleDeleteAnnotation || handleDeleteAnnotationFallback)(contradiction.id)}
                              className="text-gray-400 hover:text-red-600" 
                              title="Delete"
                            >
                              <X size={12} />
                            </button>
                          </div>
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
                                  {contradiction.contradictoryTestimony.split(' / Page ')[1].split(': ')[0]}
                                </span>
                                {contradiction.contradictoryTestimony.split(': ')[1] && `: ${contradiction.contradictoryTestimony.split(': ')[1]}`}
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
                        {contradiction.followUp && (
                          <div className="mt-2 p-2 bg-white rounded border text-xs">
                            <div className="text-gray-600 font-medium">Suggested Follow-Up:</div>
                            <div className="text-gray-700">{contradiction.followUp}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeAnalysisTab === 'key-issues' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Key Issues</h3>
                  <div className="flex items-center text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    Auto-analyzing transcript
                  </div>
                </div>
                
                {keyIssues.map((issue) => {
                  // Get key issue impacts that reference this issue
                  const issueAnnotations = keyIssueImpacts.filter(impact => 
                    impact.issueId === issue.id.toString()
                  );
                  
                  // Calculate disposition
                  const supportsCount = issueAnnotations.filter(a => a.type === 'helps').length;
                  const harmsCount = issueAnnotations.filter(a => a.type === 'harms').length;
                  const netScore = supportsCount - harmsCount;
                  
                  const getDisposition = (score: number) => {
                    if (score > 0) return { text: 'Favors You', color: 'text-green-600 bg-green-50' };
                    if (score === 0) return { text: 'Undetermined', color: 'text-gray-600 bg-gray-100' };
                    return { text: 'Favors Them', color: 'text-orange-600 bg-orange-50' };
                  };
                  
                  const disposition = getDisposition(netScore);
                  
                  return (
                    <div key={issue.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      {/* Issue Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm mb-1">{issue.text}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {issue.elements ? issue.elements.join(', ') : issue.element}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${disposition.color}`}>
                              {disposition.text}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Analysis Summary */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-gray-700">AI Analysis Summary</h5>
                          <div className="text-xs text-gray-500">
                            {supportsCount} supporting • {harmsCount} harmful
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          {netScore > 0 ? 
                            `Testimony analysis reveals ${supportsCount} pieces of evidence supporting plaintiff's position vs ${harmsCount} that could benefit defense. Overall testimony trend favors plaintiff.` :
                          netScore < 0 ? 
                            `Analysis identifies ${harmsCount} statements that could benefit defense vs ${supportsCount} supporting plaintiff. Defense may have stronger position on this issue.` :
                            `Balanced testimony with equal supporting and challenging evidence. Further depositions may be needed to strengthen plaintiff's position.`
                          }
                        </div>
                      </div>
                      
                      {/* Supporting Testimony */}
                      {issueAnnotations.filter(a => a.type === 'helps').length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-green-800 mb-2 flex items-center">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                            Supporting Plaintiff ({supportsCount})
                          </h5>
                          <div className="space-y-2">
                            {issueAnnotations.filter(a => a.type === 'helps').map(impact => (
                              <div key={impact.id} className="bg-green-50 border-l-4 border-l-green-500 p-3 rounded-r">
                                <div className="flex items-start justify-between mb-1">
                                  <div className="font-medium text-green-800 text-sm">{impact.title}</div>
                                  {impact.citation && (
                                    <span className="text-xs text-green-700 font-mono bg-green-100 px-2 py-1 rounded">
                                      📍{impact.citation.page && impact.citation.line ? 
                                        `${impact.citation.page}:${impact.citation.line}` : 
                                        impact.citation.timeRange || 'Live'
                                      }
                                    </span>
                                  )}
                                </div>
                                <div className="text-green-700 text-xs leading-relaxed">{impact.content}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Harmful Testimony */}
                      {issueAnnotations.filter(a => a.type === 'harms').length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                            Harmful to Plaintiff ({harmsCount})
                          </h5>
                          <div className="space-y-2">
                            {issueAnnotations.filter(a => a.type === 'harms').map(impact => (
                              <div key={impact.id} className="bg-red-50 border-l-4 border-l-red-500 p-3 rounded-r">
                                <div className="flex items-start justify-between mb-1">
                                  <div className="font-medium text-red-800 text-sm">{impact.title}</div>
                                  {impact.citation && (
                                    <span className="text-xs text-red-700 font-mono bg-red-100 px-2 py-1 rounded">
                                      📍{impact.citation.page && impact.citation.line ? 
                                        `${impact.citation.page}:${impact.citation.line}` : 
                                        impact.citation.timeRange || 'Live'
                                      }
                                    </span>
                                  )}
                                </div>
                                <div className="text-red-700 text-xs leading-relaxed">{impact.content}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {issueAnnotations.length === 0 && (
                        <div className="text-center py-6 bg-gray-50 rounded border-2 border-dashed border-gray-200">
                          <div className="text-sm text-gray-500">No impacts found for this key issue</div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {keyIssues.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Scale size={48} className="mx-auto mb-3 opacity-50" />
                    <div className="font-medium mb-1">No key issues defined</div>
                    <div className="text-sm">Add key issues to see AI analysis of supporting and harmful testimony</div>
                  </div>
                )}
              </div>
            )}
            
          </div>
          
          {/* Standalone Notepad Section */}
          <div className="border-t border-gray-200 p-4 pb-6 h-[40%] flex-shrink-0">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Notepad</h4>
            <div className="flex flex-col h-full">
              <textarea
                className="flex-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none"
                placeholder="Notes during transcript review... Jot down observations, follow-up questions, key admissions, or anything else that catches your attention."
                value={continuousNotes}
                onChange={(e) => setContinuousNotes(e.target.value)}
              />
              <div className="mt-2 text-right">
                <div className="text-xs text-gray-500">
                  {continuousNotes.trim() ? 'Auto-saving...' : 'Ready'}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TranscriptAnalysisView;