import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, CheckCircle, Loader, Download, RefreshCw, FileText, HelpCircle, Info, X, Save, Bookmark, Star, Check } from 'lucide-react';
import type { DocumentGenerationJob } from '../../types/drafting-types';

interface DocumentCanvasViewProps {
  job: DocumentGenerationJob;
  onBack: () => void;
  onOpenAIAssistant?: () => void;
  onCreateDocumentTab?: (tabName: string, jobId: string) => void;
  onDocumentSelectionChange?: (hasSelection: boolean, selectedText?: string) => void;
  onSendChatMessage?: (message: string, simulateResponse: boolean, responseContent?: string) => void;
  onSaveReferenceAsBlueprint?: (title: string, description: string, referenceFile: string, documentType?: string, additionalInstructions?: string, starred?: boolean) => void;
}

// Simulated intermediate reasoning tokens for in-progress jobs
const reasoningTokens = [
  "Analyzing the uploaded document structure...",
  "Identifying key legal arguments and precedents...",
  "Extracting relevant factual assertions...",
  "Reviewing jurisdictional requirements...",
  "Organizing sections according to court rules...",
  "Checking citation format and legal references...",
  "Ensuring proper paragraph structure...",
  "Validating procedural compliance...",
  "Optimizing argument flow and logic...",
  "Finalizing document formatting..."
];

// Simulated final output tokens for completed jobs
const finalOutputTokens = [
  "MICHAEL GARCIA,\n\n",
  "                    Plaintiff,\n\n",
  "vs.\n\n",
  "LIBERTY MUTUAL INSURANCE COMPANY,\n",
  "JOHN DOES 1-100 (fictional natural persons);\n",
  "and ABC CORPORATION (S) 1-100 (fictional\n",
  "business entities),\n\n",
  "                    Defendant(s).\n\n\n",
  "SUPERIOR COURT OF NEW JERSEY\n",
  "LAW DIVISION: MORRIS COUNTY\n",
  "DOCKET NO: MOR-L-\n\n",
  "CIVIL ACTION\n\n",
  "COMPLAINT,\n",
  "JURY DEMAND,\n",
  "DESIGNATION OF TRIAL COUNSEL,\n",
  "REQUEST FOR DISCOVERY OF\n",
  "INSURANCE COVERAGE,\n",
  "DEMAND FOR ANSWERS TO\n",
  "INTERROGATORIES AND\n",
  "DEMAND FOR PRODUCTION OF\n",
  "DOCUMENTS\n\n\n",
  "Plaintiff, MICHAEL GARCIA by way of Complaint against the Defendants, hereby allege:\n\n",
  "FIRST COUNT\n\n",
  "1. Plaintiff, MICHAEL GARCIA resides at 427 Maple Avenue, ",
  "Morristown, New Jersey 07960.\n\n",
  "2. At all times relevant to the matters set forth herein, the Defendant, ",
  "LIBERTY MUTUAL INSURANCE COMPANY, is a corporation organized and ",
  "authorized to do business at 175 Berkeley Street, Boston, MA 02116.\n\n",
  "3. At all times mentioned herein and prior thereto, the Defendants, ",
  "JOHN DOES (1-100), A.B.C. COMPANIES (1-100), are fictional Defendants ",
  "designated as other corporations, partnerships, proprietorships, or other ",
  "business entities responsible individually and/or jointly or severally, or by ",
  "their agents, servants, and/or employees, for the ownership, operation, ",
  "maintenance, use and/or supervision of a policy of insurance which provided ",
  "for underinsured motorist coverage.\n\n",
  "4. On or about March 15, 2024, Plaintiff, MICHAEL GARCIA was the lawful ",
  "owner and operator of a motor vehicle that was lawfully traveling Eastbound ",
  "on Route 10, Morris County, New Jersey.\n\n",
  "5. At the same time and place, Defendant, ROBERT THOMPSON was the owner ",
  "and operator of a vehicle which was negligently and carelessly traveling ",
  "Eastbound Route 10, Morris County, New Jersey, when suddenly, without signal ",
  "or warning, Defendant struck the vehicle of Plaintiff, causing Plaintiff to ",
  "sustain permanent injuries.\n\n",
  "6. On or about June 20, 2024, the tortfeasor, ROBERT THOMPSON settled ",
  "pursuant to the available policy limits in the amount of $25,000.00.\n\n",
  "7. At the time and place aforesaid, Plaintiff's vehicle owned and operated ",
  "by MICHAEL GARCIA maintained an automobile insurance policy with LIBERTY ",
  "MUTUAL INSURANCE COMPANY, under policy number LM885542190 with underinsured ",
  "motorist limits of $250,000.00.\n\n",
  "8. Plaintiff has claimed for Underinsured Motorist coverage (UIM) under ",
  "Defendant's, LIBERTY MUTUAL INSURANCE COMPANY'S policy however LIBERTY ",
  "MUTUAL INSURANCE COMPANY continually and wrongfully refuses to provide ",
  "payment for such coverage.\n\n",
  "9. As a proximate result of the said Defendants' carelessness and negligence, ",
  "Plaintiff suffered severe, painful, disabling, and permanent injuries to his ",
  "body, which injuries necessitated his obtaining medical treatment; he was ",
  "compelled and shall in the future be compelled to expend large sums of money ",
  "for medical care and attention, as well as endure great physical and emotional ",
  "pain, suffering, disability, stress, anxiety, depression, inconvenience, and ",
  "distress; he is prevented from pursuing and enjoying his usual family activities, ",
  "attending to his duties and chores and from assuming employment and his earning ",
  "power has been materially and adversely affected and he was otherwise damaged.\n\n",
  "WHEREFORE, Plaintiff demands Judgment against the Defendant, LIBERTY MUTUAL ",
  "INSURANCE COMPANY for damages together with interest, costs of suit, attorney's ",
  "fees, and such other and further relief as the Court may deem just and equitable."
];

const DocumentCanvasView: React.FC<DocumentCanvasViewProps> = ({ job, onBack, onOpenAIAssistant, onCreateDocumentTab, onDocumentSelectionChange, onSendChatMessage, onSaveReferenceAsBlueprint }) => {
  const [displayedTokens, setDisplayedTokens] = useState<string[]>([]);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  // Selection state
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [showSelectionCard, setShowSelectionCard] = useState(false);
  const [actionCardMode, setActionCardMode] = useState<'default' | 'redraft'>('default');
  const [redraftInstructions, setRedraftInstructions] = useState('');
  const [isRedrafting, setIsRedrafting] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  // Document info panel state
  const [showDocumentInfo, setShowDocumentInfo] = useState(false);

  // Save blueprint modal state
  const [showSaveBlueprintModal, setShowSaveBlueprintModal] = useState(false);
  const [blueprintTitle, setBlueprintTitle] = useState('');
  const [blueprintDescription, setBlueprintDescription] = useState('');
  const [starBlueprint, setStarBlueprint] = useState(false);

  // Track if AI Assistant has been auto-opened for this job
  const [hasAutoOpenedAI, setHasAutoOpenedAI] = useState(false);

  // Handle initial mount and job status changes
  useEffect(() => {
    // Reset AI auto-open flag when job changes
    setHasAutoOpenedAI(false);

    if (job.status === 'In Progress') {
      // Show reasoning tokens for in-progress jobs
      setDisplayedTokens([]);
      setCurrentTokenIndex(0);
      setIsStreaming(true);

      const streamTokens = () => {
        setCurrentTokenIndex(prevIndex => {
          if (prevIndex < reasoningTokens.length) {
            setDisplayedTokens(prev => [...prev, reasoningTokens[prevIndex]]);
            return prevIndex + 1;
          } else {
            setIsStreaming(false);
            return prevIndex;
          }
        });
      };

      const interval = setInterval(streamTokens, 1500);
      return () => clearInterval(interval);
    } else if (job.status === 'Complete') {
      // Job is complete - show final document immediately
      setDisplayedTokens(finalOutputTokens);
      setIsStreaming(false);
    }
  }, [job.status, job.id]); // Added job.id to ensure it runs on job changes

  // Handle text selection
  const handleTextSelection = () => {
    // Don't handle new selections if in redraft mode
    if (actionCardMode === 'redraft') {
      return;
    }

    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) {
      // Only close if not in redraft mode
      if (actionCardMode === 'default') {
        setShowSelectionCard(false);
        onDocumentSelectionChange?.(false, '');
      }
      return;
    }

    const selectedText = selection.toString().trim();

    if (!selectedText) {
      // Only close if not in redraft mode
      if (actionCardMode === 'default') {
        setShowSelectionCard(false);
        onDocumentSelectionChange?.(false, '');
      }
      return;
    }

    // Notify parent component about selection with the selected text
    onDocumentSelectionChange?.(true, selectedText);

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Use viewport coordinates with right bias and more distance
    const x = rect.left + rect.width * 0.85; // Right-biased positioning
    const y = rect.top - 50; // 50px above selection

    setSelectedText(selectedText);
    setSelectionPosition({ x, y });
    setShowSelectionCard(true);
    setActionCardMode('default'); // Reset to default mode for new selections
  };

  // Handle selection actions
  const handleSelectionAction = (action: 'redraft' | 'cite' | 'explain') => {
    if (action === 'redraft') {
      setActionCardMode('redraft');
      setRedraftInstructions('');
    } else if (action === 'cite') {
      const citationMessage = `Create a citation for "${selectedText}"`;
      const citationResponse = `Here are relevant citations from the case files for "${selectedText.substring(0, 50)}${selectedText.length > 50 ? '...' : ''}":

**📄 MVA_Police_Report_2024-03-15.pdf**
*Page 3, Section 4*
"Driver of Vehicle 2 failed to yield right of way when making left turn onto Route 10 East..."

**📄 Medical_Records_Chen_Orthopedic.pdf**
*Page 1, Treatment Summary*
"Patient presents with severe lower back pain and limited mobility following motor vehicle collision..."

**📄 Liberty_Mutual_Policy_Review.pdf**
*Page 2, Coverage Details*
"Underinsured motorist coverage limits of $250,000 apply to this claim under Policy #LM885542190..."

**📄 Witness_Statement_Walsh_Jennifer.pdf**
*Page 2, Lines 45-67*
"I saw the defendant's vehicle run the red light at approximately 35 mph in a 25 mph zone..."

**📄 Garcia_Industries_Employment_Records.pdf**
*Page 4, Wage Statement 2023-2024*
"Annual salary: $85,000. Missed work days due to injury: 42 days (March 16 - May 3, 2024)..."`;

      onSendChatMessage?.(citationMessage, true, citationResponse);
      setShowSelectionCard(false);
      clearSelection();
    } else if (action === 'explain') {
      const explainMessage = `Explain "${selectedText}"`;
      const explanationResponse = `**Explanation of Selected Text:**

The selected text "${selectedText.substring(0, 100)}${selectedText.length > 100 ? '...' : ''}" serves a specific legal purpose in this document.

This provision establishes the factual foundation necessary for the legal claims that follow. In legal drafting, each allegation must be supported by sufficient detail to meet pleading standards while remaining concise and clear.

**Key Legal Elements:**
- **Factual Allegations**: Provides the who, what, when, and where details
- **Jurisdictional Basis**: Establishes the court's authority to hear the case
- **Cause of Action**: Lays groundwork for the specific legal theories being pursued
- **Damages Foundation**: Creates the basis for claiming monetary relief

**Strategic Considerations:**
This language is carefully crafted to meet federal pleading standards while preserving flexibility for discovery. The specificity level balances providing enough detail to survive a motion to dismiss while not overly constraining the case theory.`;

      onSendChatMessage?.(explainMessage, true, explanationResponse);
      setShowSelectionCard(false);
      clearSelection();
    }
  };

  // Helper function to clear selection
  const clearSelection = () => {
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  };

  // Handle redraft cancel
  const handleRedraftCancel = () => {
    setActionCardMode('default');
    setRedraftInstructions('');
  };

  // Handle redraft cancel and close card
  const handleRedraftCancelAndClose = () => {
    setActionCardMode('default');
    setRedraftInstructions('');
    setShowSelectionCard(false);
    clearSelection();
  };

  // Handle redraft submit
  const handleRedraftSubmit = () => {
    if (!redraftInstructions.trim()) return;

    setShowSelectionCard(false);
    setIsRedrafting(true);
    setActionCardMode('default');
    setRedraftInstructions('');
    clearSelection();

    // Clear the selection state in parent component
    onDocumentSelectionChange?.(false, '');

    // Simulate redrafting for 7 seconds
    setTimeout(() => {
      setIsRedrafting(false);
    }, 7000);
  };

  const handleSaveBlueprint = () => {
    if (blueprintTitle.trim() && blueprintDescription.trim() && job.referenceFile && onSaveReferenceAsBlueprint) {
      onSaveReferenceAsBlueprint(blueprintTitle.trim(), blueprintDescription.trim(), job.referenceFile, job.documentType, job.additionalInstructions, starBlueprint);


      setShowSaveBlueprintModal(false);
      setBlueprintTitle('');
      setBlueprintDescription('');
      setStarBlueprint(false);
    }
  };

  // Close selection card when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking on the selection card itself
      if (e.target && (e.target as Element).closest('.selection-card')) {
        return;
      }

      // If in redraft mode, treat click outside as cancel and close
      if (actionCardMode === 'redraft') {
        handleRedraftCancelAndClose();
      } else {
        setShowSelectionCard(false);
      }
    };

    // Only add listener when card is shown
    if (showSelectionCard) {
      // Use a timeout to prevent immediate closing when card first appears
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showSelectionCard, actionCardMode]);

  // Auto-open AI Assistant for completed jobs (only once per job)
  useEffect(() => {
    if (job.status === 'Complete' && onOpenAIAssistant && !hasAutoOpenedAI) {
      // Small delay to ensure canvas is fully mounted
      setTimeout(() => {
        onOpenAIAssistant();
        // Create a document-specific tab with the document title
        const documentName = `${job.title} - Review`;
        onCreateDocumentTab?.(documentName, job.id);
        setHasAutoOpenedAI(true);
      }, 500);
    }
  }, [job.id, job.status, hasAutoOpenedAI]); // Removed onOpenAIAssistant from deps



  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  Michael Garcia - MVA - {(job.documentType || 'Draft').replace(/\//g, '-')} - {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </h1>
                <button
                  onClick={() => setShowDocumentInfo(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Show document info"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              job.status === 'Complete'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {job.status === 'Complete' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Loader className="h-4 w-4 animate-spin" />
              )}
              <span>{job.status}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated {job.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area - Scrollable */}
      <div className="flex-1 flex bg-gray-50 overflow-hidden">
        {/* Left Sidebar - Fixed */}
        {showDocumentInfo && (
          <div className="flex-shrink-0 w-56 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900">Document Info</h3>
                </div>
                <button
                  onClick={() => setShowDocumentInfo(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Hide document info"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                  <p className="text-sm text-gray-900 mt-1">{job.status}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Creation Method</label>
                  <p className="text-sm text-gray-900 mt-1 capitalize">{job.creationMethod}</p>
                </div>
                {job.creationMethod === 'blueprint' && job.blueprintName && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Blueprint</label>
                    <p className="text-sm text-gray-900 mt-1">{job.blueprintName}</p>
                  </div>
                )}
                {job.creationMethod === 'reference' && job.referenceFile && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reference File</label>
                    <p className="text-sm text-gray-900 mt-1">{job.referenceFile}</p>
                    {job.status === 'Complete' && (
                      <button
                        onClick={() => {
                          if (!job.savedAsBlueprint) {
                            setShowSaveBlueprintModal(true);
                          }
                        }}
                        disabled={job.savedAsBlueprint}
                        className={`mt-2 text-xs font-medium flex items-center space-x-1 ${
                          job.savedAsBlueprint
                            ? 'text-green-600 cursor-default'
                            : 'text-blue-600 hover:text-blue-800 cursor-pointer'
                        }`}
                      >
                        {job.savedAsBlueprint ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Bookmark className="h-3 w-3" />
                        )}
                        <span>{job.savedAsBlueprint ? 'Saved as Blueprint' : 'Save as Blueprint'}</span>
                      </button>
                    )}
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</label>
                  <p className="text-sm text-gray-900 mt-1">{job.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Updated</label>
                  <p className="text-sm text-gray-900 mt-1">{job.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div
            ref={documentRef}
            className="relative max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 min-h-[800px]"
            onMouseUp={handleTextSelection}
            onKeyUp={handleTextSelection}
          >
            {job.status === 'In Progress' ? (
              // Reasoning tokens for in-progress jobs
              <div className="space-y-3">
                {displayedTokens.map((token, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 font-mono text-sm">{token}</p>
                  </div>
                ))}
                {isStreaming && (
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mt-1"></div>
                  </div>
                )}
              </div>
            ) : (
              // Final document output for completed jobs
              <div
                className="font-mono text-sm text-gray-800 whitespace-pre-wrap leading-relaxed select-text relative"
                style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
              >
                {isRedrafting ? (
                  // Show animated gray blocks during redrafting
                  <div className="space-y-2">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="flex space-x-1">
                        {[...Array(Math.floor(Math.random() * 6) + 4)].map((_, j) => (
                          <div
                            key={j}
                            className="h-4 bg-gray-300 rounded animate-pulse"
                            style={{
                              width: `${Math.random() * 60 + 40}px`,
                              animationDelay: `${(i * 3 + j) * 100}ms`,
                              animationDuration: '1.5s'
                            }}
                          />
                        ))}
                      </div>
                    ))}
                    <div className="flex justify-center mt-4">
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <span>Redrafting section...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {displayedTokens.join('')}
                    {isStreaming && (
                      <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1"></span>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Selection Action Card */}
            {showSelectionCard && selectionPosition && (
              <div
                className={`selection-card fixed z-50 bg-white border-2 border-gray-300 rounded-lg shadow-lg ${
                  actionCardMode === 'redraft' ? 'p-3 w-80' : 'p-2'
                }`}
                style={{
                  left: `${selectionPosition.x}px`,
                  top: `${selectionPosition.y}px`,
                  transform: actionCardMode === 'redraft' ? 'translateX(-50%)' : 'translateX(-30%)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {actionCardMode === 'default' ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSelectionAction('redraft')}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Redraft</span>
                    </button>
                    <button
                      onClick={() => handleSelectionAction('cite')}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Cite</span>
                    </button>
                    <button
                      onClick={() => handleSelectionAction('explain')}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    >
                      <HelpCircle className="h-3 w-3" />
                      <span>Explain</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Redraft Instructions</span>
                    </div>
                    <textarea
                      value={redraftInstructions}
                      onChange={(e) => {
                        e.stopPropagation();
                        setRedraftInstructions(e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      placeholder="Enter instructions for how you'd like this section redrafted..."
                      className="w-full p-2 border border-gray-300 rounded text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRedraftCancel();
                        }}
                        className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRedraftSubmit();
                        }}
                        disabled={!redraftInstructions.trim()}
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Redraft
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Blueprint Modal */}
      {showSaveBlueprintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Save as Blueprint</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="blueprint-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Blueprint Title
                </label>
                <input
                  type="text"
                  id="blueprint-title"
                  value={blueprintTitle}
                  onChange={(e) => setBlueprintTitle(e.target.value)}
                  placeholder="e.g. Personal Injury Complaint Template"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="blueprint-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="blueprint-description"
                  value={blueprintDescription}
                  onChange={(e) => setBlueprintDescription(e.target.value)}
                  placeholder="Describe what this blueprint is used for and when to use it..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              {/* Star Blueprint Option */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={starBlueprint}
                    onChange={(e) => setStarBlueprint(e.target.checked)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Star this blueprint
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Starred blueprints appear at the top of your library
                </p>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Reference File:</strong> {job.referenceFile}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSaveBlueprintModal(false);
                  setBlueprintTitle('');
                  setBlueprintDescription('');
                  setStarBlueprint(false);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlueprint}
                disabled={!blueprintTitle.trim() || !blueprintDescription.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCanvasView;