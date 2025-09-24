import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, Upload, ChevronDown, FileText, ArrowUpDown } from 'lucide-react';

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

interface Blueprint {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  dateCreated: string;
}

interface UnifiedLibraryModalProps {
  show: boolean;
  onClose: () => void;
  onSelectBlueprint?: (blueprintId: string) => void;
  onSelectReferenceDocument?: (file: File, documentType?: string, additionalInstructions?: string) => void;
  savedBlueprints?: Array<{id: string; title: string; description: string; referenceFile: string; documentType?: string; additionalInstructions?: string}>;
  onSaveReferenceAsBlueprint?: (title: string, description: string, referenceFile: string, documentType?: string, additionalInstructions?: string) => void;
  defaultTab?: 'library' | 'draft';
  promptsOnly?: boolean;
  selectedBlueprintId?: string;
  defaultDocumentView?: 'blueprint' | 'example';
}

const UnifiedLibraryModal: React.FC<UnifiedLibraryModalProps> = ({
  show,
  onClose,
  onSelectBlueprint,
  onSelectReferenceDocument,
  savedBlueprints = [],
  onSaveReferenceAsBlueprint,
  defaultTab = 'library',
  promptsOnly = false,
  selectedBlueprintId,
  defaultDocumentView = 'blueprint'
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'draft'>(defaultTab);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [selectedBlueprint, setSelectedBlueprint] = useState<any>(null);
  const [blueprintAdditionalInstructions, setBlueprintAdditionalInstructions] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Blueprint filtering state
  const [blueprintSearchQuery, setBlueprintSearchQuery] = useState('');
  const [showStarredBlueprints, setShowStarredBlueprints] = useState(true);
  const [showAllBlueprints, setShowAllBlueprints] = useState(true);

  // Starred blueprints state
  const [starredBlueprints, setStarredBlueprints] = useState<Set<string>>(() => {
    const stored = sessionStorage.getItem('starredBlueprints');
    return new Set(stored ? JSON.parse(stored) : []);
  });

  // Document drafting view state
  const [documentView, setDocumentView] = useState<'blueprint' | 'example'>(defaultDocumentView);

  // Source selection state - independent for each context
  const [blueprintSelectedSources, setBlueprintSelectedSources] = useState<Set<string>>(new Set());
  const [exampleSelectedSources, setExampleSelectedSources] = useState<Set<string>>(new Set());

  // Source selector UI state
  const [blueprintSourcesExpanded, setBlueprintSourcesExpanded] = useState(false);
  const [exampleSourcesExpanded, setExampleSourcesExpanded] = useState(false);
  const [blueprintSourceSearch, setBlueprintSourceSearch] = useState('');
  const [exampleSourceSearch, setExampleSourceSearch] = useState('');
  const [blueprintViewMode, setBlueprintViewMode] = useState<'category' | 'list'>('category');
  const [exampleViewMode, setExampleViewMode] = useState<'category' | 'list'>('category');
  const [blueprintExpandedCategories, setBlueprintExpandedCategories] = useState<Set<string>>(new Set());
  const [exampleExpandedCategories, setExampleExpandedCategories] = useState<Set<string>>(new Set());
  const [blueprintSortOrder, setBlueprintSortOrder] = useState<'name' | 'date'>('name');
  const [exampleSortOrder, setExampleSortOrder] = useState<'name' | 'date'>('name');
  const [blueprintSortDirection, setBlueprintSortDirection] = useState<'asc' | 'desc'>('asc');
  const [exampleSortDirection, setExampleSortDirection] = useState<'asc' | 'desc'>('asc');

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
        name: "lost_wages_documentation.xlsx",
        description: "Employment records and pay stubs showing Garcia's income loss during recovery period from injuries",
        size: "203 KB",
        pages: "8 pages",
        dateUploaded: "2024-03-10"
      },
      {
        id: "fin2",
        name: "medical_expenses_summary.xlsx",
        description: "Itemized medical bills and insurance claims for treatment related to accident injuries",
        size: "445 KB",
        pages: "15 pages",
        dateUploaded: "2024-03-18"
      }
    ]
  };

  // Library items (workflows and prompts)
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

  // Blueprints for drafting
  const blueprints: Blueprint[] = [
    {
      id: 'complaint',
      title: 'Complaint',
      description: 'Draft a legal complaint for civil litigation',
      createdBy: 'Supio',
      dateCreated: 'June 30, 2025'
    },
    {
      id: 'motion-summary-judgment',
      title: 'Motion for Summary Judgment',
      description: 'Draft a motion for summary judgment',
      createdBy: 'Supio',
      dateCreated: 'June 25, 2025'
    },
    {
      id: 'expert-disclosure',
      title: 'Expert Disclosure',
      description: 'Draft an expert witness disclosure',
      createdBy: 'Supio',
      dateCreated: 'June 20, 2025'
    },
    {
      id: 'mediation-brief',
      title: 'Mediation Brief',
      description: 'Draft a brief for mediation proceedings',
      createdBy: 'Supio',
      dateCreated: 'June 15, 2025'
    },
    {
      id: 'medical-summary',
      title: 'Medical Summary',
      description: 'Draft a medical summary report',
      createdBy: 'Supio',
      dateCreated: 'June 10, 2025'
    }
  ];

  // Prompts & Workflows filtering state
  const [itemViewMode, setItemViewMode] = useState<'starred' | 'all' | 'both'>('both');
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['prompt', 'workflow']));
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Blueprint filtering state
  const [blueprintFilterMode, setBlueprintFilterMode] = useState<'starred' | 'all' | 'both'>('both');

  // Starred items state
  const [starredItems, setStarredItems] = useState<Set<string>>(new Set());

  // Refs for dropdown
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  // Helper functions for source management
  const toggleBlueprintSource = (sourceId: string) => {
    setBlueprintSelectedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sourceId)) {
        newSet.delete(sourceId);
      } else {
        newSet.add(sourceId);
      }
      return newSet;
    });
  };

  const toggleExampleSource = (sourceId: string) => {
    setExampleSelectedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sourceId)) {
        newSet.delete(sourceId);
      } else {
        newSet.add(sourceId);
      }
      return newSet;
    });
  };

  // Initialize all sources as selected when modal opens
  useEffect(() => {
    if (show) {
      const allDocIds = Object.values(documentData).flat().map(doc => doc.id);
      setBlueprintSelectedSources(new Set(allDocIds));
      setExampleSelectedSources(new Set(allDocIds));
    }
  }, [show]);

  // Helper function to get total document count
  const getTotalDocCount = () => Object.values(documentData).flat().length;

  // Helper function to get filtered documents for source selector
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

  // Helper function to toggle category expansion
  const toggleCategoryExpansion = (context: 'blueprint' | 'example', category: string) => {
    if (context === 'blueprint') {
      setBlueprintExpandedCategories(prev => {
        const newSet = new Set(prev);
        if (newSet.has(category)) {
          newSet.delete(category);
        } else {
          newSet.add(category);
        }
        return newSet;
      });
    } else {
      setExampleExpandedCategories(prev => {
        const newSet = new Set(prev);
        if (newSet.has(category)) {
          newSet.delete(category);
        } else {
          newSet.add(category);
        }
        return newSet;
      });
    }
  };

  // Helper function to expand/collapse all categories
  const toggleAllCategories = (context: 'blueprint' | 'example', expand: boolean) => {
    const allCategories = Object.keys(documentData);
    if (context === 'blueprint') {
      setBlueprintExpandedCategories(expand ? new Set(allCategories) : new Set());
    } else {
      setExampleExpandedCategories(expand ? new Set(allCategories) : new Set());
    }
  };

  // Helper function to sort documents
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

  // Helper function to select/deselect all sources
  const handleSelectAllSources = (context: 'blueprint' | 'example', selectAll: boolean) => {
    const allDocIds = Object.values(documentData).flat().map(doc => doc.id);
    if (context === 'blueprint') {
      setBlueprintSelectedSources(selectAll ? new Set(allDocIds) : new Set());
    } else {
      setExampleSelectedSources(selectAll ? new Set(allDocIds) : new Set());
    }
  };

  // Helper function to select all in category
  const handleSelectCategory = (context: 'blueprint' | 'example', category: string, selectAll: boolean) => {
    const categoryDocs = documentData[category as keyof typeof documentData] || [];
    const categoryIds = categoryDocs.map(doc => doc.id);

    if (context === 'blueprint') {
      setBlueprintSelectedSources(prev => {
        const newSet = new Set(prev);
        if (selectAll) {
          categoryIds.forEach(id => newSet.add(id));
        } else {
          categoryIds.forEach(id => newSet.delete(id));
        }
        return newSet;
      });
    } else {
      setExampleSelectedSources(prev => {
        const newSet = new Set(prev);
        if (selectAll) {
          categoryIds.forEach(id => newSet.add(id));
        } else {
          categoryIds.forEach(id => newSet.delete(id));
        }
        return newSet;
      });
    }
  };

  // Filter library items for starred and all sections
  const filteredStarredItems = libraryItems.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = promptsOnly ? item.type === 'prompt' : selectedTypes.has(item.type);
    return matchesSearch && matchesType && starredItems.has(item.id) && (itemViewMode === 'starred' || itemViewMode === 'both');
  });

  const filteredAllItems = libraryItems.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = promptsOnly ? item.type === 'prompt' : selectedTypes.has(item.type);
    return matchesSearch && matchesType && !starredItems.has(item.id) && (itemViewMode === 'all' || itemViewMode === 'both');
  });

  // Combine all blueprints (saved + standard)
  const allBlueprints = [
    ...savedBlueprints.map(bp => ({ ...bp, source: 'saved' as const })),
    ...blueprints.map(bp => ({ ...bp, source: 'standard' as const }))
  ];

  // Filter blueprints based on search and create starred/non-starred groups
  const filteredStarredBlueprints = allBlueprints.filter(blueprint => {
    const matchesSearch = blueprintSearchQuery === '' ||
      blueprint.title.toLowerCase().includes(blueprintSearchQuery.toLowerCase()) ||
      blueprint.description.toLowerCase().includes(blueprintSearchQuery.toLowerCase());
    return matchesSearch && starredBlueprints.has(blueprint.id) && (blueprintFilterMode === 'starred' || blueprintFilterMode === 'both');
  });

  const filteredAllBlueprints = allBlueprints.filter(blueprint => {
    const matchesSearch = blueprintSearchQuery === '' ||
      blueprint.title.toLowerCase().includes(blueprintSearchQuery.toLowerCase()) ||
      blueprint.description.toLowerCase().includes(blueprintSearchQuery.toLowerCase());
    return matchesSearch && !starredBlueprints.has(blueprint.id) && (blueprintFilterMode === 'all' || blueprintFilterMode === 'both');
  });

  // Auto-select first item when modal opens or filter changes
  useEffect(() => {
    if (show && activeTab === 'library' && !selectedItem) {
      const firstItem = filteredStarredItems[0] || filteredAllItems[0];
      if (firstItem) {
        setSelectedItem(firstItem);
      }
    }
  }, [show, activeTab, filteredStarredItems, filteredAllItems, selectedItem]);

  // Reset selection when modal closes or tab changes
  useEffect(() => {
    if (!show || activeTab !== 'library') {
      setSelectedItem(null);
    }
  }, [show, activeTab]);

  // Update activeTab when defaultTab changes or modal shows
  useEffect(() => {
    if (show) {
      setActiveTab(defaultTab);
    }
  }, [show, defaultTab]);

  // Set documentView based on defaultDocumentView when modal opens
  useEffect(() => {
    if (show) {
      setDocumentView(defaultDocumentView);
      // Refresh starred blueprints from sessionStorage when modal opens
      const stored = sessionStorage.getItem('starredBlueprints');
      if (stored) {
        setStarredBlueprints(new Set(JSON.parse(stored)));
      }
    }
  }, [show, defaultDocumentView]);

  // Refresh starred blueprints when savedBlueprints changes (new blueprint saved)
  useEffect(() => {
    const stored = sessionStorage.getItem('starredBlueprints');
    if (stored) {
      setStarredBlueprints(new Set(JSON.parse(stored)));
    }
  }, [savedBlueprints]);

  // Auto-select first blueprint when entering Documents tab
  useEffect(() => {
    if (show && activeTab === 'draft' && !selectedBlueprint) {
      const firstBlueprint = filteredStarredBlueprints[0] || filteredAllBlueprints[0];
      if (firstBlueprint) {
        setSelectedBlueprint(firstBlueprint);
      }
    }
  }, [show, activeTab, filteredStarredBlueprints, filteredAllBlueprints, selectedBlueprint]);

  // Auto-select specific blueprint when selectedBlueprintId is provided (only on modal open)
  useEffect(() => {
    if (show && selectedBlueprintId && activeTab === 'draft' && !selectedBlueprint) {
      const targetBlueprint = allBlueprints.find(bp => bp.id === selectedBlueprintId);
      if (targetBlueprint) {
        setSelectedBlueprint(targetBlueprint);
      }
    }
  }, [show, selectedBlueprintId, activeTab, allBlueprints, selectedBlueprint]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (show) {
      // Store original overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [show]);

  // Reset blueprint selection when modal closes or tab changes
  useEffect(() => {
    if (!show || activeTab !== 'draft') {
      setSelectedBlueprint(null);
      setBlueprintAdditionalInstructions('');
    }
  }, [show, activeTab]);

  // Handle blueprint card selection (for showing in detail pane)
  const handleBlueprintCardSelect = (blueprint: any) => {
    setSelectedBlueprint(blueprint);
  };

  // Handle blueprint execution (Draft button in detail pane)
  const handleBlueprintSelect = (blueprintId: string) => {
    if (!onSelectBlueprint) return;

    // Include selected sources in the blueprint execution
    const selectedSourcesList = Array.from(blueprintSelectedSources).map(sourceId => {
      const doc = Object.values(documentData).flat().find(d => d.id === sourceId);
      return doc ? { id: doc.id, name: doc.name, type: doc.description.includes('Medical') ? 'medical' : 'general' } : null;
    }).filter(Boolean);

    // TODO: Modify onSelectBlueprint to accept selected sources as second parameter
    // For now, we'll store it in sessionStorage as a temporary solution
    sessionStorage.setItem(`blueprint_${blueprintId}_sources`, JSON.stringify({
      sources: selectedSourcesList,
      sourceCount: blueprintSelectedSources.size,
      totalAvailable: getTotalDocCount(),
      selectedAt: new Date().toISOString()
    }));

    onSelectBlueprint(blueprintId);
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDraftFromReference = () => {
    if (uploadedFile && onSelectReferenceDocument) {
      // Include selected sources in the reference document execution
      const selectedSourcesList = Array.from(exampleSelectedSources).map(sourceId => {
        const doc = Object.values(documentData).flat().find(d => d.id === sourceId);
        return doc ? { id: doc.id, name: doc.name, type: doc.description.includes('Medical') ? 'medical' : 'general' } : null;
      }).filter(Boolean);

      // TODO: Modify onSelectReferenceDocument to accept selected sources as fourth parameter
      // For now, we'll store it in sessionStorage as a temporary solution
      sessionStorage.setItem(`reference_${uploadedFile.name}_sources`, JSON.stringify({
        sources: selectedSourcesList,
        sourceCount: exampleSelectedSources.size,
        totalAvailable: getTotalDocCount(),
        selectedAt: new Date().toISOString()
      }));

      onSelectReferenceDocument(uploadedFile, documentType.trim() || undefined, additionalInstructions.trim() || undefined);
      onClose();
    }
  };

  // Toggle star status for a blueprint
  const toggleStar = (blueprintId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent blueprint selection when clicking star
    setStarredBlueprints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blueprintId)) {
        newSet.delete(blueprintId);
      } else {
        newSet.add(blueprintId);
      }
      // Persist to sessionStorage
      sessionStorage.setItem('starredBlueprints', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  // Toggle star status for library items (prompts & workflows)
  const toggleItemStar = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent item selection when clicking star
    setStarredItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Handle type selection in dropdown
  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModalClose = () => {
    setSelectedItem(null);
    setDocumentType('');
    setAdditionalInstructions('');
    setUploadedFile(null);
    setBlueprintSearchQuery('');
    setShowStarredBlueprints(true);
    setShowAllBlueprints(true);
    setDocumentView('blueprint');
    onClose();
  };

  // Clear uploaded file when modal is closed from outside
  useEffect(() => {
    if (!show) {
      setUploadedFile(null);
      setDocumentType('');
      setAdditionalInstructions('');
      setDocumentView('blueprint');
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[95vw] mx-4 h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">{promptsOnly ? 'Prompt Library' : 'Library'}</h3>
          </div>
          <button
            onClick={handleModalClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Navigation - hide Documents tab in prompts-only mode */}
        {!promptsOnly && (
          <div className="border-b border-gray-200 flex-shrink-0">
            <div className="flex">
              <button
                onClick={() => setActiveTab('library')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'library'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Prompts & Workflows
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'draft'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Documents
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {(activeTab === 'library' || promptsOnly) ? (
            <>
              <div className="flex flex-1 min-h-0" style={{ height: 'calc(100vh - 200px)' }}>
                {/* Left Panel - Item List */}
                <div className="w-[40%] border-r border-gray-200 flex flex-col">
                  <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                    {/* Search and Filter */}
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Search prompts & workflows..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">Show:</span>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="itemViewMode"
                              checked={itemViewMode === 'both'}
                              onChange={() => setItemViewMode('both')}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">All</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="itemViewMode"
                              checked={itemViewMode === 'starred'}
                              onChange={() => setItemViewMode('starred')}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Starred</span>
                          </label>
                        </div>
                        {!promptsOnly && (
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">Types:</span>
                            <div className="relative" ref={typeDropdownRef}>
                              <button
                                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <span className="mr-2">
                                  {selectedTypes.size === 0 ? 'None selected' :
                                   selectedTypes.size === 2 ? 'All types' :
                                   selectedTypes.has('prompt') ? 'Prompts' : 'Workflows'}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              </button>
                              {showTypeDropdown && (
                                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                  <div className="py-1">
                                    <label className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={selectedTypes.has('prompt')}
                                        onChange={() => toggleType('prompt')}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700">Prompts</span>
                                    </label>
                                    <label className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={selectedTypes.has('workflow')}
                                        onChange={() => toggleType('workflow')}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700">Workflows</span>
                                    </label>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Scrollable Content Area */}
                    <div
                      className="flex-1 overflow-y-auto space-y-4"
                      style={{
                        maxHeight: 'calc(100vh - 400px)', // More conservative height calculation
                        overscrollBehavior: 'contain'
                      }}
                    >
                      {/* Starred Items */}
                      {filteredStarredItems.length > 0 && (
                      <>
                        <h5 className="text-lg font-bold text-gray-900 mb-4">Starred</h5>
                        {filteredStarredItems.map((item) => (
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
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => toggleItemStar(item.id, e)}
                                  className="p-1 text-yellow-500 hover:text-yellow-600 transition-colors"
                                  title="Unstar item"
                                >
                                  ★
                                </button>
                                <button className={`px-3 py-1 text-white rounded text-sm hover:opacity-90 ${
                                  item.type === 'workflow' ? 'bg-purple-600' : 'bg-blue-600'
                                }`}>
                                  {item.type === 'workflow' ? 'Run' : 'Use'}
                                </button>
                              </div>
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
                        {filteredAllItems.length > 0 && (
                          <div className="mt-6 mb-4"></div>
                        )}
                      </>
                    )}

                    {/* All Items */}
                    {filteredAllItems.length > 0 && (
                      <>
                        <h5 className="text-lg font-bold text-gray-900 mb-4">All Items</h5>
                        {filteredAllItems.map((item) => (
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
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => toggleItemStar(item.id, e)}
                                  className={`p-1 transition-colors ${
                                    starredItems.has(item.id)
                                      ? 'text-yellow-500 hover:text-yellow-600'
                                      : 'text-gray-300 hover:text-yellow-400'
                                  }`}
                                  title={starredItems.has(item.id) ? 'Unstar item' : 'Star item'}
                                >
                                  {starredItems.has(item.id) ? '★' : '☆'}
                                </button>
                                <button className={`px-3 py-1 text-white rounded text-sm hover:opacity-90 ${
                                  item.type === 'workflow' ? 'bg-purple-600' : 'bg-blue-600'
                                }`}>
                                  {item.type === 'workflow' ? 'Run' : 'Use'}
                                </button>
                              </div>
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
                      </>
                    )}

                    {/* No Results Message */}
                    {filteredStarredItems.length === 0 && filteredAllItems.length === 0 && (
                        <div className="text-center py-8 text-gray-500 mb-6">
                          <p>No items found matching your search criteria.</p>
                        </div>
                      )}

                    {/* Bottom spacer to ensure whitespace even when not scrolling */}
                    {(filteredStarredItems.length > 0 || filteredAllItems.length > 0) && (
                      <div className="h-6" />
                    )}
                    </div>
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
            </>
          ) : (
            // Documents Tab Content with List-Detail Layout
            <>
              {documentView === 'blueprint' ? (
                // Blueprint List-Detail Layout
                <div className="flex flex-1 min-h-0" style={{ height: 'calc(100vh - 200px)' }}>
                  {/* Left Panel - Blueprint List */}
                  <div className="w-[40%] border-r border-gray-200 flex flex-col">
                    <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                      {/* Header and Toggle */}
                      <div className="flex items-center space-x-6">
                        <h4 className="text-lg font-semibold text-gray-900">Use Existing Blueprint</h4>
                        <button
                          onClick={() => setDocumentView('example')}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                        >
                          or draft from a new example document
                          <span className="ml-1">→</span>
                        </button>
                      </div>

                      {/* Search and Filter */}
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Search blueprints..."
                          value={blueprintSearchQuery}
                          onChange={(e) => setBlueprintSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">Show:</span>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="blueprintFilterMode"
                              checked={blueprintFilterMode === 'both'}
                              onChange={() => setBlueprintFilterMode('both')}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">All</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="blueprintFilterMode"
                              checked={blueprintFilterMode === 'starred'}
                              onChange={() => setBlueprintFilterMode('starred')}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Starred</span>
                          </label>
                        </div>
                      </div>

                      {/* Scrollable Content Area */}
                      <div
                        className="flex-1 overflow-y-auto space-y-4"
                        style={{
                          maxHeight: 'calc(100vh - 400px)', // More conservative height calculation
                          overscrollBehavior: 'contain'
                        }}
                      >
                        {/* Starred Blueprints */}
                        {filteredStarredBlueprints.length > 0 && (
                        <>
                          <h5 className="text-lg font-bold text-gray-900 mb-4">Starred</h5>
                          {filteredStarredBlueprints.map((blueprint) => (
                            <div
                              key={blueprint.id}
                              onClick={() => handleBlueprintCardSelect(blueprint)}
                              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                selectedBlueprint?.id === blueprint.id
                                  ? 'border-blue-300 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    <h3 className="font-medium text-gray-900">{blueprint.title}</h3>
                                    {blueprint.source === 'saved' && (
                                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        Yours
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2">{blueprint.description}</p>
                                </div>
                                <button
                                  onClick={(e) => toggleStar(blueprint.id, e)}
                                  className="p-1 text-yellow-500 hover:text-yellow-600 transition-colors"
                                  title="Unstar blueprint"
                                >
                                  ★
                                </button>
                              </div>
                              <div className="text-xs text-gray-500">
                                Created by: {blueprint.source === 'saved' ? 'You' : blueprint.createdBy} • {blueprint.source === 'saved' ? 'Recently' : blueprint.dateCreated}
                              </div>
                            </div>
                          ))}
                          {filteredAllBlueprints.length > 0 && (
                            <div className="mt-6 mb-4"></div>
                          )}
                        </>
                      )}

                      {/* All Blueprints */}
                      {filteredAllBlueprints.length > 0 && (
                        <>
                          <h5 className="text-lg font-bold text-gray-900 mb-4">All Blueprints</h5>
                          {filteredAllBlueprints.map((blueprint) => (
                            <div
                              key={blueprint.id}
                              onClick={() => handleBlueprintCardSelect(blueprint)}
                              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                selectedBlueprint?.id === blueprint.id
                                  ? 'border-blue-300 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    <h3 className="font-medium text-gray-900">{blueprint.title}</h3>
                                    {blueprint.source === 'saved' && (
                                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        Yours
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2">{blueprint.description}</p>
                                </div>
                                <button
                                  onClick={(e) => toggleStar(blueprint.id, e)}
                                  className={`p-1 transition-colors ${
                                    starredBlueprints.has(blueprint.id)
                                      ? 'text-yellow-500 hover:text-yellow-600'
                                      : 'text-gray-300 hover:text-yellow-400'
                                  }`}
                                  title={starredBlueprints.has(blueprint.id) ? 'Unstar blueprint' : 'Star blueprint'}
                                >
                                  {starredBlueprints.has(blueprint.id) ? '★' : '☆'}
                                </button>
                              </div>
                              <div className="text-xs text-gray-500">
                                Created by: {blueprint.source === 'saved' ? 'You' : blueprint.createdBy} • {blueprint.source === 'saved' ? 'Recently' : blueprint.dateCreated}
                              </div>
                            </div>
                          ))}
                        </>
                      )}

                      {/* No Results Message */}
                      {filteredStarredBlueprints.length === 0 && filteredAllBlueprints.length === 0 && (
                          <div className="text-center py-8 text-gray-500 mb-6">
                            <p>No blueprints found matching your search criteria.</p>
                          </div>
                        )}

                      {/* Bottom spacer to ensure whitespace even when not scrolling */}
                      {(filteredStarredBlueprints.length > 0 || filteredAllBlueprints.length > 0) && (
                        <div className="h-6" />
                      )}
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Blueprint Details */}
                  <div className="flex-1 overflow-auto">
                    {selectedBlueprint ? (
                      <div className="p-6">
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <h2 className="text-xl font-semibold text-gray-900 mr-3">{selectedBlueprint.title}</h2>
                              {selectedBlueprint.source === 'saved' && (
                                <span className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                  Yours
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleBlueprintSelect(selectedBlueprint.id)}
                              className="px-4 py-2 text-white rounded-md hover:opacity-90 bg-blue-600"
                            >
                              Draft Document
                            </button>
                          </div>

                          <p className="text-gray-600 mb-4">{selectedBlueprint.description}</p>

                          <div className="text-sm text-gray-500 mb-6">
                            Created by: {selectedBlueprint.source === 'saved' ? 'You' : selectedBlueprint.createdBy} • Date: {selectedBlueprint.source === 'saved' ? 'Recently' : selectedBlueprint.dateCreated}
                          </div>

                          {/* New Compact Source Selection */}
                          <div className="mb-6">
                            <div className="border border-gray-200 rounded-lg">
                              {/* Collapsed Header */}
                              <div
                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                                onClick={() => setBlueprintSourcesExpanded(!blueprintSourcesExpanded)}
                              >
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium text-gray-900">Case Data Sources</span>
                                  <span className="text-sm text-gray-500">
                                    ({blueprintSelectedSources.size} of {getTotalDocCount()} selected)
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectAllSources('blueprint', blueprintSelectedSources.size < getTotalDocCount());
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    {blueprintSelectedSources.size < getTotalDocCount() ? 'Select All' : 'Clear All'}
                                  </button>
                                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${blueprintSourcesExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </div>

                              {/* Expanded Content */}
                              {blueprintSourcesExpanded && (
                                <div className="border-t border-gray-200 p-3 space-y-3">
                                  {/* Search and View Controls */}
                                  <div className="flex items-center justify-between">
                                    <input
                                      type="text"
                                      placeholder="Search sources..."
                                      value={blueprintSourceSearch}
                                      onChange={(e) => setBlueprintSourceSearch(e.target.value)}
                                      className="w-3/5 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <div className="flex items-center space-x-2">
                                      {blueprintViewMode === 'category' ? (
                                        <button
                                          onClick={() => toggleAllCategories('blueprint', blueprintExpandedCategories.size < Object.keys(documentData).length)}
                                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                          {blueprintExpandedCategories.size < Object.keys(documentData).length ? 'Expand All' : 'Collapse All'}
                                        </button>
                                      ) : (
                                        <>
                                          <select
                                            value={blueprintSortOrder}
                                            onChange={(e) => setBlueprintSortOrder(e.target.value as 'name' | 'date')}
                                            className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                          >
                                            <option value="name">Sort by Name</option>
                                            <option value="date">Sort by Date Uploaded</option>
                                          </select>
                                          <button
                                            onClick={() => setBlueprintSortDirection(blueprintSortDirection === 'asc' ? 'desc' : 'asc')}
                                            className="p-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                                            title={`Sort ${blueprintSortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                                          >
                                            <ArrowUpDown className="h-3 w-3" />
                                          </button>
                                        </>
                                      )}
                                      <div className="flex bg-gray-100 rounded-md p-1">
                                        <button
                                          onClick={() => setBlueprintViewMode('category')}
                                          className={`px-2 py-1 text-xs font-medium rounded ${
                                            blueprintViewMode === 'category' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                          }`}
                                        >
                                          Category
                                        </button>
                                        <button
                                          onClick={() => setBlueprintViewMode('list')}
                                          className={`px-2 py-1 text-xs font-medium rounded ${
                                            blueprintViewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                          }`}
                                        >
                                          List
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* File List */}
                                  <div className="space-y-2 max-h-80 overflow-y-auto">
                                    {blueprintViewMode === 'list' ? (
                                      // List View - Flat list of all files
                                      <div className="space-y-1">
                                        {sortDocuments(Object.values(getFilteredSources(blueprintSourceSearch)).flat(), blueprintSortOrder, blueprintSortDirection).map(doc => (
                                          <div key={doc.id} className="flex items-start space-x-3 py-2 px-3 hover:bg-blue-50 rounded border border-gray-100">
                                            <input
                                              type="checkbox"
                                              checked={blueprintSelectedSources.has(doc.id)}
                                              onChange={() => toggleBlueprintSource(doc.id)}
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
                                        {Object.entries(getFilteredSources(blueprintSourceSearch)).map(([category, documents]) => {
                                          const selectedInCategory = documents.filter(doc => blueprintSelectedSources.has(doc.id)).length;
                                          const isPartiallySelected = selectedInCategory > 0 && selectedInCategory < documents.length;
                                          const isAllSelected = selectedInCategory === documents.length;
                                          const isCategoryExpanded = blueprintExpandedCategories.has(category);

                                          return (
                                            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                                              {/* Enhanced Category Header */}
                                              <div
                                                className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 cursor-pointer border-b border-gray-200"
                                                onClick={() => toggleCategoryExpansion('blueprint', category)}
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
                                                      handleSelectCategory('blueprint', category, e.target.checked);
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
                                                        checked={blueprintSelectedSources.has(doc.id)}
                                                        onChange={() => toggleBlueprintSource(doc.id)}
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
                              )}
                            </div>
                          </div>

                          {selectedBlueprint.source === 'saved' && selectedBlueprint.referenceFile && (
                            <div className="mb-6">
                              <h3 className="text-lg font-medium text-gray-900 mb-2">Based On</h3>
                              <div className="bg-gray-50 rounded-md p-3">
                                <span className="text-sm text-gray-700">{selectedBlueprint.referenceFile}</span>
                              </div>
                            </div>
                          )}

                          {selectedBlueprint.source === 'saved' && (selectedBlueprint.documentType || selectedBlueprint.additionalInstructions) && (
                            <div className="mb-6">
                              <h3 className="text-lg font-medium text-gray-900 mb-2">Original Parameters</h3>
                              <div className="bg-gray-50 rounded-md p-3 space-y-2">
                                {selectedBlueprint.documentType && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-700">Document Type: </span>
                                    <span className="text-sm text-gray-600">{selectedBlueprint.documentType}</span>
                                  </div>
                                )}
                                {selectedBlueprint.additionalInstructions && (
                                  <div>
                                    <span className="text-sm font-medium text-gray-700">Additional Instructions: </span>
                                    <span className="text-sm text-gray-600">{selectedBlueprint.additionalInstructions}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="mb-6">
                            <label htmlFor="blueprint-additional-instructions" className="block text-sm font-medium text-gray-700 mb-2">
                              Additional Instructions (Optional)
                            </label>
                            <textarea
                              id="blueprint-additional-instructions"
                              value={blueprintAdditionalInstructions}
                              onChange={(e) => setBlueprintAdditionalInstructions(e.target.value)}
                              placeholder="Add any specific instructions for this document..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Select a blueprint to view details</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Draft from Example View
                <div className="p-6 overflow-y-auto h-full">
                  <div className="max-w-2xl mx-auto">
                    {/* Header and Toggle */}
                    <div className="mb-6 flex items-center space-x-6">
                      <h4 className="text-lg font-semibold text-gray-900">Draft from Example</h4>
                      <button
                        onClick={() => setDocumentView('blueprint')}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                      >
                        or use an existing blueprint
                        <span className="ml-1">→</span>
                      </button>
                    </div>

                    <p className="text-gray-600 mb-6">Upload a document to use as a template:</p>

                    {!uploadedFile ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors mb-6">
                        <p className="text-gray-600 mb-6">Upload a document (docx, pdf, txt, xlsx)</p>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileUpload}
                          />
                          <span className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium">
                            <Upload className="h-5 w-5 mr-2" />
                            Upload File
                          </span>
                        </label>
                      </div>
                    ) : (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                                <p className="text-sm text-gray-600">
                                  {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setUploadedFile(null)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                              title="Remove file"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Optional Fields - Always Visible */}
                    <div className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="document-type" className="block text-sm font-medium text-gray-700 mb-2">
                          Document Type (Optional)
                        </label>
                        <input
                          type="text"
                          id="document-type"
                          value={documentType}
                          onChange={(e) => setDocumentType(e.target.value)}
                          placeholder="e.g. complaint, mediation brief, letter of representation"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="additional-instructions" className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Instructions (Optional)
                        </label>
                        <textarea
                          id="additional-instructions"
                          value={additionalInstructions}
                          onChange={(e) => setAdditionalInstructions(e.target.value)}
                          placeholder='e.g. "use gross negligence as the first count of the complaint"'
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>

                      {/* New Compact Source Selection */}
                      <div>
                        <div className="border border-gray-200 rounded-lg">
                          {/* Collapsed Header */}
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => setExampleSourcesExpanded(!exampleSourcesExpanded)}
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900">Case Data Sources</span>
                              <span className="text-sm text-gray-500">
                                ({exampleSelectedSources.size} of {getTotalDocCount()} selected)
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectAllSources('example', exampleSelectedSources.size < getTotalDocCount());
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                {exampleSelectedSources.size < getTotalDocCount() ? 'Select All' : 'Clear All'}
                              </button>
                              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${exampleSourcesExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {exampleSourcesExpanded && (
                            <div className="border-t border-gray-200 p-3 space-y-3">
                              {/* Search and View Controls */}
                              <div className="flex items-center justify-between">
                                <input
                                  type="text"
                                  placeholder="Search sources..."
                                  value={exampleSourceSearch}
                                  onChange={(e) => setExampleSourceSearch(e.target.value)}
                                  className="w-3/5 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="flex items-center space-x-2">
                                  {exampleViewMode === 'category' ? (
                                    <button
                                      onClick={() => toggleAllCategories('example', exampleExpandedCategories.size < Object.keys(documentData).length)}
                                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                      {exampleExpandedCategories.size < Object.keys(documentData).length ? 'Expand All' : 'Collapse All'}
                                    </button>
                                  ) : (
                                    <>
                                      <select
                                        value={exampleSortOrder}
                                        onChange={(e) => setExampleSortOrder(e.target.value as 'name' | 'date')}
                                        className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      >
                                        <option value="name">Sort by Name</option>
                                        <option value="date">Sort by Date Uploaded</option>
                                      </select>
                                      <button
                                        onClick={() => setExampleSortDirection(exampleSortDirection === 'asc' ? 'desc' : 'asc')}
                                        className="p-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                                        title={`Sort ${exampleSortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                                      >
                                        <ArrowUpDown className="h-3 w-3" />
                                      </button>
                                    </>
                                  )}
                                  <div className="flex bg-gray-100 rounded-md p-1">
                                    <button
                                      onClick={() => setExampleViewMode('category')}
                                      className={`px-2 py-1 text-xs font-medium rounded ${
                                        exampleViewMode === 'category' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                      }`}
                                    >
                                      Category
                                    </button>
                                    <button
                                      onClick={() => setExampleViewMode('list')}
                                      className={`px-2 py-1 text-xs font-medium rounded ${
                                        exampleViewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                      }`}
                                    >
                                      List
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* File List */}
                              <div className="space-y-2 max-h-80 overflow-y-auto">
                                {exampleViewMode === 'list' ? (
                                  // List View - Flat list of all files
                                  <div className="space-y-1">
                                    {sortDocuments(Object.values(getFilteredSources(exampleSourceSearch)).flat(), exampleSortOrder, exampleSortDirection).map(doc => (
                                      <div key={doc.id} className="flex items-start space-x-3 py-2 px-3 hover:bg-blue-50 rounded border border-gray-100">
                                        <input
                                          type="checkbox"
                                          checked={exampleSelectedSources.has(doc.id)}
                                          onChange={() => toggleExampleSource(doc.id)}
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
                                    {Object.entries(getFilteredSources(exampleSourceSearch)).map(([category, documents]) => {
                                      const selectedInCategory = documents.filter(doc => exampleSelectedSources.has(doc.id)).length;
                                      const isPartiallySelected = selectedInCategory > 0 && selectedInCategory < documents.length;
                                      const isAllSelected = selectedInCategory === documents.length;
                                      const isCategoryExpanded = exampleExpandedCategories.has(category);

                                      return (
                                        <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                                          {/* Enhanced Category Header */}
                                          <div
                                            className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 cursor-pointer border-b border-gray-200"
                                            onClick={() => toggleCategoryExpansion('example', category)}
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
                                                  handleSelectCategory('example', category, e.target.checked);
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
                                                    checked={exampleSelectedSources.has(doc.id)}
                                                    onChange={() => toggleExampleSource(doc.id)}
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
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Draft Button */}
                    <div className="mt-6">
                      <button
                        onClick={handleDraftFromReference}
                        disabled={!uploadedFile}
                        className={`w-full px-4 py-3 rounded-md font-medium transition-all ${
                          uploadedFile
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {uploadedFile ? 'Start Draft' : 'Upload File to Continue'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default UnifiedLibraryModal;