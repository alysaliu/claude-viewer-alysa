import React, { useState } from 'react';
import { BookOpen, FileText, Search, ChevronRight, Paperclip, Copy, Bookmark, X, Check } from 'lucide-react';
import { recentDocuments, allDocuments, recentRecipes } from '../../data/sample-data';
import type { GetStartedOption } from '../../types/workflow-types';
import type { Job } from '../../types/drafting-types';

interface DraftingViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  documentSearchQuery: string;
  setDocumentSearchQuery: (query: string) => void;
  onBlueprintClick: () => void;
  onResponsesClick: () => void;
  onDraftFromExampleClick?: () => void;
  onBlueprintItemClick?: (blueprintId: string) => void;
  jobs?: Job[];
  onJobClick?: (job: Job) => void;
  onSaveReferenceAsBlueprint?: (title: string, description: string, referenceFile: string, documentType?: string, additionalInstructions?: string, starred?: boolean) => void;
}

const DraftingView: React.FC<DraftingViewProps> = ({
  searchQuery,
  setSearchQuery,
  documentSearchQuery,
  setDocumentSearchQuery,
  onBlueprintClick,
  onResponsesClick,
  onDraftFromExampleClick,
  onBlueprintItemClick,
  jobs = [],
  onJobClick,
  onSaveReferenceAsBlueprint,
}) => {
  const [mvpMode, setMvpMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Save blueprint modal state
  const [showSaveBlueprintModal, setShowSaveBlueprintModal] = useState(false);
  const [blueprintTitle, setBlueprintTitle] = useState('');
  const [blueprintDescription, setBlueprintDescription] = useState('');
  const [starBlueprint, setStarBlueprint] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Update current time every second for live timers
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle saving blueprint
  const handleSaveBlueprint = () => {
    if (blueprintTitle.trim() && blueprintDescription.trim() && selectedJob && onSaveReferenceAsBlueprint) {
      // Use the passed callback to save the blueprint with starred status
      onSaveReferenceAsBlueprint(
        blueprintTitle.trim(),
        blueprintDescription.trim(),
        selectedJob.referenceFile || 'Generated Document',
        selectedJob.documentType,
        selectedJob.additionalInstructions,
        starBlueprint
      );


      // Reset modal state
      setShowSaveBlueprintModal(false);
      setBlueprintTitle('');
      setBlueprintDescription('');
      setStarBlueprint(false);
      setSelectedJob(null);
    }
  };

  // Handle opening save blueprint modal
  const handleOpenSaveBlueprintModal = (job: Job) => {
    setSelectedJob(job);
    setShowSaveBlueprintModal(true);
  };

  // Filter and sort document generation jobs for MVP mode (both in-progress and completed)
  const documentGenerationJobs = jobs
    .filter(job => job.type === 'document-generation' && (job.status === 'Complete' || job.status === 'In Progress'))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Most recent first

  // Recent blueprints data
  const recentBlueprints = [
    {
      id: "complaint",
      title: "Complaint",
      description: "Personal injury complaint template"
    },
    {
      id: "motion-summary-judgment",
      title: "Motion for Summary Judgment",
      description: "Standard motion with supporting arguments"
    }
  ];

  // Get started options
  const getStartedOptions: GetStartedOption[] = [
    {
      id: "blueprint",
      title: "Use a Blueprint",
      description: "Use a predefined blueprint to generate a document for this case",
      icon: <BookOpen className="h-6 w-6" />,
      recentItems: recentBlueprints,
      recentTitle: "Recently Used Blueprints"
    },
    {
      id: "draft-from-example",
      title: "Draft from Example",
      description: "Draft a document for this case using an example document as a reference",
      icon: <Copy className="h-6 w-6" />,
      hasCustomContent: true
    },
    {
      id: "respond",
      title: "Build Responses",
      description: "Assemble responses to a list of requests or questions, e.g. interrogatories, production",
      icon: <FileText className="h-6 w-6" />,
      hasCustomContent: true
    }
  ];

  // Filter documents based on search query
  const filteredDocuments = documentSearchQuery 
    ? allDocuments.filter(doc => 
        doc.title.toLowerCase().includes(documentSearchQuery.toLowerCase())
      )
    : allDocuments;

  // Document thumbnail generator
  const DocumentThumbnail = ({ type }: { type: string }) => {
    const bgColor = type === 'deposition' ? 'bg-blue-50' :
                   type === 'timeline' ? 'bg-green-50' :
                   type === 'analysis' ? 'bg-purple-50' :
                   type === 'motion' ? 'bg-amber-50' :
                   'bg-gray-50';
                   
    const textColor = type === 'deposition' ? 'text-blue-800' :
                     type === 'timeline' ? 'text-green-800' :
                     type === 'analysis' ? 'text-purple-800' :
                     type === 'motion' ? 'text-amber-800' :
                     'text-gray-800';
                     
    const icon = type === 'deposition' ? "Q" :
               type === 'timeline' ? "T" :
               type === 'analysis' ? "A" :
               type === 'motion' ? "M" :
               type === 'letter' ? "L" :
               "D";
               
    return (
      <div className={`w-full ${bgColor} rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden`} 
           style={{ aspectRatio: '1/1.414' }}>
        <div className={`text-4xl font-bold ${textColor}`}>{icon}</div>
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        .tooltip-fast[title]:hover:after {
          animation-delay: 0.2s !important;
        }
      `}</style>
      <div className="max-w-full xl:max-w-7xl mx-auto p-4 md:p-6">
      {/* Get Started Section */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-medium text-gray-900">Get Started</h2>
            <label className="flex items-center text-xs text-gray-500">
              <input
                type="checkbox"
                checked={mvpMode}
                onChange={(e) => setMvpMode(e.target.checked)}
                className="w-3 h-3 text-gray-400 border-gray-300 rounded focus:ring-gray-400 focus:ring-1"
              />
              <span className="ml-1">MVP?</span>
            </label>
          </div>
          <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-500 rounded">
            <FileText size={16} className="mr-2" />
            Create Blank Document
          </button>
        </div>

        <div className="p-6">
          {/* Get Started Cards */}
          <div className="flex flex-wrap gap-4">
            {/* Generated Documents Card - Only shown in MVP mode as first card */}
            {mvpMode && documentGenerationJobs.length > 0 && (
              <div
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex flex-col"
                style={{ width: "calc(min(380px, 32vw))", minHeight: "280px" }}
              >
                <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg text-gray-900 mb-3">Generated Documents</h3>
                <div className="space-y-1 mt-2">
                    {documentGenerationJobs.slice(0, 4).map(job => {
                      // Calculate elapsed time for timer using currentTime state
                      const elapsed = job.status === 'In Progress' ? currentTime - job.startTime : (job.elapsedTime || 0);
                      const minutes = Math.floor(elapsed / 60000);
                      const seconds = Math.floor((elapsed % 60000) / 1000);
                      const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                      // Format creation method
                      const creationMethod = job.creationMethod === 'blueprint'
                        ? `from Blueprint "${job.blueprintName || 'Unknown'}"`
                        : job.creationMethod === 'reference'
                          ? 'from example document'
                          : 'Unknown method';

                      // Format start time
                      const startTime = new Date(job.startTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      });

                      // Format document title with dashes in date (MM-DD-YYYY)
                      const dateStr = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
                      const documentTitle = `Michael Garcia - MVA - ${(job.documentType || 'Draft').replace(/\//g, '-')} - ${dateStr}`;

                      return (
                        <div
                          key={job.id}
                          className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${
                            job.status === 'Complete'
                              ? 'bg-green-50 hover:bg-green-100 border border-green-100'
                              : 'bg-blue-50 hover:bg-blue-100 border border-blue-100'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onJobClick?.(job);
                          }}
                        >
                          <div className="flex items-center min-w-0 flex-1">
                            <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 flex-shrink-0 ${
                              job.status === 'Complete' ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              <FileText className={`w-4 h-4 ${
                                job.status === 'Complete' ? 'text-green-600' : 'text-blue-600'
                              }`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                {documentTitle}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {creationMethod}
                              </div>
                              <div className="text-xs text-gray-400 truncate">
                                Started {startTime} • {timeDisplay}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center ml-2">
                            {/* Blueprint save button - only for draft-from-example jobs */}
                            {job.status === 'Complete' && job.creationMethod === 'reference' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!job.savedAsBlueprint) {
                                    handleOpenSaveBlueprintModal(job);
                                  }
                                }}
                                disabled={job.savedAsBlueprint}
                                className={`p-1.5 rounded mr-1 transition-colors tooltip-fast ${
                                  job.savedAsBlueprint
                                    ? 'text-green-600 bg-green-50 cursor-default'
                                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'
                                }`}
                                title={job.savedAsBlueprint ? 'Saved as Blueprint' : 'Save as Blueprint'}
                                style={{ '--tooltip-delay': '0.3s' } as React.CSSProperties}
                              >
                                {job.savedAsBlueprint ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Bookmark className="w-4 h-4" />
                                )}
                              </button>
                            )}
                            {job.status === 'Complete' && (
                              <ChevronRight className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {documentGenerationJobs.length > 4 && (
                      <div className="text-xs text-gray-500 text-center pt-1">
                        +{documentGenerationJobs.length - 4} more
                      </div>
                    )}
                </div>
              </div>
            )}
            {getStartedOptions.map(option => (
              <div
                key={option.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex flex-col"
                style={{ width: "calc(min(380px, 32vw))", minHeight: "280px" }}
                onClick={() => {
                  if (option.id === "blueprint") {
                    onBlueprintClick();
                  } else if (option.id === "respond") {
                    onResponsesClick();
                  } else if (option.id === "draft-from-example") {
                    onDraftFromExampleClick?.();
                  }
                }}
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  {option.icon}
                </div>
                <h3 className="font-medium text-lg text-gray-900 mb-1">{option.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{option.description}</p>
                
                {/* For Draft from Example card, show upload button */}
                {option.hasCustomContent && option.id === "draft-from-example" && (
                  <div className="border-t border-gray-200 pt-3">
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center border border-blue-500 text-blue-600 rounded-md py-2 px-3 hover:bg-blue-50">
                        <Paperclip size={16} className="mr-2" />
                        Upload Example
                      </button>
                      <div className="text-xs text-gray-500 text-center">Supported: docx, pdf, txt, xlsx</div>
                    </div>
                  </div>
                )}

                {/* For Respond card, show special content */}
                {option.hasCustomContent && option.id === "respond" && (
                  <div className="border-t border-gray-200 pt-3">
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center border border-blue-500 text-blue-600 rounded-md py-2 px-3 hover:bg-blue-50">
                        <Paperclip size={16} className="mr-2" />
                        Upload File
                      </button>
                      <div className="text-xs text-gray-500 text-center">Supported: docx, txt, pdf</div>
                      <button className="w-full text-gray-600 hover:text-blue-600 hover:bg-gray-100 text-sm mt-2 py-1 px-3 rounded underline underline-offset-2 transition-colors">
                        or add manually
                      </button>
                    </div>
                  </div>
                )}
                
                {/* For Blueprint card, show recent items */}
                {option.recentItems && option.recentItems.length > 0 && (
                  <div className="border-t border-gray-200 pt-3 mt-auto">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">{option.recentTitle}</h4>
                    <div className="space-y-2">
                      {option.recentItems.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center py-1 hover:bg-gray-100 px-2 rounded cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onBlueprintItemClick?.(item.id);
                          }}
                        >
                          <div className="w-full overflow-hidden">
                            <div className="text-xs font-medium text-gray-800 truncate">{item.title}</div>
                            <div className="text-xs text-gray-500 truncate">{item.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Documents */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-medium text-gray-900">All Documents</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2 py-0.5">9</span>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="text"
                className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search documents..."
                value={documentSearchQuery}
                onChange={(e) => setDocumentSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-700">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                        <div className="text-xs text-gray-500">Supio • {doc.editor}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Last modified: {doc.lastModified}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-end">
                      <button className="text-gray-400 hover:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            1 / 25 pages
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              Previous
            </button>
            <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              Next
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Save Blueprint Modal */}
      {showSaveBlueprintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Save as Blueprint</h3>
              <button
                onClick={() => {
                  setShowSaveBlueprintModal(false);
                  setBlueprintTitle('');
                  setBlueprintDescription('');
                  setStarBlueprint(false);
                  setSelectedJob(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="blueprint-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Blueprint Title
                </label>
                <input
                  id="blueprint-title"
                  type="text"
                  value={blueprintTitle}
                  onChange={(e) => setBlueprintTitle(e.target.value)}
                  placeholder="Enter a name for this blueprint..."
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
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  setShowSaveBlueprintModal(false);
                  setBlueprintTitle('');
                  setBlueprintDescription('');
                  setStarBlueprint(false);
                  setSelectedJob(null);
                }}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
    </>
  );
};

export default DraftingView;