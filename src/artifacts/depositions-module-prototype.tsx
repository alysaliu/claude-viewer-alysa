import React, { useState, useEffect } from 'react';
import { 
  Home, BarChart2, List, PenTool, Layers, Users, Plus, Search, 
  ChevronRight,
  Upload, Clock, X, Check, AlertTriangle,
  MessageSquare, Calendar, User, Scale,
  Lightbulb, PlayCircle, Eye, Edit3, FileText
} from 'lucide-react';

// Import extracted components
import LiveRecordingView from './depositions-module/components/views/LiveRecordingView';
import TranscriptAnalysisView from './depositions-module/components/views/TranscriptAnalysisView';

// Import extracted hooks
import useRecording from './depositions-module/hooks/useRecording';
import useAnnotations from './depositions-module/hooks/useAnnotations';
import useDeponents from './depositions-module/hooks/useDeponents';
import useKeyIssues from './depositions-module/hooks/useKeyIssues';
import useAiChat from './depositions-module/hooks/useAiChat';

// Import sample data
import { sampleContradictions } from './depositions-module/data/sample-annotations';

const DepositionsModule = () => {
  // Main view state
  const [activeView, setActiveView] = useState('overview');
  const [showTranscriptView, setShowTranscriptView] = useState(false);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('key-issues');
  const [showAddIssueModal, setShowAddIssueModal] = useState(false);
  const [showAddDeponentModal, setShowAddDeponentModal] = useState(false);
  const [quickNoteValue, setQuickNoteValue] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [continuousNotes, setContinuousNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // Getting Started state - moved to main component to persist across re-renders
  const [foundDepositionStatus, setFoundDepositionStatus] = useState('pending'); // 'pending', 'confirmed', 'skipped'
  const [addMoreStatus, setAddMoreStatus] = useState('pending'); // 'pending', 'skipped'
  const [keyIssuesStatus, setKeyIssuesStatus] = useState('pending'); // 'pending', 'skipped'

  // Handle Jane Doe processing simulation
  const handleJaneDoeProcessing = (deponentId: string | number) => {
    // After 6 seconds, mark Jane Doe as completed with official transcript
    setTimeout(() => {
      deponentsHook.markDeponentWithTranscript(deponentId, 'official');
      
      // Load sample data for when user clicks "View Analysis"
      annotationsHook.setContradictions(sampleContradictions);
      annotationsHook.setKeyIssueImpacts([]);
    }, 6000);
  };

  // Handle Upload More Files - triggers Robert Martinez processing
  const handleUploadMoreFiles = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      // Find Robert Martinez in suggested deponents and accept him if he exists
      const robertMartinez = suggestedDeponents.find(d => d.name === "Robert Martinez");
      if (robertMartinez) {
        // Accept Robert Martinez suggestion and immediately start processing
        const confirmedRobert = { 
          ...robertMartinez, 
          id: Date.now(), 
          suggested: false,
          hasTranscript: false,
          status: 'processing',
          relationToCase: robertMartinez.description || robertMartinez.relationToCase || '',
          relevance: undefined,
          description: undefined,
          company: robertMartinez.company || '',
          date: robertMartinez.date || '',
          processingStartTime: Date.now()
        };
        
        // Add to deponents and remove from suggestions
        deponentsHook.setDeponents(prev => [...prev, confirmedRobert]);
        deponentsHook.setSuggestedDeponents(prev => prev.filter(d => d.id !== robertMartinez.id));
        
        // Switch to Opposing tab since Robert is opposing type
        deponentsHook.setActiveDeponentTab('opposing');
        
        // After 6 seconds, mark as completed with official transcript
        setTimeout(() => {
          deponentsHook.markDeponentWithTranscript(confirmedRobert.id, 'official');
          
          // Load sample data for when user clicks "View Analysis"
          annotationsHook.setContradictions(sampleContradictions);
          annotationsHook.setKeyIssueImpacts([]);
        }, 6000);
      } else {
        // If Robert is already a confirmed deponent, process him directly
        const existingRobert = deponents.find(d => d.name === "Robert Martinez");
        if (existingRobert) {
          handleOfficialUpload(event, existingRobert);
        }
      }
    }
  };

  // Initialize hooks
  const keyIssuesHook = useKeyIssues({ activeView });
  const deponentsHook = useDeponents({ 
    activeView, 
    onEditDeponent: () => setShowAddDeponentModal(true),
    onJaneDoeProcessing: handleJaneDoeProcessing
  });
  const annotationsHook = useAnnotations({ showTranscriptView });
  const aiChatHook = useAiChat();

  // Recording hook needs dependencies from other hooks
  const recordingHook = useRecording({
    selectedDeponent: deponentsHook.selectedDeponent,
    setContradictions: annotationsHook.setContradictions,
    setKeyIssueImpacts: annotationsHook.setKeyIssueImpacts,
    setContinuousNotes,
    setShowTranscriptView,
    setDeponents: deponentsHook.setDeponents,
    setSelectedDeponent: deponentsHook.setSelectedDeponent
  });

  // Extract values from hooks for easier use
  const {
    keyIssues,
    suggestedKeyIssues,
    handleAddKeyIssue,
    handleAcceptSuggestedIssue,
    handleDismissSuggestedIssue,
    handleEditKeyIssue
  } = keyIssuesHook;

  const {
    deponents,
    selectedDeponent,
    suggestedDeponents,
    editingDeponent,
    activeDeponentTab,
    setSelectedDeponent,
    setEditingDeponent,
    setActiveDeponentTab,
    handleAcceptSuggestedDeponent,
    handleDismissSuggestedDeponent,
    handleEditDeponent  } = deponentsHook;

  // Getting Started handlers - defined after hooks to access deponents/suggestedDeponents
  const handleScrollToKeyIssues = () => {
    const keyIssuesSection = document.querySelector('[data-section="key-issues"]');
    if (keyIssuesSection) {
      keyIssuesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleConfirmJaneDoe = () => {
    // Find Jane Doe in suggested deponents and accept her
    const janeDoe = suggestedDeponents.find(d => d.name === "Jane Doe");
    if (janeDoe) {
      handleAcceptSuggestedDeponent(janeDoe);
    }
    setFoundDepositionStatus('confirmed');
  };

  const handleSkipDeposition = () => {
    setFoundDepositionStatus('skipped');
  };

  // Check if Jane Doe suggestion was accepted externally to sync CTA #1 state
  useEffect(() => {
    const janeDoeAccepted = deponents.some(d => d.name === "Jane Doe");
    if (janeDoeAccepted && foundDepositionStatus === 'pending') {
      setFoundDepositionStatus('confirmed');
    }
  }, [deponents, foundDepositionStatus]);

  const {
    contradictions,
    keyIssueImpacts
  } = annotationsHook;

  const {
    isRecording,
    isPaused,
    recordingTime,
    transcriptText,
    handleStartRecording,
    handlePauseRecording,
    handleStopRecording,
    setIsPaused,
    formatTime
  } = recordingHook;

  const {
    aiMessages,
    aiInputValue,
    showAiChat,
    setAiInputValue,
    toggleAiChat
  } = aiChatHook;

  // Quick Notes handler for live annotation creation
  const handleQuickNoteSubmit = (content: string) => {
    if (!content.trim()) return;
    // Note: Quick notes are now handled by the notepad functionality
  };

  // Auto-save effect for quick notes
  useEffect(() => {
    if (quickNoteValue.trim() && quickNoteValue.length > 0) {
      const timeoutId = setTimeout(() => {
        handleQuickNoteSubmit(quickNoteValue);
        setQuickNoteValue('');
        setLastSaved(new Date());
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      return () => clearTimeout(timeoutId);
    }
  }, [quickNoteValue]);

  // Note: Initialization effects are now handled by individual hooks

  // Note: Recording, deponent, and key issue functions are now handled by custom hooks


  const handleOfficialUpload = (event, deponent) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      // Mark deponent as processing with start time
      deponentsHook.handleUpdateDeponent(deponent.id, { 
        status: 'processing', 
        hasTranscript: false,
        processingStartTime: Date.now()
      });
      
      // After 6 seconds, mark as completed with official transcript
      setTimeout(() => {
        deponentsHook.markDeponentWithTranscript(deponent.id, 'official');
        
        // Load sample data for when user clicks "View Analysis"
        annotationsHook.setContradictions(sampleContradictions);
        annotationsHook.setKeyIssueImpacts([]);
      }, 6000);
    }
  };

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'overview', icon: <Home size={18} />, label: 'Overview', active: false },
    { id: 'timeline', icon: <BarChart2 size={18} />, label: 'Timeline', active: false },
    { id: 'deep-dive', icon: <List size={18} />, label: 'Deep Dive', active: false },
    { id: 'drafting', icon: <PenTool size={18} />, label: 'Drafting', active: false },
    { id: 'depositions', icon: <Users size={18} />, label: 'Depositions', active: true },
    { id: 'files', icon: <Layers size={18} />, label: 'Files', active: false }
  ];

  // DepositionKickoffView extracted to separate component

  // Component: Key Issues Quick Setup

  // Component: Deponents Setup

  const DeponentCard = ({ deponent, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [processingTime, setProcessingTime] = useState(0);
    const [editForm, setEditForm] = useState({
      name: deponent.name,
      role: deponent.role,
      type: deponent.type
    });

    // Processing timer effect
    useEffect(() => {
      let intervalId;
      if (deponent.status === 'processing' && deponent.processingStartTime) {
        intervalId = setInterval(() => {
          const elapsed = Math.floor((Date.now() - deponent.processingStartTime) / 1000);
          setProcessingTime(elapsed);
        }, 1000);
      }
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [deponent.status, deponent.processingStartTime]);

    const handleSave = () => {
      onEdit(deponent.id, editForm);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditForm({
        name: deponent.name,
        role: deponent.role,
        type: deponent.type
      });
      setIsEditing(false);
    };

    const getStatusBadge = () => {
      if (deponent.status === 'processing') {
        return {
          badge: (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-1"></div>
              Processing ({processingTime}s)
            </span>
          ),
          showDateWarning: false
        };
      } else if (deponent.hasTranscript) {
        return {
          badge: (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Check size={12} className="mr-1" />
              {deponent.status === 'completed' ? 'Completed' : 'Has Transcript'}
            </span>
          ),
          showDateWarning: false
        };
      } else if (!deponent.date) {
        // No date set - show warning instead of badge
        return {
          badge: null,
          showDateWarning: true
        };
      } else {
        // Date is set, determine if scheduled/past/today
        const depoDateTime = deponent.time ? 
          new Date(`${deponent.date}T${deponent.time}`) : 
          new Date(`${deponent.date}T00:00:00`);
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const depoDate = new Date(`${deponent.date}T00:00:00`);
        depoDate.setHours(0, 0, 0, 0);
        
        let status, bgColor, textColor, icon;
        
        if (depoDate.getTime() === today.getTime()) {
          status = 'Today';
          bgColor = 'bg-blue-100';
          textColor = 'text-blue-800';
          icon = <Calendar size={12} className="mr-1" />;
        } else if (depoDateTime < now) {
          status = 'Past';
          bgColor = 'bg-orange-100';
          textColor = 'text-orange-800';
          icon = <Clock size={12} className="mr-1" />;
        } else {
          status = 'Scheduled';
          bgColor = 'bg-purple-100';
          textColor = 'text-purple-800';
          icon = <Calendar size={12} className="mr-1" />;
        }
        
        return {
          badge: (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
              {icon}
              {status}
            </span>
          ),
          showDateWarning: false
        };
      }
    };

    const getTypeColor = () => {
      switch (deponent.type) {
        case 'opposing': return 'border-l-red-500';
        case 'friendly': return 'border-l-green-500';
        default: return 'border-l-gray-500';
      }
    };

    const getIconColor = () => {
      switch (deponent.type) {
        case 'opposing': return 'bg-red-100 text-red-600';
        case 'friendly': return 'bg-green-100 text-green-600';
        default: return 'bg-gray-100 text-gray-600';
      }
    };

    return (
      <div className={`p-3 border-l-4 border-b border-gray-100 hover:bg-gray-50 transition-all ${getTypeColor()}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center flex-1">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${getIconColor()}`}>
              <User size={20} />
            </div>
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Role/Position"
                />
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="opposing">Opposing Them</option>
                  <option value="friendly">Supporting You</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-1">
                  <h5 className="font-medium text-gray-900">{deponent.name}</h5>
                </div>
                <p className="text-sm text-gray-600">{deponent.role}</p>
                {deponent.relationToCase && (
                  <p className="text-xs text-gray-600 mt-1">{deponent.relationToCase}</p>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end space-y-2">
            {!isEditing && (
              <>
                {(() => {
                  const statusInfo = getStatusBadge();
                  return (
                    <>
                      <div className="flex items-center space-x-2">
                        {deponent.transcriptType && (
                          <span className="text-xs text-gray-500 italic">
                            {deponent.transcriptType === 'official' ? 'Official Transcript' : 'Live Recording'}
                          </span>
                        )}
                        {statusInfo.badge && statusInfo.badge}
                        {statusInfo.showDateWarning && (
                          <button 
                            onClick={() => onEdit && onEdit()}
                            className="text-xs text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded border border-orange-200 flex items-center transition-colors"
                            title="Click to schedule deposition"
                          >
                            <AlertTriangle size={12} className="mr-1" />
                            No Date Set
                          </button>
                        )}
                      </div>
                      {deponent.date && (
                        <div className="text-xs text-gray-500 flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(deponent.date + 'T00:00:00').toLocaleDateString()}
                          {deponent.time && (
                            <span className="ml-2">{deponent.time}</span>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
                <div className="flex space-x-1">
                  <button 
                    onClick={() => onEdit && onEdit()}
                    className="text-gray-400 hover:text-blue-600"
                    title="Edit deponent"
                  >
                    <Edit3 size={14} />
                  </button>
                  {onDelete && (
                    <button 
                      onClick={onDelete}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete deponent"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {deponent.status === 'processing' ? (
              <span className="text-xs text-gray-500 px-3 py-1.5 italic">
                Processing transcript...
              </span>
            ) : deponent.hasTranscript ? (
              <>
                <button
                  onClick={() => {
                    setSelectedDeponent(deponent);
                    setShowTranscriptView(true);
                  }}
                  className="flex items-center space-x-1 text-xs px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  <Eye size={12} />
                  <span>View Analysis</span>
                </button>
                {/* Only show Upload Official button if transcript is not already official */}
                {deponent.transcriptType !== 'official' && (
                  <button 
                    onClick={() => {
                      document.getElementById(`uploadOfficial-${deponent.id}`)?.click();
                    }}
                    className="flex items-center space-x-1 text-xs px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    <Upload size={12} />
                    <span>Upload Official</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelectedDeponent(deponent)}
                  className="flex items-center space-x-1 text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <PlayCircle size={12} />
                  <span>Start Live</span>
                </button>
                <button
                  onClick={() => {
                    document.getElementById(`uploadOfficial-${deponent.id}`)?.click();
                  }}
                  className="flex items-center space-x-1 text-xs px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  <Upload size={12} />
                  <span>Upload Existing</span>
                </button>
              </>
            )}
          </div>
        </div>
        
        
        {/* Hidden file input for official transcript uploads */}
        <input 
          id={`uploadOfficial-${deponent.id}`}
          type="file" 
          accept=".pdf,.txt,.docx" 
          onChange={(e) => {
            if (e.target.files[0]) {
              handleOfficialUpload(e, deponent);
            }
          }}
          className="hidden"
        />
      </div>
    );
  };

  // LiveRecordingView extracted to separate component

  // TranscriptAnalysisView extracted to separate component
  // Modals
  const AddKeyIssueModal = () => {
    const [issueText, setIssueText] = useState('');
    const [selectedElements, setSelectedElements] = useState([]);

    const elements = ['Duty', 'Breach', 'Causation', 'Damages'];

    const toggleElement = (element) => {
      setSelectedElements(prev => 
        prev.includes(element) 
          ? prev.filter(e => e !== element)
          : [...prev, element]
      );
    };

    const handleAddIssue = () => {
      if (issueText && selectedElements.length > 0) {
        // Add a single issue with multiple elements
        handleAddKeyIssue({ text: issueText, elements: selectedElements });
        
        // Reset form
        setIssueText('');
        setSelectedElements([]);
        setShowAddIssueModal(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Add Key Issue</h3>
            <button onClick={() => setShowAddIssueModal(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Description</label>
            <textarea
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              rows="3"
              placeholder="Describe the key legal issue..."
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Legal Elements <span className="text-xs text-gray-500">(select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {elements.map((element) => (
                <label key={element} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedElements.includes(element)}
                    onChange={() => toggleElement(element)}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium text-gray-700">{element}</span>
                </label>
              ))}
            </div>
            {selectedElements.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                Will create 1 issue with {selectedElements.length} element{selectedElements.length !== 1 ? 's' : ''}: {selectedElements.join(', ')}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setIssueText('');
                setSelectedElements([]);
                setShowAddIssueModal(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddIssue}
              disabled={!issueText || selectedElements.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Issue{selectedElements.length > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddDeponentModal = () => {
    const isEditing = editingDeponent !== null;
    const [deponentForm, setDeponentForm] = useState({
      name: '',
      role: '',
      type: 'opposing',
      date: '',
      time: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      relationToCase: '',
      aiSuggestions: null
    });
    const [isLoadingInfo, setIsLoadingInfo] = useState(false);
    const [isFromSuggestion, setIsFromSuggestion] = useState(false);
    
    // Pre-populate form when editing
    React.useEffect(() => {
      if (editingDeponent) {
        setDeponentForm({
          name: editingDeponent.name || '',
          role: editingDeponent.role || '',
          type: editingDeponent.type || 'opposing',
          date: editingDeponent.date || '',
          time: editingDeponent.time || '',
          timezone: editingDeponent.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          relationToCase: editingDeponent.relationToCase || '',
          aiSuggestions: null
        });
      } else {
        // Reset form for new deponent
        setDeponentForm({
          name: '',
          role: '',
          type: 'opposing',
          date: '',
          time: '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          relationToCase: '',
              aiSuggestions: null
        });
      }
    }, [editingDeponent]);

    const handleNameChange = (name) => {
      setDeponentForm(prev => ({ ...prev, name }));
    };

    const handleSuggestionClick = (suggestedDeponent) => {
      // Use the unified suggestion system
      handleAcceptSuggestedDeponent(suggestedDeponent);
      // Close the modal
      setShowAddDeponentModal(false);
    };

    const handleFindMoreInfo = async () => {
      setIsLoadingInfo(true);
      setIsFromSuggestion(false);
      
      // Simulate AI searching case files
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock finding additional information
      const additionalInfo = {
        role: deponentForm.role || 'Key Witness',
        relationToCase: deponentForm.relationToCase || 'Found in case documents as relevant party to incident',
        type: deponentForm.type
      };

      setDeponentForm(prev => ({ 
        ...prev, 
        aiSuggestions: additionalInfo,
        role: additionalInfo.role,
        relationToCase: additionalInfo.relationToCase,
      }));
      
      setIsLoadingInfo(false);
    };

    const handleSubmitDeponent = () => {
      if (!deponentForm.name) return;
      
      const deponentData = {
        ...deponentForm,
        datetime: deponentForm.date && deponentForm.time ? 
          `${deponentForm.date} ${deponentForm.time}` : deponentForm.date
      };
      
      if (isEditing) {
        // Update existing deponent
        deponentsHook.setDeponents(prev => prev.map(d => 
          d.id === editingDeponent.id 
            ? { ...d, ...deponentData } 
            : d
        ));
      } else {
        // Add new deponent
        const newDeponent = {
          id: Date.now(),
          hasTranscript: false,
          status: 'pending',
          ...deponentData
        };
        deponentsHook.setDeponents(prev => [...prev, newDeponent]);
      }
      
      // Reset form and close modal
      setDeponentForm({
        name: '',
        role: '',
        type: 'opposing',
        date: '',
        time: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        relationToCase: '',
          aiSuggestions: null
      });
      
      setEditingDeponent(null);
      setShowAddDeponentModal(false);
      setShowDateTimePicker(false);
    };

    const handleQuickDatePicker = () => {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().slice(0, 5);
      setDeponentForm(prev => ({ ...prev, date, time }));
      setShowDateTimePicker(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{isEditing ? 'Edit Deponent' : 'Add Deponent'}</h3>
            <button onClick={() => {
              setShowAddDeponentModal(false);
              setEditingDeponent(null);
            }} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Name Field with Auto-suggestions */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={deponentForm.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter full name..."
                disabled={isLoadingInfo}
              />
              
              
              {/* Static clickable text suggestions - only show when adding new deponent */}
              {!isEditing && suggestedDeponents.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Suggested: </span>
                  {suggestedDeponents.map((deponent, index) => (
                    <span key={deponent.id}>
                      <button
                        onClick={() => handleSuggestionClick(deponent)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        {deponent.name} ({deponent.role})
                      </button>
                      {index < suggestedDeponents.length - 1 && (
                        <span className="text-sm text-gray-600">, </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Auto-fill Button - appears only when name is entered */}
              {deponentForm.name && (
                <button
                  onClick={handleFindMoreInfo}
                  disabled={isLoadingInfo}
                  className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  {isLoadingInfo ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Searching case files...
                    </>
                  ) : (
                    <>
                      <Search size={14} className="mr-2" />
                      Auto-fill from case files
                    </>
                  )}
                </button>
              )}
              
              
              {/* AI found information */}
              {deponentForm.aiSuggestions && !isLoadingInfo && !isFromSuggestion && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Lightbulb size={16} className="text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">Supio found this person in case files</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    Suggested role: <strong>{deponentForm.aiSuggestions.role}</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Role/Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role/Position</label>
                <input
                  type="text"
                  value={deponentForm.role}
                  onChange={(e) => setDeponentForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Opposing Driver, Eyewitness"
                />
              </div>

            </div>

            {/* Date and Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deposition Date & Time</label>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="date"
                    value={deponentForm.date}
                    onChange={(e) => setDeponentForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={deponentForm.time}
                    onChange={(e) => setDeponentForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <select
                    value={deponentForm.timezone}
                    onChange={(e) => setDeponentForm(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="America/New_York">Eastern (EST/EDT)</option>
                    <option value="America/Chicago">Central (CST/CDT)</option>
                    <option value="America/Denver">Mountain (MST/MDT)</option>
                    <option value="America/Los_Angeles">Pacific (PST/PDT)</option>
                    <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                      {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </option>
                  </select>
                </div>
              </div>
              
              {/* Advisory for missing date/time - only show when editing */}
              {isEditing && (!deponentForm.date || !deponentForm.time) && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center text-sm">
                    <AlertTriangle size={14} className="text-yellow-600 mr-2" />
                    <span className="text-yellow-800">Don't forget to schedule this deposition. </span>
                    <button
                      onClick={handleQuickDatePicker}
                      className="text-blue-600 underline hover:text-blue-800 ml-1"
                    >
                      Set to current date/time
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Relation to Case */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relation to Case</label>
              <textarea
                value={deponentForm.relationToCase}
                onChange={(e) => setDeponentForm(prev => ({ ...prev, relationToCase: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows="2"
                placeholder="Describe how this person is involved in the case..."
              />
            </div>


            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deponent Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="type" 
                    value="friendly" 
                    checked={deponentForm.type === 'friendly'}
                    onChange={(e) => setDeponentForm(prev => ({ ...prev, type: e.target.value }))}
                    className="mr-2" 
                  />
                  <span className="text-green-700">Supporting</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="type" 
                    value="opposing" 
                    checked={deponentForm.type === 'opposing'}
                    onChange={(e) => setDeponentForm(prev => ({ ...prev, type: e.target.value }))}
                    className="mr-2" 
                  />
                  <span className="text-red-700">Opposing</span>
                </label>
              </div>
            </div>


          </div>
          
          <div className="flex justify-end mt-6">
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAddDeponentModal(false);
                  setDeponentForm({
                    name: '', role: '', type: 'opposing', company: '', date: '',
                    relationToCase: '', aiSuggestions: null
                  });
                  setIsLoadingInfo(false);
                  setNameSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                disabled={isLoadingInfo}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDeponent}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isLoadingInfo || !deponentForm.name}
              >
                {isLoadingInfo ? 'Processing...' : (isEditing ? 'Update Deponent' : 'Add Deponent')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  // Component: Editable Issue Card
  const EditableIssueCard = ({ issue, completedDepositions, netImpact, totalTestimony, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(issue.text);
    const [editElements, setEditElements] = useState(issue.elements || [issue.element].filter(Boolean));

    const handleSave = () => {
      onEdit(issue.id, { text: editText, elements: editElements });
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditText(issue.text);
      setEditElements(issue.elements || [issue.element].filter(Boolean));
      setIsEditing(false);
    };

    const toggleElement = (element) => {
      setEditElements(prev => 
        prev.includes(element)
          ? prev.filter(e => e !== element)
          : [...prev, element]
      );
    };

    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
        {isEditing ? (
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-1 flex-wrap">
                {(issue.elements || [issue.element].filter(Boolean)).map(element => (
                  <span key={element} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">{element}</span>
                ))}
              </div>
              <div className="flex space-x-1">
                <button onClick={handleCancel} className="text-xs text-gray-600 hover:text-gray-800">Cancel</button>
                <button onClick={handleSave} className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700">Save</button>
              </div>
            </div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-2"
              rows="2"
            />
            <div className="flex flex-wrap gap-1">
              {['Duty', 'Breach', 'Causation', 'Damages'].map(element => (
                <button
                  key={element}
                  onClick={() => toggleElement(element)}
                  className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                    editElements.includes(element)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {element}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-1 flex-wrap">
                {(issue.elements || [issue.element].filter(Boolean)).map(element => (
                  <span key={element} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">{element}</span>
                ))}
              </div>
              <div className="flex space-x-1">
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600" title="Edit">
                  <Edit3 size={12} />
                </button>
                <button onClick={onDelete} className="text-gray-400 hover:text-red-600" title="Delete">
                  <X size={12} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-900 mb-2 leading-tight">{issue.text}</p>
            
            {completedDepositions > 0 && totalTestimony > 0 && (
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Impact</span>
                  <div className={`text-sm font-bold ${
                    netImpact > 0 ? 'text-green-600' : netImpact < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {netImpact > 0 ? '+' : ''}{netImpact}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Component: Key Issues Card - Main overview display
  const KeyIssuesCard = () => (
    <div className="pb-8">
      <div className="mb-3">
        <h3 className="text-lg font-medium text-gray-900">Key Issues</h3>
        <button
          onClick={() => setShowAddIssueModal(true)}
          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mt-3"
        >
          <Plus size={16} className="mr-2" />
          Add Issue
        </button>
      </div>
      <div>
        {/* Show Confirmed Issues First, Then Suggestions */}
        <div className="max-w-6xl">
        {keyIssues.length === 0 && suggestedKeyIssues.length === 0 ? (
          <div className="text-center py-8">
            <Scale className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Key Issues Defined</h4>
            <p className="text-gray-600 mb-4">Supio will analyze your case files to suggest key legal issues</p>
          </div>
        ) : (
          <>
            {/* Confirmed Key Issues - Show First */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {keyIssues.map((issue, idx) => {
              // Real impact data matching offline mode analysis
              const completedDepositions = deponents.filter(d => d.hasTranscript).length;
              const aggregateImpacts = [
                // Issue 1: Traffic laws adherence - helps_1 (speeding) + helps_5 (yellow light)
                { helpful: 2, harmful: 0, neutral: 0, sources: ['R. Martinez Dep.'] },
                // Issue 2: Weather conditions - helps_3 (visibility) + harms_1 (weather defense)
                { helpful: 1, harmful: 1, neutral: 0, sources: ['R. Martinez Dep.'] },
                // Issue 3: Cell phone distraction - helps_2 (phone call) + helps_4 (policy awareness)
                { helpful: 2, harmful: 0, neutral: 0, sources: ['R. Martinez Dep.'] },
                // Issue 4: Medical treatment/damages - no impacts in sample data
                { helpful: 0, harmful: 0, neutral: 0, sources: [] }
              ][idx] || { helpful: 0, harmful: 0, neutral: 0, sources: [] };
              
              const netImpact = aggregateImpacts.helpful - aggregateImpacts.harmful;
              const totalTestimony = aggregateImpacts.helpful + aggregateImpacts.harmful + aggregateImpacts.neutral;
              
              return (
                <EditableIssueCard 
                  key={issue.id} 
                  issue={issue} 
                  completedDepositions={completedDepositions}
                  aggregateImpacts={aggregateImpacts}
                  netImpact={netImpact}
                  totalTestimony={totalTestimony}
                  onEdit={handleEditKeyIssue}
                  onDelete={() => setKeyIssues(keyIssues.filter(i => i.id !== issue.id))}
                />
              );
            })}
            </div>

            {/* Suggested Key Issues - Show After Confirmed */}
            {suggestedKeyIssues.length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestedKeyIssues.map((issue) => (
                    <div key={issue.id} className="p-3 bg-blue-50 border-l-4 border-l-blue-400 border border-blue-100 rounded-lg hover:border-blue-200 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-1 flex-wrap mb-2">
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">{issue.element}</span>
                            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">Suggested</span>
                          </div>
                          <p className="text-sm text-gray-900 mb-2 leading-tight">{issue.text}</p>
                        </div>
                        <div className="flex space-x-1 ml-3">
                          <button
                            onClick={() => handleAcceptSuggestedIssue(issue)}
                            className="text-gray-400 hover:text-green-600"
                            title="Accept suggestion"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => handleDismissSuggestedIssue(issue.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Dismiss suggestion"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );

  // Component: Getting Started - Fast entry point
  const GettingStarted = () => {

    return (
      <div className="pb-4 mb-4">
        {/* Unified Getting Started Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-6 max-w-5xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Getting Started</h2>
            <p className="text-gray-600">Let's set up your deposition analysis quickly</p>
          </div>

          <div className="space-y-1">
            {/* Step 1: Found Deposition */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                    foundDepositionStatus === 'confirmed'
                      ? 'bg-green-600'
                      : foundDepositionStatus === 'skipped'
                      ? 'bg-gray-600'
                      : 'bg-blue-600'
                  }`}>
                    {foundDepositionStatus === 'confirmed' ? <Check size={16} /> : '1'}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-10 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">PDF</span>
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${
                      foundDepositionStatus === 'skipped' ? 'text-gray-600' : 'text-gray-900'
                    }`}>
                      {foundDepositionStatus === 'confirmed' 
                        ? 'Successfully added Jane Doe deposition:' 
                        : foundDepositionStatus === 'skipped'
                        ? 'Skipped deposition file:'
                        : 'We found 1 deposition in your case files:'
                      }
                    </h3>
                    <p className={`text-sm mt-1 ${
                      foundDepositionStatus === 'skipped' ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      <span className="font-medium">Jane_Doe_Deposition_2024-03-15.pdf</span>
                      <span className="text-gray-500 ml-2">• 52 pages</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {foundDepositionStatus === 'pending' ? (
                  <>
                    <button 
                      onClick={handleConfirmJaneDoe}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={handleSkipDeposition}
                      className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Skip
                    </button>
                  </>
                ) : foundDepositionStatus === 'confirmed' ? (
                  <span className="px-3 py-1.5 text-sm bg-green-100 text-green-800 rounded flex items-center">
                    <Check size={14} className="mr-1" />
                    Success!
                  </span>
                ) : (
                  <span className="text-sm text-gray-500 flex items-center">
                    <X size={14} className="mr-1" />
                    Skipped
                  </span>
                )}
              </div>
            </div>

            {/* Step 2: Add More or Upload */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                    addMoreStatus === 'skipped' ? 'bg-gray-600' : 'bg-blue-600'
                  }`}>
                    2
                  </div>
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${
                    addMoreStatus === 'skipped' ? 'text-gray-600' : 'text-gray-900'
                  }`}>
                    {addMoreStatus === 'skipped' 
                      ? 'Skipped adding more deponents' 
                      : 'Add more deponents or upload additional depositions'
                    }
                  </h3>
                  <p className={`text-sm mt-1 ${
                    addMoreStatus === 'skipped' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {addMoreStatus === 'skipped'
                      ? 'You can add more deponents later from the main interface'
                      : 'You can upload both recordings and transcripts'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {addMoreStatus === 'pending' ? (
                  <>
                    <button 
                      onClick={() => setShowAddDeponentModal(true)}
                      className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Deponent
                    </button>
                    <button 
                      onClick={() => {
                        document.getElementById('uploadMoreFiles')?.click();
                      }}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Upload More Files
                    </button>
                    <button 
                      onClick={() => setAddMoreStatus('skipped')}
                      className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Skip
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-gray-500 flex items-center">
                    <X size={14} className="mr-1" />
                    Skipped
                  </span>
                )}
              </div>
            </div>

            {/* Step 3: Key Issues (Optional) */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                    keyIssuesStatus === 'skipped' ? 'bg-gray-600' : 'bg-blue-600'
                  }`}>
                    3
                  </div>
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${
                    keyIssuesStatus === 'skipped' ? 'text-gray-600' : 'text-gray-900'
                  }`}>
                    {keyIssuesStatus === 'skipped' 
                      ? 'Skipped defining key issues' 
                      : (
                        <>
                          Define key legal issues
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium ml-2">Optional</span>
                        </>
                      )
                    }
                  </h3>
                  <p className={`text-sm mt-1 ${
                    keyIssuesStatus === 'skipped' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {keyIssuesStatus === 'skipped'
                      ? 'Issues can be added or modified later'
                      : 'Browse suggested issues or add your own'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {keyIssuesStatus === 'pending' ? (
                  <>
                    <button 
                      onClick={handleScrollToKeyIssues}
                      className="px-3 py-1.5 text-sm border border-blue-300 text-blue-700 rounded hover:bg-gray-50"
                    >
                      Add Key Issues ↓
                    </button>
                    <button 
                      onClick={() => setKeyIssuesStatus('skipped')}
                      className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Skip
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-gray-500 flex items-center">
                    <X size={14} className="mr-1" />
                    Skipped
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Hidden file input for Upload More Files */}
        <input 
          id="uploadMoreFiles"
          type="file" 
          accept=".pdf,.txt,.docx" 
          onChange={handleUploadMoreFiles}
          className="hidden"
        />
      </div>
    );
  };

  // Component: Deponents List - Main overview display
  const DeponentsList = () => {
    const friendlyDeponents = [...deponents, ...suggestedDeponents].filter(d => d.type === 'friendly');
    const opposingDeponents = [...deponents, ...suggestedDeponents].filter(d => d.type === 'opposing');
    
    // For tab counts, only count accepted deponents (not suggestions)
    const acceptedFriendlyCount = deponents.filter(d => d.type === 'friendly').length;
    const acceptedOpposingCount = deponents.filter(d => d.type === 'opposing').length;
    
    return (
      <div className="pb-8 mb-8">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">Deponents</h3>
          <button
            onClick={() => setShowAddDeponentModal(true)}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mt-3"
          >
            <Plus size={16} className="mr-2" />
            Add Deponent
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-4">
          <div className="max-w-6xl border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveDeponentTab('opposing')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeDeponentTab === 'opposing'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Opposing ({acceptedOpposingCount})
              </button>
              <button
                onClick={() => setActiveDeponentTab('friendly')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeDeponentTab === 'friendly'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Friendly ({acceptedFriendlyCount})
              </button>
            </nav>
          </div>
        </div>

        
        {/* Tab Content */}
        <div className="max-w-6xl space-y-2 border-b border-gray-200 pb-4">
          {((activeDeponentTab === 'opposing' && opposingDeponents.length === 0) || 
            (activeDeponentTab === 'friendly' && friendlyDeponents.length === 0)) ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No {activeDeponentTab} deponents added
              </h4>
              <p className="text-gray-600 mb-4">
                Add {activeDeponentTab} deponents for this case
              </p>
              <button
                onClick={() => setShowAddDeponentModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Add {activeDeponentTab === 'opposing' ? 'Opposing Them' : 'Supporting You'} Deponent
              </button>
            </div>
          ) : (
            <>
              {/* Confirmed Deponents for Active Tab */}
              {deponents
                .filter(d => d.type === activeDeponentTab)
                .map((deponent) => (
                  <DeponentCard 
                    key={deponent.id} 
                    deponent={deponent} 
                    onEdit={() => handleEditDeponent(deponent)}
                    onDelete={() => setDeponents(deponents.filter(d => d.id !== deponent.id))}
                  />
                ))}

              {/* Suggested Deponents for Active Tab */}
              {suggestedDeponents
                .filter(d => d.type === activeDeponentTab)
                .length > 0 && (
                <div className="mt-6">
                  <div className="space-y-2">
                    {suggestedDeponents
                      .filter(d => d.type === activeDeponentTab)
                      .map((deponent) => (
                        <div key={deponent.id} className="p-2 bg-blue-50 border-l-4 border-l-blue-400 border-b border-b-blue-100">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">Suggested</span>
                                {deponent.name === "Jane Doe" && (
                                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded font-medium flex items-center">
                                    <FileText size={12} className="mr-1" />
                                    From Jane_Doe_Deposition_2024-03-15.pdf
                                  </span>
                                )}
                              </div>
                              <h5 className="font-medium text-gray-900 mb-1">{deponent.name}</h5>
                              <p className="text-sm text-gray-700 mb-1">{deponent.role}</p>
                              <p className="text-xs text-gray-600 mb-1">{deponent.description}</p>
                              <p className="text-xs text-blue-800 bg-blue-100 rounded px-2 py-1 inline-block">
                                <strong>Relevance:</strong> {deponent.relevance}
                              </p>
                            </div>
                            <div className="flex space-x-1 ml-3">
                              <button 
                                onClick={() => handleAcceptSuggestedDeponent(deponent)}
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Accept suggestion"
                              >
                                <Check size={14} />
                              </button>
                              <button 
                                onClick={() => handleDismissSuggestedDeponent(deponent.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Dismiss suggestion"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Top Nav */}
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-900">Jane Doe MVA</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Update case
            </button>
            <button 
              onClick={toggleAiChat}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                showAiChat 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-300'
              }`}
            >
              <MessageSquare size={14} className="inline mr-1" />
              AI Assistant
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-48 bg-white border-r border-gray-200 flex flex-col z-0 overflow-y-auto">
          <div className="mt-4 flex-1">
            {sidebarItems.map(item => (
              <div 
                key={item.id} 
                className={`flex items-center px-4 py-2 ${
                  item.active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                } cursor-pointer`}
              >
                <div className="mr-3">{item.icon}</div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {!selectedDeponent ? (
            <div className="flex h-full">
              {/* Main Content Area */}
              <div className={`transition-all duration-300 ${showAiChat ? 'flex-1 max-w-[calc(100%-24rem)]' : 'w-full'}`}>
                <div className="w-full px-2 pt-12 pb-6 max-w-7xl mx-auto">
                  {/* Getting Started Section */}
                  <GettingStarted />
                  
                  {/* Deponents Section */}
                  <DeponentsList />
                  
                  {/* Key Issues Section */}
                  <div data-section="key-issues">
                    <KeyIssuesCard />
                  </div>
                </div>
              </div>
              
              {/* AI Assistant Chat Pane - Homepage */}
              {showAiChat && (
                <div className="w-96 border-l border-gray-200 bg-white flex flex-col transition-all duration-300">
                  {/* Chat Header */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                      <MessageSquare size={18} className="text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-900">AI Assistant</h4>
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="space-y-4">
                      {aiMessages.map(message => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {message.content}
                          </div>
                        </div>
                      ))}
                      
                    </div>
                  </div>
                  
                  {/* Chat Input */}
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={aiInputValue}
                        onChange={(e) => setAiInputValue(e.target.value)}
                        placeholder="Ask about case strategy, deposition planning..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && aiInputValue.trim()) {
                            const userMessage = {
                              id: Date.now(),
                              type: 'user',
                              content: aiInputValue,
                              timestamp: new Date()
                            };
                            
                            const aiResponse = {
                              id: Date.now() + 1,
                              type: 'assistant',
                              content: "For case planning, I suggest focusing on establishing a clear timeline of events. The defendant driver's testimony will be crucial for identifying inconsistencies. Consider scheduling expert witnesses after you have the key depositions completed.",
                              timestamp: new Date()
                            };
                            
                            setAiMessages(prev => [...prev, userMessage, aiResponse]);
                            setAiInputValue('');
                          }
                        }}
                      />
                      <button 
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        disabled={!aiInputValue.trim()}
                        onClick={() => {
                          if (aiInputValue.trim()) {
                            const userMessage = {
                              id: Date.now(),
                              type: 'user',
                              content: aiInputValue,
                              timestamp: new Date()
                            };
                            
                            const aiResponse = {
                              id: Date.now() + 1,
                              type: 'assistant',
                              content: "For case planning, I suggest focusing on establishing a clear timeline of events. The defendant driver's testimony will be crucial for identifying inconsistencies. Consider scheduling expert witnesses after you have the key depositions completed.",
                              timestamp: new Date()
                            };
                            
                            setAiMessages(prev => [...prev, userMessage, aiResponse]);
                            setAiInputValue('');
                          }
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                      Connected • Press Enter to send
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full">
              {/* Content Area */}
              <div className={`transition-all duration-300 ${showAiChat ? 'flex-1 max-w-[calc(100%-24rem)]' : 'w-full'} ${showTranscriptView ? 'p-0' : ''}`}>
                {showTranscriptView ? (
                  <TranscriptAnalysisView 
                    selectedDeponent={selectedDeponent}
                    setSelectedDeponent={setSelectedDeponent}
                    setShowTranscriptView={setShowTranscriptView}
                    activeAnalysisTab={activeAnalysisTab}
                    setActiveAnalysisTab={setActiveAnalysisTab}
                    contradictions={contradictions}
                    keyIssueImpacts={keyIssueImpacts}
                    keyIssues={keyIssues}
                    continuousNotes={continuousNotes}
                    setContinuousNotes={setContinuousNotes}
                  />
                ) : (
                  <LiveRecordingView 
                    selectedDeponent={selectedDeponent}
                    setSelectedDeponent={setSelectedDeponent}
                    isRecording={isRecording}
                    isPaused={isPaused}
                    recordingTime={recordingTime}
                    transcriptText={transcriptText}
                    contradictions={contradictions}
                    continuousNotes={continuousNotes}
                    setContinuousNotes={setContinuousNotes}
                    formatTime={formatTime}
                    handleStartRecording={handleStartRecording}
                    handlePauseRecording={handlePauseRecording}
                    handleStopRecording={handleStopRecording}
                    setIsPaused={setIsPaused}
                  />
                )}
              </div>
              
              {/* AI Assistant Chat Pane - Top Level */}
              {showAiChat && (
                <div className="w-96 border-l border-gray-200 bg-white flex flex-col">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center">
                    <MessageSquare size={18} className="text-blue-600 mr-2" />
                    <h4 className="font-medium text-gray-900">AI Assistant</h4>
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <div className="space-y-4">
                    {aiMessages.map(message => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                    
                  </div>
                </div>
                
                {/* Chat Input */}
                <div className="px-4 py-3 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={aiInputValue}
                      onChange={(e) => setAiInputValue(e.target.value)}
                      placeholder="Ask for analysis or strategy advice..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && aiInputValue.trim()) {
                          // Add user message
                          const userMessage = {
                            id: Date.now(),
                            type: 'user',
                            content: aiInputValue,
                            timestamp: new Date()
                          };
                          
                          // Add AI response
                          const aiResponse = {
                            id: Date.now() + 1,
                            type: 'assistant',
                            content: "Based on the current testimony, I recommend focusing on the timeline discrepancies. The witness's statements about weather and timing are inconsistent, which could be crucial for establishing credibility.",
                            timestamp: new Date()
                          };
                          
                          setAiMessages(prev => [...prev, userMessage, aiResponse]);
                          setAiInputValue('');
                        }
                      }}
                    />
                    <button 
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      disabled={!aiInputValue.trim()}
                      onClick={() => {
                        if (aiInputValue.trim()) {
                          // Add user message
                          const userMessage = {
                            id: Date.now(),
                            type: 'user',
                            content: aiInputValue,
                            timestamp: new Date()
                          };
                          
                          // Add AI response
                          const aiResponse = {
                            id: Date.now() + 1,
                            type: 'assistant',
                            content: "Based on the current testimony, I recommend focusing on the timeline discrepancies. The witness's statements about weather and timing are inconsistent, which could be crucial for establishing credibility.",
                            timestamp: new Date()
                          };
                          
                          setAiMessages(prev => [...prev, userMessage, aiResponse]);
                          setAiInputValue('');
                        }
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                    Connected • Press Enter to send
                  </div>
                </div>
              </div>
              )}
            </div>
          )}
        </main>
      </div>
      
      {/* Modals */}
      {showAddIssueModal && <AddKeyIssueModal />}
      {showAddDeponentModal && <AddDeponentModal />}
    </div>
  );
};

export default DepositionsModule;