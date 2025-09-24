import React, { useState, useEffect } from 'react';
import { X, ChevronDown, FileText, ArrowUpDown } from 'lucide-react';

interface SourceSelectorModalProps {
  show: boolean;
  onClose: () => void;
  selectedSources: Set<string>;
  onSourcesChange: (sources: Set<string>) => void;
  uploadedFiles?: Array<{id: string; name: string; size: number; type: string; file: File}>;
}

const SourceSelectorModal: React.FC<SourceSelectorModalProps> = ({
  show,
  onClose,
  selectedSources,
  onSourcesChange,
  uploadedFiles = []
}) => {
  // Debug log to see what sources are being passed in
  useEffect(() => {
    if (show) {
      console.log('SourceSelectorModal opened with selectedSources:', [...selectedSources]);
      console.log('SourceSelectorModal uploadedFiles:', uploadedFiles.map(f => ({ id: f.id, name: f.name })));
    }
  }, [show, selectedSources, uploadedFiles]);
  const [sourceSearch, setSourceSearch] = useState('');
  const [viewMode, setViewMode] = useState<'category' | 'list'>('category');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<'name' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Auto-expand Files from Conversation category when files are present
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      setExpandedCategories(prev => new Set([...prev, 'Files from Conversation']));
    }
  }, [uploadedFiles.length]);

  // Mock document data for source selection
  const documentData = {
    "Correspondence and Communications": [
      {
        id: "msg1",
        name: "insurance_adjuster_texts.pdf",
        description: "Communication between Garcia and State Farm adjuster regarding claim denial and settlement negotiations following the accident...",
        size: "89.2 KB",
        pages: "3 pages",
        dateUploaded: "2024-03-15"
      },
      {
        id: "msg2",
        name: "garcia_medical_emails.pdf",
        description: "Correspondence with Dr. Martinez regarding ongoing treatment for neck and back injuries sustained in the motor vehicle collision...",
        size: "156.8 KB",
        pages: "5 pages",
        dateUploaded: "2024-03-12"
      }
    ],
    "Discovery Documents": [
      {
        id: "disc1",
        name: "defendant_deposition_transcript.docx",
        description: "Sworn testimony from John Smith regarding circumstances leading to the rear-end collision on Highway 101",
        size: "342 KB",
        pages: "18 pages",
        dateUploaded: "2024-02-28"
      },
      {
        id: "disc2",
        name: "police_accident_report.pdf",
        description: "Official incident report filed by responding officer documenting vehicle positions, witness statements, and traffic citations",
        size: "1.1 MB",
        pages: "6 pages",
        dateUploaded: "2024-02-20"
      }
    ],
    "Evidence and Reports": [
      {
        id: "ev1",
        name: "accident_scene_photos.pdf",
        description: "Digital photographs showing vehicle damage, skid marks, intersection layout, and traffic signal positions",
        size: "4.7 MB",
        pages: "24 images",
        dateUploaded: "2024-03-08"
      },
      {
        id: "ev2",
        name: "accident_reconstruction_report.pdf",
        description: "Expert analysis of collision dynamics, speed calculations, and causation factors by certified traffic engineer",
        size: "1.3 MB",
        pages: "12 pages",
        dateUploaded: "2024-03-05"
      }
    ],
    "Financial and Employment Records": [
      {
        id: "fin1",
        name: "lost_wages_documentation.docx",
        description: "Employment records and pay stubs showing Garcia's income loss during recovery period from injuries",
        size: "203 KB",
        pages: "8 pages",
        dateUploaded: "2024-03-10"
      },
      {
        id: "fin2",
        name: "medical_expenses_summary.docx",
        description: "Itemized medical bills and insurance claims for treatment related to accident injuries",
        size: "445 KB",
        pages: "15 pages",
        dateUploaded: "2024-03-18"
      }
    ]
  };

  // Helper functions
  const getTotalDocCount = () => Object.values(documentData).flat().length + uploadedFiles.length;

  const getSelectedSourcesInModal = () => {
    // Count only sources that exist in this modal (not external staged files)
    const allModalSourceIds = [
      ...Object.values(documentData).flat().map(doc => doc.id),
      ...uploadedFiles.map(file => `uploaded-${file.id}`)
    ];
    return Array.from(selectedSources).filter(sourceId => allModalSourceIds.includes(sourceId)).length;
  };

  const getFilteredSources = (searchQuery: string) => {
    if (!searchQuery) return documentData;

    const filteredData: typeof documentData = {};

    Object.entries(documentData).forEach(([category, documents]) => {
      const filteredDocs = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredDocs.length > 0) {
        filteredData[category as keyof typeof documentData] = filteredDocs;
      }
    });

    return filteredData;
  };

  const sortDocuments = (docs: any[], sortOrder: 'name' | 'date', direction: 'asc' | 'desc') => {
    return [...docs].sort((a, b) => {
      let comparison = 0;

      switch (sortOrder) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.dateUploaded).getTime() - new Date(b.dateUploaded).getTime();
          break;
        default:
          return 0;
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  };

  const toggleSource = (sourceId: string) => {
    console.log(`SourceSelectorModal toggleSource called with: ${sourceId}`);
    console.log(`Current selectedSources before toggle:`, [...selectedSources]);
    const newSelected = new Set(selectedSources);
    if (newSelected.has(sourceId)) {
      console.log(`Removing ${sourceId} from selection`);
      newSelected.delete(sourceId);
    } else {
      console.log(`Adding ${sourceId} to selection`);
      newSelected.add(sourceId);
    }
    console.log(`New selection after toggle:`, [...newSelected]);
    onSourcesChange(newSelected);
  };

  const toggleAllCategories = (expand: boolean) => {
    const allCategories = Object.keys(documentData);
    setExpandedCategories(expand ? new Set(allCategories) : new Set());
  };

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleSelectCategory = (category: string, selectAll: boolean) => {
    const categoryDocs = documentData[category as keyof typeof documentData] || [];
    const categoryIds = categoryDocs.map(doc => doc.id);

    const newSelected = new Set(selectedSources);
    if (selectAll) {
      categoryIds.forEach(id => newSelected.add(id));
    } else {
      categoryIds.forEach(id => newSelected.delete(id));
    }
    onSourcesChange(newSelected);
  };

  const handleSelectAllSources = (selectAll: boolean) => {
    const allDocIds = Object.values(documentData).flat().map(doc => doc.id);
    const allUploadedIds = uploadedFiles.map(file => `uploaded-${file.id}`);
    const allIds = [...allDocIds, ...allUploadedIds];
    onSourcesChange(selectAll ? new Set(allIds) : new Set());
  };


  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Select Case Data Sources</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          {/* Search and View Controls */}
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search sources..."
              value={sourceSearch}
              onChange={(e) => setSourceSearch(e.target.value)}
              className="w-3/5 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex items-center space-x-2">
              {viewMode === 'category' ? (
                <button
                  onClick={() => toggleAllCategories(expandedCategories.size < Object.keys(documentData).length)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {expandedCategories.size < Object.keys(documentData).length ? 'Expand All' : 'Collapse All'}
                </button>
              ) : (
                <>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'name' | 'date')}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="date">Sort by Date Uploaded</option>
                  </select>
                  <button
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                    title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </>
              )}
              <div className="flex bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => setViewMode('category')}
                  className={`px-3 py-2 text-sm font-medium rounded ${
                    viewMode === 'category' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Category
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium rounded ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* File List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {viewMode === 'list' ? (
              // List View - Flat list of all files
              <div className="space-y-1">
                {/* Uploaded Files */}
                {uploadedFiles.map(file => (
                  <div key={`uploaded-${file.id}`} className="flex items-start space-x-3 py-2 px-3 hover:bg-blue-50 rounded border border-gray-100">
                    <input
                      type="checkbox"
                      checked={selectedSources.has(`uploaded-${file.id}`)}
                      onChange={() => toggleSource(`uploaded-${file.id}`)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 leading-tight">{file.name}</h4>
                      <p className="text-xs text-blue-600 mt-0.5">Uploaded file</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">{file.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Regular Documents */}
                {sortDocuments(Object.values(getFilteredSources(sourceSearch)).flat(), sortOrder, sortDirection).map(doc => (
                  <div key={doc.id} className="flex items-start space-x-3 py-2 px-3 hover:bg-blue-50 rounded border border-gray-100">
                    <input
                      type="checkbox"
                      checked={selectedSources.has(doc.id)}
                      onChange={() => toggleSource(doc.id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 leading-tight">{doc.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{doc.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">{doc.size}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">{doc.pages}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Category View - Organized by categories
              <div className="space-y-2">
                {/* Files from Conversation Category */}
                {uploadedFiles.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Files from Conversation Category Header */}
                    <div
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 cursor-pointer border-b border-gray-200"
                      onClick={() => toggleCategoryExpansion('Files from Conversation')}
                    >
                      <div className="flex items-center space-x-3">
                        <ChevronDown className={`h-4 w-4 text-blue-500 transition-transform ${expandedCategories.has('Files from Conversation') ? 'rotate-0' : '-rotate-90'}`} />
                        <input
                          type="checkbox"
                          checked={uploadedFiles.every(file => selectedSources.has(`uploaded-${file.id}`))}
                          ref={el => {
                            if (el) {
                              const selectedCount = uploadedFiles.filter(file => selectedSources.has(`uploaded-${file.id}`)).length;
                              el.indeterminate = selectedCount > 0 && selectedCount < uploadedFiles.length;
                            }
                          }}
                          onChange={(e) => {
                            e.stopPropagation();
                            uploadedFiles.forEach(file => {
                              const fileSourceId = `uploaded-${file.id}`;
                              const newSelected = new Set(selectedSources);
                              if (e.target.checked) {
                                newSelected.add(fileSourceId);
                              } else {
                                newSelected.delete(fileSourceId);
                              }
                              onSourcesChange(newSelected);
                            });
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-semibold text-gray-900">Files from Conversation</span>
                          <div className="text-xs text-gray-500 mt-0.5">{uploadedFiles.length} files</div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-blue-600">
                        {uploadedFiles.filter(file => selectedSources.has(`uploaded-${file.id}`)).length}/{uploadedFiles.length}
                      </div>
                    </div>

                    {/* Files from Conversation Content */}
                    {expandedCategories.has('Files from Conversation') && (
                      <div className="space-y-0">
                        {uploadedFiles.map(file => (
                          <div key={`uploaded-${file.id}`} className="flex items-start space-x-3 py-3 px-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0">
                            <input
                              type="checkbox"
                              checked={(() => {
                                const sourceId = `uploaded-${file.id}`;
                                const isChecked = selectedSources.has(sourceId);
                                console.log(`Checkbox for ${file.name} (${sourceId}): ${isChecked ? 'CHECKED' : 'UNCHECKED'}`);
                                return isChecked;
                              })()}
                              onChange={() => toggleSource(`uploaded-${file.id}`)}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 leading-tight">{file.name}</h4>
                              <p className="text-xs text-blue-600 mt-0.5">From this conversation</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-400">{file.type}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {Object.entries(getFilteredSources(sourceSearch)).map(([category, documents]) => {
                  const selectedInCategory = documents.filter(doc => selectedSources.has(doc.id)).length;
                  const isPartiallySelected = selectedInCategory > 0 && selectedInCategory < documents.length;
                  const isAllSelected = selectedInCategory === documents.length;
                  const isCategoryExpanded = expandedCategories.has(category);

                  return (
                    <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Enhanced Category Header */}
                      <div
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 cursor-pointer border-b border-gray-200"
                        onClick={() => toggleCategoryExpansion(category)}
                      >
                        <div className="flex items-center space-x-3">
                          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isCategoryExpanded ? 'rotate-0' : '-rotate-90'}`} />
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            ref={el => {
                              if (el) el.indeterminate = isPartiallySelected;
                            }}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectCategory(category, e.target.checked);
                            }}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <div>
                            <span className="text-sm font-semibold text-gray-900">{category}</span>
                            <div className="text-xs text-gray-500 mt-0.5">{documents.length} files</div>
                          </div>
                        </div>
                        <div className="text-xs font-medium text-blue-600">{selectedInCategory}/{documents.length}</div>
                      </div>

                      {/* Collapsible Category Content */}
                      {isCategoryExpanded && (
                        <div className="space-y-0">
                          {documents.map(doc => (
                            <div key={doc.id} className="flex items-start space-x-3 py-3 px-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0">
                              <input
                                type="checkbox"
                                checked={selectedSources.has(doc.id)}
                                onChange={() => toggleSource(doc.id)}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 leading-tight">{doc.name}</h4>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{doc.description}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs text-gray-400">{doc.size}</span>
                                  <span className="text-xs text-gray-300">•</span>
                                  <span className="text-xs text-gray-400">{doc.pages}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {getSelectedSourcesInModal()} of {getTotalDocCount()} sources selected
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSelectAllSources(getSelectedSourcesInModal() < getTotalDocCount())}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {getSelectedSourcesInModal() < getTotalDocCount() ? 'Select All' : 'Clear All'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceSelectorModal;