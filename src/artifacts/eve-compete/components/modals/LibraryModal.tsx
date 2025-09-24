import React, { useState, useEffect } from 'react';
import { Search, X, Zap } from 'lucide-react';

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

interface LibraryModalProps {
  show: boolean;
  onClose: () => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ show, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Unified library items (workflows and prompts)
  const libraryItems: LibraryItem[] = [
    // Workflows
    {
      id: 'pb-1',
      type: 'workflow',
      title: "Case Value Assessment",
      description: "Analyze medical records, bills, and damages to assess the potential value of a personal injury case.",
      createdBy: "Supio",
      dateCreated: "June 30, 2025",
      tags: ["Analysis", "Valuation", "MVA"],
      dataRequired: ["Medical records", "Bills", "Treatment history"],
      content: "This workflow guides you through:\n- Medical record analysis\n- Treatment cost evaluation\n- Pain and suffering assessment\n- Lost wage calculations\n- Comparative case analysis"
    },
    {
      id: 'pb-2',
      type: 'workflow',
      title: "Liability & Negligence Analysis",
      description: "Identify liability factors, witness statements, and supporting evidence for establishing negligence in motor vehicle accidents.",
      createdBy: "Supio",
      dateCreated: "June 25, 2025",
      tags: ["Liability", "Analysis", "MVA"],
      dataRequired: ["Police reports", "Witness statements", "Photos"],
      content: "Comprehensive liability assessment covering:\n- Traffic violation analysis\n- Road conditions assessment\n- Vehicle defect considerations\n- Witness credibility evaluation\n- Expert testimony needs"
    },
    {
      id: 'pb-3',
      type: 'workflow',
      title: "Medical Records Review",
      description: "Comprehensive analysis of medical documentation and treatment history to support personal injury claims.",
      createdBy: "Supio",
      dateCreated: "June 20, 2025",
      tags: ["Medical", "Analysis", "Documentation"],
      dataRequired: ["Medical records", "Test results", "Treatment notes"],
      content: "Detailed medical record review including:\n- Treatment timeline construction\n- Medical necessity verification\n- Injury causation analysis\n- Future treatment needs assessment\n- Medical cost projections"
    },
    // Prompts
    {
      id: 'pr-1',
      type: 'prompt',
      title: "MVA Interrogatories",
      description: "Draft comprehensive interrogatories for motor vehicle accident cases to gather essential information from opposing parties.",
      createdBy: "Supio",
      dateCreated: "June 28, 2025",
      tags: ["Drafting", "MVA", "Discovery"],
      content: "Create standard interrogatories covering:\n- Driver information and licensing\n- Vehicle condition and maintenance\n- Insurance coverage details\n- Accident circumstances\n- Damages and medical treatment"
    },
    {
      id: 'pr-2',
      type: 'prompt',
      title: "Request for Production",
      description: "Generate document requests for personal injury cases to obtain relevant evidence and records.",
      createdBy: "Supio",
      dateCreated: "June 22, 2025",
      tags: ["Discovery", "Documentation", "Drafting"],
      content: "Standard document requests for:\n- Insurance policies and correspondence\n- Medical records and bills\n- Employment and wage records\n- Vehicle maintenance records\n- Expert reports and photographs"
    },
    {
      id: 'pr-3',
      type: 'prompt',
      title: "Deposition Outline Generator",
      description: "Create structured deposition outlines tailored to witness type and case specifics for effective questioning.",
      createdBy: "Supio",
      dateCreated: "June 15, 2025",
      tags: ["Deposition", "Outline", "Drafting"],
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
    if (show && filteredItems.length > 0 && !selectedItem) {
      setSelectedItem(filteredItems[0]);
    }
  }, [show, filteredItems, selectedItem]);

  // Reset selection when modal closes
  useEffect(() => {
    if (!show) {
      setSelectedItem(null);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl mx-4 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Library</h3>
          </div>
          <button
            onClick={onClose}
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
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {selectedItem.type === 'workflow' && selectedItem.dataRequired && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Data Required</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedItem.dataRequired.map((req, index) => (
                          <li key={index} className="text-sm text-gray-600">{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedItem.type === 'workflow' ? 'Process Overview' : 'Content'}
                    </h3>
                    <div className="bg-gray-50 rounded-md p-4">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                        {selectedItem.content}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select an item to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;