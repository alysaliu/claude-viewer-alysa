import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, FileText, ChevronDown, Check, Zap, Play, PlayCircle, Search, TrendingUp, AlertTriangle, ChevronRight, Clock, X, Upload, Send, PenTool, MessageCircle, FileBarChart, Edit } from 'lucide-react';

interface LibraryItem {
  id: string;
  type: string;
  title: string;
  description: string;
  createdBy: string;
  dateCreated: string;
  tags: string[];
  dataRequired?: string[];
  content: string;
}

interface CaseOverviewViewProps {
  aiPanelOpen?: boolean;
  onOpenAIPanel?: () => void;
  onDraftDocumentRequest?: () => void;
  onNavigateToExplore?: (message: string) => void;
  onOpenLibraryModal?: () => void;
  // File upload props
  handleChatFileInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getActiveTabFiles?: () => Array<{id: string; name: string; size: number; type: string; file: File}>;
  removeFileFromTab?: (tabId: number, fileId: string) => void;
  // Deep research mode props
  deepResearchMode?: boolean;
  setDeepResearchMode?: (enabled: boolean) => void;
  // Source selection props
  selectedSources?: Set<string>;
  setShowSourcePicker?: (show: boolean) => void;
  getSelectedSourcesCount?: () => number;
  hasSelectedSources?: () => boolean;
  // Output format props
  outputFormat?: 'answer' | 'analysis' | 'document';
  setOutputFormat?: (format: 'answer' | 'analysis' | 'document') => void;
}

const CaseOverviewView: React.FC<CaseOverviewViewProps> = ({
  aiPanelOpen = false,
  onOpenAIPanel,
  onDraftDocumentRequest,
  onNavigateToExplore,
  onOpenLibraryModal,
  // File upload props
  handleChatFileInputChange,
  getActiveTabFiles,
  removeFileFromTab,
  // Deep research mode props
  deepResearchMode,
  setDeepResearchMode,
  // Source selection props
  selectedSources,
  setShowSourcePicker,
  getSelectedSourcesCount,
  hasSelectedSources,
  // Output format props
  outputFormat = 'answer',
  setOutputFormat
}) => {
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [showBrowseModal, setShowBrowseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftingInput, setDraftingInput] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [showOutputFormatDropdown, setShowOutputFormatDropdown] = useState(false);

  const handleReferenceClick = () => {
    setShowReferenceModal(true);
  };

  const handleBrowseAllClick = () => {
    if (onOpenLibraryModal) {
      onOpenLibraryModal();
    } else {
      setShowBrowseModal(true);
    }
  };

  const handleModalClose = () => {
    setShowReferenceModal(false);
    setDraftingInput('');
    setAdditionalInstructions('');
  };

  const handleBrowseModalClose = () => {
    setShowBrowseModal(false);
    setSelectedItem(null);
    setTypeFilter('all');
    setSearchQuery('');
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Drafting:', draftingInput);
    console.log('Instructions:', additionalInstructions);
    handleModalClose();
  };

  const handleChatSubmit = () => {
    // Handle chat input submission
    if (chatInput.trim() && onNavigateToExplore) {
      // Navigate to Explore and send the message
      onNavigateToExplore(chatInput.trim());
      setChatInput('');
    }
  };

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

  // Unified library items (workflows and prompts)
  const libraryItems = [
    // Workflows
    {
      id: 'pb-1',
      type: 'workflow',
      title: "Case Value Assessment",
      description: "Analyze medical records, bills, and damages to estimate settlement value range",
      createdBy: "Supio",
      dateCreated: "June 29, 2025",
      tags: ["Analysis", "Valuation", "MVA", "Settlement"],
      dataRequired: ["Medical Records", "Medical Bills", "Lost Wages Documentation"],
      content: "This workflow will analyze your case documents to provide a comprehensive settlement value assessment including: - Medical expense analysis - Lost wage calculations - Pain and suffering valuation - Comparable case analysis - Settlement range recommendations"
    },
    {
      id: 'pb-2',
      type: 'workflow',
      title: "Liability & Negligence Analysis",
      description: "Identify key liability factors, witness statements, and supporting evidence",
      createdBy: "Supio",
      dateCreated: "June 29, 2025",
      tags: ["Liability", "Analysis", "MVA", "Negligence"],
      dataRequired: ["Police Reports", "Witness Statements", "Photos/Videos"],
      content: "This workflow performs comprehensive liability analysis including: - Fault determination - Traffic law violations - Witness credibility assessment - Evidence strength evaluation - Negligence theory development"
    },
    {
      id: 'pb-3',
      type: 'workflow',
      title: "Medical Records Review",
      description: "Comprehensive analysis of medical documentation and treatment history",
      createdBy: "Supio",
      dateCreated: "June 15, 2025",
      tags: ["Medical", "Analysis", "Documentation", "Treatment"],
      dataRequired: ["Medical Records", "Treatment Notes", "Diagnostic Reports"],
      content: "This workflow provides detailed medical record analysis including: - Treatment timeline development - Injury causation analysis - Medical expense validation - Treatment necessity review - Future care projections"
    },
    // Prompts
    {
      id: 'p-1',
      type: 'prompt',
      title: "MVA Interrogatories",
      description: "Drafts comprehensive interrogatories for motor vehicle accident discovery.",
      createdBy: "Supio",
      dateCreated: "June 29, 2025",
      tags: ["Drafting", "Interrogatories", "MVA", "Litigation"],
      content: "Draft comprehensive interrogatories for this motor vehicle accident case targeting:\n- Driver's license history, violations, suspensions\n- Driving experience and training\n- Alcohol/drug use before and during incident\n- Medical conditions affecting driving ability\n- Use of medications affecting driving\n- Vehicle ownership, maintenance records\n- Safety inspections, recalls, modifications\n- Weather and road condition observations\n- Witness identification and contact information"
    },
    {
      id: 'p-2',
      type: 'prompt',
      title: "Motor Vehicle Complaint",
      description: "Drafts personal injury complaint for motor vehicle accident cases.",
      createdBy: "Supio",
      dateCreated: "June 29, 2025",
      tags: ["Drafting", "Complaint", "MVA", "Litigation"],
      content: "Draft a comprehensive personal injury complaint for motor vehicle accident case including:\n- Parties and jurisdiction\n- Factual allegations\n- Negligence claims\n- Damages summary\n- Prayer for relief"
    },
    {
      id: 'p-3',
      type: 'prompt',
      title: "Deposition Outline",
      description: "Creates structured deposition outlines for witness examination.",
      createdBy: "Legal Team",
      dateCreated: "September 12, 2025",
      tags: ["Deposition", "Litigation", "Discovery"],
      content: "Create a comprehensive deposition outline covering:\n- Background information\n- Incident details\n- Damages and treatment\n- Expert qualifications\n- Opinion formation process"
    }
  ];

  // Filter items based on type and search
  const filteredItems = libraryItems.filter(item => {
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Auto-select first item when modal opens or filter changes
  useEffect(() => {
    if (showBrowseModal && filteredItems.length > 0 && !selectedItem) {
      setSelectedItem(filteredItems[0]);
    }
  }, [showBrowseModal, filteredItems, selectedItem]);

  // Reset selection when modal closes
  useEffect(() => {
    if (!showBrowseModal) {
      setSelectedItem(null);
    }
  }, [showBrowseModal]);

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
    <div className="max-w-full mx-auto p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Actions Section */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Zap className="h-5 w-5 text-purple-600 mr-2" />
                Actions
              </h2>
            </div>
            <div className="p-6">
              {/* Uploaded Files Display - Action Card Style */}
              {getActiveTabFiles && getActiveTabFiles().length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {getActiveTabFiles().map((file) => (
                      <div key={file.id} className="flex items-center space-x-1.5 bg-gray-100 px-2.5 py-1.5 rounded-md text-xs">
                        <FileText className="h-3 w-3 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700 truncate max-w-[150px]">{file.name}</span>
                        <button
                          onClick={() => removeFileFromTab && removeFileFromTab(1, file.id)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Section */}
              <div className="mb-4">
                <div className="relative border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question or describe a task. You can upload or drag and drop any additional documents you want to work with."
                    className="w-full p-3 pr-12 border-0 rounded-lg resize-none focus:outline-none bg-transparent"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit();
                      }
                    }}
                  />
                  <button
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim() || !(hasSelectedSources && hasSelectedSources())}
                    className={`absolute top-3 right-3 p-2 rounded-md transition-colors ${
                      chatInput.trim() && hasSelectedSources && hasSelectedSources()
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </button>

                  {/* Chat Input Controls - Inside the input box */}
                  <div className="flex items-center justify-between pl-2 pr-4 pb-2">
                    {/* Left side - Upload, Deep Research, and Output Format buttons */}
                    <div className="flex items-center space-x-1">
                      <input
                        type="file"
                        id="actions-card-file-upload"
                        multiple
                        className="hidden"
                        onChange={handleChatFileInputChange}
                      />
                      <label
                        htmlFor="actions-card-file-upload"
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
                      {/* Output Format Button */}
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
                    </div>
                    {/* Right side - Source counter */}
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center px-3 py-2 text-sm text-gray-700 border border-gray-200 hover:text-purple-600 hover:bg-gray-50 hover:border-purple-300 rounded-md transition-colors">
                    <Zap className="h-4 w-4 text-purple-600 mr-2" />
                    Case Value Assessment
                  </button>
                  <button className="flex items-center px-3 py-2 text-sm text-gray-700 border border-gray-200 hover:text-purple-600 hover:bg-gray-50 hover:border-purple-300 rounded-md transition-colors">
                    <Zap className="h-4 w-4 text-purple-600 mr-2" />
                    Liability Analysis
                  </button>
                  <button
                    onClick={onDraftDocumentRequest}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 border border-gray-200 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-md transition-colors"
                  >
                    <PenTool className="h-4 w-4 text-blue-600 mr-2" />
                    Draft a document
                  </button>
                </div>
                <button 
                  onClick={handleBrowseAllClick}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  Library
                </button>
              </div>
            </div>
          </div>

          {/* Case Details Section */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FileText className="h-5 w-5 text-purple-600 mr-2" />
                Case Details
              </h2>
              <button className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
                Update Case
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Type</dt>
                  <dd className="text-sm text-gray-900">MVA</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Stage</dt>
                  <dd className="text-sm text-gray-900">Pre-Litigation</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Assignee</dt>
                  <dd className="text-sm text-gray-900">Rachel Yastremski</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Supporting Team</dt>
                  <dd className="text-sm text-gray-900">Tony Uyeda, Sarah Fallon</dd>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Case Create Notes 08/13/2025</div>
                <p className="text-sm text-gray-700">
                  Eli was hit by a construction vehicle on his way home from work. He called from the ER to get assistance. So far he has been diagnosed{' '}
                  <button className="text-blue-600 hover:text-blue-800">See more</button>
                </p>
              </div>
            </div>
          </div>


          {/* Tasks Section */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <CheckSquare className="h-5 w-5 text-purple-600 mr-2" />
                Tasks
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/5"></div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                Timeline
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">More</button>
            </div>
            <div className="p-6">
              <div className="flex space-x-4 mb-4">
                <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md">Jump to Date of Incident</button>
                <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md">Review Missing Documents</button>
                <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md">View Treatment Gaps</button>
              </div>
              
              {/* Timeline visualization */}
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">6/24</span>
                  <span className="text-sm text-gray-500">08/25</span>
                </div>
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-2/3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                  {/* Timeline dots */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-2">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < 12 ? 'bg-purple-700' : 'bg-gray-400'}`}></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Medical Records</div>
                  <div className="text-gray-500">44 events</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Bills</div>
                  <div className="text-gray-500">12 events</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Imaging</div>
                  <div className="text-gray-500">15 events</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Doctor Visits</div>
                  <div className="text-gray-500">14 events</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Injuries</div>
                  <div className="text-gray-500">11 events</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[24rem] space-y-6">
          {/* Parties Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Parties</h3>
              <div className="flex items-center text-sm text-blue-600">
                <span>6 suggestions to review</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Client</dt>
                <dd className="text-sm text-gray-900">Eli Strauss</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Defendant</dt>
                <dd className="text-sm text-gray-900">Jane Doe</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Witnesses</dt>
                <dd className="text-sm text-gray-900 space-y-1">
                  <div>Susan Chen</div>
                  <div>Robert Kim</div>
                  <div>Michael Barnes</div>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Adjuster</dt>
                <dd className="text-sm text-gray-900">-</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Defense Counsel</dt>
                <dd className="text-sm text-gray-900">-</dd>
              </div>
            </div>
          </div>

          {/* Key Facts Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Key Facts</h3>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Medical Summary Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Medical Summary</h3>
              <div className="flex items-center text-sm text-blue-600">
                <span>12 suggestions to review</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </div>
          </div>

          {/* Activity Log Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Activity Log</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Police Report uploaded by Jordan Gray</p>
                  <p className="text-xs text-gray-500 mt-1">Extracted 26 details for Parties and Medical Summary <button className="text-blue-600">View</button></p>
                  <p className="text-xs text-gray-500">June 6 2025 18:22</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Client Driver's License uploaded</p>
                  <p className="text-xs text-gray-500">June 6 2025 18:22</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">ER Visit 9/12/25 uploaded</p>
                  <p className="text-xs text-gray-500">June 6 2025 18:22</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Chiropractic Visit 6/12/25 uploaded</p>
                  <p className="text-xs text-gray-500">June 6 2025 18:22</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Chiropractic Visit 6/12/25 uploaded</p>
                  <p className="text-xs text-gray-500">June 6 2025 18:22</p>
                </div>
              </div>
            </div>
          </div>

          {/* Case Status Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Case status</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Files</span>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span>Complete</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Chat</span>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span>Complete</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Instant Timeline</span>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span>Complete</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Case Summary</span>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span>Complete</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Signals and Insights</span>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span>Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reference Modal */}
      {showReferenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Draft from Reference</h3>
              <button 
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* What are you drafting? */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are you drafting?
                </label>
                <input
                  type="text"
                  value={draftingInput}
                  onChange={(e) => setDraftingInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Demand letter, Motion to compel, Deposition questions..."
                />
              </div>

              {/* Upload reference examples */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload 2-3 reference examples
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drop files here or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: PDF, DOC, DOCX (max 10MB each)
                  </p>
                  <button className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                    Choose Files
                  </button>
                </div>
              </div>

              {/* Additional instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any additional instructions?
                </label>
                <textarea
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide any specific requirements, tone, or formatting preferences..."
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Drafting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Library Modal */}
      {showBrowseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Library</h3>
              </div>
              <button
                onClick={handleBrowseModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md mr-6">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Types</option>
                    <option value="prompt">Prompts</option>
                    <option value="workflow">Workflows</option>
                  </select>
                  <span className="text-sm text-gray-600">{filteredItems.length} items</span>
                </div>
              </div>
            </div>

            <div className="flex flex-1 min-h-0">
              {/* Left Panel - Item List */}
              <div className="w-1/2 border-r border-gray-200 overflow-auto">
                <div className="p-4 space-y-3">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedItem?.id === item.id 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.type === 'workflow' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.type === 'workflow' ? 'Workflow' : 'Prompt'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        </div>
                        <button className={`px-3 py-1 text-white rounded text-sm hover:opacity-90 ${
                          item.type === 'workflow' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}>
                          {item.type === 'workflow' ? 'Run' : 'Use'}
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-2">
                        Created by: {item.createdBy} • {item.dateCreated}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel - Item Details */}
              <div className="flex-1 overflow-auto">
                {selectedItem ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <h2 className="text-xl font-semibold text-gray-900 mr-3">{selectedItem.title}</h2>
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            selectedItem.type === 'workflow' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {selectedItem.type === 'workflow' ? 'Workflow' : 'Prompt'}
                          </span>
                        </div>
                        <button className={`px-4 py-2 text-white rounded-md hover:opacity-90 ${
                          selectedItem.type === 'workflow' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}>
                          {selectedItem.type === 'workflow' ? 'Run Workflow' : 'Use Prompt'}
                        </button>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        Created by: {selectedItem.createdBy} • Date: {selectedItem.dateCreated}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedItem.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {selectedItem.type === 'workflow' && selectedItem.dataRequired && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Data Required</h4>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <ul className="text-sm text-gray-700">
                              {selectedItem.dataRequired.map((req, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        {selectedItem.type === 'workflow' ? 'Analysis Details' : 'Prompt Content'}
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {selectedItem.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Select an item to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseOverviewView;