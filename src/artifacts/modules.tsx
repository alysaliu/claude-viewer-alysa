import React, { useState, useRef, useEffect } from 'react';
import { Home, BarChart2, Layers, PenTool, ChevronDown, MoreVertical, Bell, Briefcase, Activity, DollarSignIcon } from 'lucide-react';

interface MedicalRecord {
  id: number;
  date: string;
  injury: string;
  status: string;
  icdCode: string;
  narrative: string;
  anatomicalLocation: string;
  treatment: string;
  treatmentStatus: string;
  critical: string;
  diagnosis: string;
}

interface EditingCell {
  recordId: number | null;
  field: string | null;
}

interface ColumnWidths {
  checkbox: number;
  date: number;
  injury: number;
  status: number;
  icdCode: number;
  narrative: number;
  anatomicalLocation: number;
  treatmentStatus: number;
  critical: number;
  diagnosis: number;
  actions: number;
}

interface ResizeState {
  column: keyof ColumnWidths;
  startX: number;
  startWidth: number;
}

interface DamageRecord {
  id: number;
  facility: string;
  date: string;
  description: string;
  amount: number;
  source: string;
  history: string;
  status: string;
  expanded?: boolean;
}

const MedicalRecordsTable = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: 1,
      date: '02/15/24',
      injury: 'Acute right ankle pain',
      status: 'Needs Review',
      icdCode: 'M79.3',
      narrative: 'Following the motor vehicle accident on September 21, 2022, Mr. Eli Strauss experienced immediate onset of sharp pain in the right ankle. Mr. Strauss reported being the driver of a 2019 Honda Civic that was struck from behind while stopped at a red light on Main Street. Initial assessment at the emergency room revealed swelling and tenderness over the lateral malleolus.',
      anatomicalLocation: 'Lower extremities',
      treatment: 'Rest, ice, compression, and elevation for the first few days, followed by gradual weight-bearing. Physical therapy was initiated after one week to improve range of motion and strength. Patient was provided with an ankle brace for additional support during the healing process.',
      treatmentStatus: 'Expected to return to normal within 4-6 weeks with therapy. Patient has shown good compliance with treatment protocol and demonstrates steady improvement in mobility.',
      critical: 'Yes',
      diagnosis: 'Dr. Michael Rodriguez'
    },
    {
      id: 2,
      date: '02/20/24',
      injury: 'Chronic lower back pain',
      status: 'Verified',
      icdCode: 'M54.5',
      narrative: 'Mr. Eli Strauss developed chronic lower back pain approximately one week following the September 21, 2022 motor vehicle accident. Patient reports constant dull aching with intermittent sharp shooting pains down the left leg. Pain is worse in the morning and after prolonged sitting. Mr. Strauss describes difficulty sleeping due to discomfort and notes the pain interferes with his work as an accountant.',
      anatomicalLocation: 'Back',
      treatment: 'Initial treatment focused on conservative management including anti-inflammatory medications, heat therapy, and gentle stretching exercises. Patient was referred to orthopedic specialist for further evaluation and MRI imaging to rule out disc involvement.',
      treatmentStatus: 'Anticipated recovery with ongoing physical therapy and pain management. Patient may require additional interventions if conservative treatment fails to provide adequate relief.',
      critical: 'No',
      diagnosis: 'Dr. Michael Rodriguez'
    },
    {
      id: 3,
      date: '02/25/24',
      injury: 'Shoulder impingement syndrome',
      status: 'Needs Review',
      icdCode: 'M75.4',
      narrative: 'Mr. Eli Strauss reported progressive right shoulder pain and stiffness beginning approximately two weeks post-accident. Patient describes the pain as a deep aching sensation with sharp catches during overhead movements. Night pain is significant, interfering with sleep quality. Mr. Strauss notes the shoulder pain has worsened since the initial ankle injury, likely due to compensatory movements while using crutches.',
      anatomicalLocation: 'Upper extremities',
      treatment: 'Recommended intervention includes rotator cuff strengthening exercises, postural correction training, and activity modification. Patient was instructed in proper ergonomics and provided home exercise program targeting scapular stabilization.',
      treatmentStatus: 'Recovery is expected within 6-8 weeks with consistent adherence to exercise protocol. Patient shows good understanding of condition and demonstrates proper exercise technique.',
      critical: 'Yes',
      diagnosis: 'Dr. Michael Rodriguez'
    },
    {
      id: 4,
      date: '03/01/24',
      injury: 'Tennis elbow',
      status: 'Verified',
      icdCode: 'M77.0',
      narrative: 'Mr. Eli Strauss developed lateral elbow pain three weeks following the September 21, 2022 accident, likely related to compensatory movement patterns due to shoulder injury and prolonged crutch use. Patient reports pain with gripping activities and tenderness over the lateral epicondyle. The condition has impacted his ability to perform daily tasks and work-related computer use.',
      anatomicalLocation: 'Upper extremities',
      treatment: 'Treatment will consist of activity modification, eccentric strengthening exercises, and ergonomic assessment of work station. Patient was fitted with counterforce brace to reduce stress on the lateral epicondyle during daily activities.',
      treatmentStatus: 'Expected recovery within 4-6 weeks with proper adherence to treatment plan. Patient education provided regarding activity modification and proper lifting techniques.',
      critical: 'No',
      diagnosis: 'Dr. Jessica Chen'
    },
    {
      id: 5,
      date: '03/10/24',
      injury: 'Carpal tunnel syndrome',
      status: 'Needs Review',
      icdCode: 'G56.0',
      narrative: 'Mr. Eli Strauss presented with numbness and tingling in the thumb, index, and middle fingers of the right hand, developing approximately one month after the motor vehicle accident. Symptoms are worse at night and upon waking. Patient reports dropping objects and difficulty with fine motor tasks such as buttoning clothes. Mr. Strauss believes this condition is related to altered hand positioning while using crutches and compensatory gripping patterns.',
      anatomicalLocation: 'Upper extremities',
      treatment: 'Conservative management includes night splinting, nerve gliding exercises, and ergonomic modifications at workplace. Patient was educated on proper wrist positioning and activity pacing to prevent symptom exacerbation.',
      treatmentStatus: 'If symptoms persist or worsen despite conservative treatment, surgical consultation may be warranted. Patient will be monitored closely over the next 4-6 weeks for improvement.',
      critical: 'Yes',
      diagnosis: 'Dr. Emily Davis'
    }
  ]);

  const [damageRecords, setDamageRecords] = useState<DamageRecord[]>([
    // City General Hospital
    { id: 1, facility: 'City General Hospital', date: '01/10/2025', description: 'Emergency Room Visit', amount: 1250.00, source: 'Aff Bill - Dr. Smith (Orthop...', history: 'Last updated by Alysa Liu on...', status: 'Verified' },
    { id: 2, facility: 'City General Hospital', date: '01/11/2025', description: 'Emergency Room Visit', amount: 1250.00, source: 'Aff Bill - Dr. Smith (Orthop...', history: 'Last updated by Alysa Liu on...', status: 'Needs Review' },
    { id: 3, facility: 'City General Hospital', date: '01/12/2025', description: 'Emergency Room Visit', amount: 1250.00, source: 'Aff Bill - Dr. Smith (Orthop...', history: 'Last updated by Alysa Liu on...', status: 'Verified' },
    { id: 4, facility: 'City General Hospital', date: '01/13/2025', description: 'Emergency Room Visit', amount: 1250.00, source: 'Aff Bill - Dr. Smith (Orthop...', history: 'Last updated by Alysa Liu on...', status: 'Needs Review' },
    { id: 5, facility: 'City General Hospital', date: '01/14/2025', description: 'Emergency Room Visit', amount: 1250.00, source: 'Aff Bill - Dr. Smith (Orthop...', history: 'Last updated by Alysa Liu on...', status: 'Verified' },
    // Greenwood Medical Center
    { id: 6, facility: 'Greenwood Medical Center', date: '', description: '', amount: 800.00, source: '', history: 'Last updated by Supio Al on...', status: 'Needs Review' },
    // Lakeside Healthcare
    { id: 7, facility: 'Lakeside Healthcare', date: '', description: '', amount: 300.00, source: '', history: 'Last updated by Supio Al on...', status: 'Verified' },
    // Downtown Clinic
    { id: 8, facility: 'Downtown Clinic', date: '', description: '', amount: 150.00, source: '', history: 'Last updated by Supio Al on...', status: 'Needs Review' },
    // Eastside Health Center
    { id: 9, facility: 'Eastside Health Center', date: '', description: '', amount: 900.00, source: '', history: 'Last updated by Supio Al on...', status: 'Verified' },
    // Northview Medical
    { id: 10, facility: 'Northview Medical', date: '', description: '', amount: 450.00, source: '', history: 'Last updated by Supio Al on...', status: 'Needs Review' },
    // Westside Urgent Care
    { id: 11, facility: 'Westside Urgent Care', date: '', description: '', amount: 200.00, source: '', history: 'Last updated by Supio Al on...', status: 'Verified' }
  ]);

  const [originalRecords, setOriginalRecords] = useState<MedicalRecord[]>([...records]);
  const [editingCell, setEditingCell] = useState<EditingCell>({ recordId: null, field: null });
  const [editValue, setEditValue] = useState<string>('');
  const [currentView, setCurrentView] = useState<string>('table');
  const [currentPage, setCurrentPage] = useState<string>('injuries');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [activeFilters, setActiveFilters] = useState<Record<string, string | boolean>>({});
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>({
    checkbox: 32,
    date: 80,
    injury: 160,
    status: 96,
    icdCode: 96,
    narrative: 192,
    anatomicalLocation: 128,
    treatmentStatus: 192,
    critical: 64,
    diagnosis: 96,
    actions: 120
  });
  const [resizing, setResizing] = useState<ResizeState | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [activeNavItem, setActiveNavItem] = useState<string>('medicals');
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<Set<number>>(new Set());
  const [showBulkEdit, setShowBulkEdit] = useState<boolean>(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [expandedFacilities, setExpandedFacilities] = useState<Set<string>>(new Set(['City General Hospital']));
  const [hoveredDamageRow, setHoveredDamageRow] = useState<number | null>(null);
  const [editingDamageCell, setEditingDamageCell] = useState<{ recordId: number | null; field: string | null }>({ recordId: null, field: null });
  const [editDamageValue, setEditDamageValue] = useState<string>('');
  const [showDeleteDamageConfirm, setShowDeleteDamageConfirm] = useState<number | null>(null);
  const [selectedDamageRecord, setSelectedDamageRecord] = useState<DamageRecord | null>(null);
  const [damageDetailView, setDamageDetailView] = useState<string>('table');
  const [hoveredFacility, setHoveredFacility] = useState<string | null>(null);
  const [editingFacility, setEditingFacility] = useState<string | null>(null);
  const [editFacilityValue, setEditFacilityValue] = useState<string>('');
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (inputRef.current && editingCell.recordId) {
      inputRef.current.focus();
      if ('select' in inputRef.current && typeof inputRef.current.select === 'function') {
        inputRef.current.select();
      }
    }
  }, [editingCell]);

  const getModifiedRecords = () => {
    return records.filter((record, index) => 
      JSON.stringify(record) !== JSON.stringify(originalRecords[index])
    );
  };

  const isFieldModified = (recordId: number, field: keyof MedicalRecord) => {
    const currentRecord = records.find(r => r.id === recordId);
    const originalRecord = originalRecords.find(r => r.id === recordId);
    if (!currentRecord || !originalRecord) return false;
    return currentRecord[field] !== originalRecord[field];
  };

  const startEditing = (recordId: number, field: keyof MedicalRecord, value: string) => {
    setEditingCell({ recordId, field });
    setEditValue(value);
  };

  const confirmEdit = () => {
    if (editingCell.recordId && editingCell.field) {
      setRecords(prev => {
        const newRecords = prev.map(record =>
          record.id === editingCell.recordId && editingCell.field
            ? { ...record, [editingCell.field as keyof MedicalRecord]: editValue }
            : record
        );
        return newRecords;
      });
    }
    setEditingCell({ recordId: null, field: null });
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell({ recordId: null, field: null });
    setEditValue('');
  };

  const saveAllChanges = () => {
    setOriginalRecords([...records]);
  };

  const cancelAllChanges = () => {
    setRecords([...originalRecords]);
    setEditingCell({ recordId: null, field: null });
    setEditValue('');
  };

  const handleStatusClick = (record: MedicalRecord) => {
    if (record.status === 'Needs Review') {
      setSelectedRecord(record);
      setCurrentView('detail');
    } else {
      startEditing(record.id, 'status', record.status);
    }
  };

  const handleBackToTable = () => {
    setCurrentView('table');
    setSelectedRecord(null);
  };

  const handleDetailSave = (updatedRecord: MedicalRecord) => {
    setRecords(prev => prev.map(record =>
      record.id === updatedRecord.id ? updatedRecord : record
    ));
    // Update original records to prevent showing modified state
    setOriginalRecords(prev => prev.map(record =>
      record.id === updatedRecord.id ? updatedRecord : record
    ));
    setCurrentView('table');
    setSelectedRecord(null);
  };

  const handleViewDetails = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setCurrentView('detail');
  };

  const handleDeleteRecord = (recordId: number) => {
    setRecords(prev => prev.filter(record => record.id !== recordId));
    setOriginalRecords(prev => prev.filter(record => record.id !== recordId));
    setShowDeleteConfirm(null);
    // Cancel any ongoing edits if we're deleting the record being edited
    if (editingCell.recordId === recordId) {
      setEditingCell({ recordId: null, field: null });
      setEditValue('');
    }
  };

  const confirmDelete = (recordId: number) => {
    setShowDeleteConfirm(recordId);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const toggleFacilityExpansion = (facility: string) => {
    setExpandedFacilities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(facility)) {
        newSet.delete(facility);
      } else {
        newSet.add(facility);
      }
      return newSet;
    });
  };

  // Damages editing functions
  const startEditingDamage = (recordId: number, field: keyof DamageRecord, value: string) => {
    setEditingDamageCell({ recordId, field });
    setEditDamageValue(value);
  };

  const confirmDamageEdit = () => {
    if (editingDamageCell.recordId && editingDamageCell.field) {
      setDamageRecords(prev => {
        const newRecords = prev.map(record =>
          record.id === editingDamageCell.recordId && editingDamageCell.field
            ? { ...record, [editingDamageCell.field as keyof DamageRecord]:
                editingDamageCell.field === 'amount' ? parseFloat(editDamageValue) || 0 : editDamageValue }
            : record
        );
        return newRecords;
      });
    }
    setEditingDamageCell({ recordId: null, field: null });
    setEditDamageValue('');
  };

  const cancelDamageEdit = () => {
    setEditingDamageCell({ recordId: null, field: null });
    setEditDamageValue('');
  };

  const handleDeleteDamageRecord = (recordId: number) => {
    setDamageRecords(prev => prev.filter(record => record.id !== recordId));
    setShowDeleteDamageConfirm(null);
    if (editingDamageCell.recordId === recordId) {
      setEditingDamageCell({ recordId: null, field: null });
      setEditDamageValue('');
    }
  };

  const confirmDeleteDamage = (recordId: number) => {
    setShowDeleteDamageConfirm(recordId);
  };

  const cancelDeleteDamage = () => {
    setShowDeleteDamageConfirm(null);
  };

  const handleBulkDeleteFacility = (facility: string) => {
    setDamageRecords(prev => prev.filter(record => record.facility !== facility));
    setExpandedFacilities(prev => {
      const newSet = new Set(prev);
      newSet.delete(facility);
      return newSet;
    });
  };

  const handleBulkRenameFacility = (oldFacility: string, newFacility: string) => {
    setDamageRecords(prev => prev.map(record =>
      record.facility === oldFacility
        ? { ...record, facility: newFacility }
        : record
    ));
  };

  const startEditingFacility = (facility: string) => {
    setEditingFacility(facility);
    setEditFacilityValue(facility);
  };

  const confirmFacilityEdit = () => {
    if (editingFacility && editFacilityValue && editingFacility !== editFacilityValue) {
      handleBulkRenameFacility(editingFacility, editFacilityValue);
      // Update expanded facilities set
      setExpandedFacilities(prev => {
        const newSet = new Set(prev);
        if (newSet.has(editingFacility)) {
          newSet.delete(editingFacility);
          newSet.add(editFacilityValue);
        }
        return newSet;
      });
    }
    setEditingFacility(null);
    setEditFacilityValue('');
  };

  const cancelFacilityEdit = () => {
    setEditingFacility(null);
    setEditFacilityValue('');
  };

  const handleDamageStatusClick = (record: DamageRecord) => {
    if (record.status === 'Needs Review') {
      setSelectedDamageRecord(record);
      setDamageDetailView('detail');
    }
  };

  const handleViewDamageDetails = (record: DamageRecord) => {
    setSelectedDamageRecord(record);
    setDamageDetailView('detail');
  };

  const handleBackToDamageTable = () => {
    setDamageDetailView('table');
    setSelectedDamageRecord(null);
  };

  const handleDamageDetailSave = (updatedRecord: DamageRecord) => {
    setDamageRecords(prev => prev.map(record =>
      record.id === updatedRecord.id ? updatedRecord : record
    ));
    // Note: Damage records don't have originalRecords tracking like medical records
    setDamageDetailView('table');
    setSelectedDamageRecord(null);
  };

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allRecordIds = new Set(records.map(record => record.id));
      setSelectedRecords(allRecordIds);
    } else {
      setSelectedRecords(new Set());
    }
  };

  const handleSelectRecord = (recordId: number, checked: boolean) => {
    setSelectedRecords(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(recordId);
      } else {
        newSet.delete(recordId);
      }
      return newSet;
    });
  };

  const handleBulkEdit = () => {
    setShowBulkEdit(true);
  };

  const handleColumnResize = (column: keyof ColumnWidths, newWidth: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [column]: Math.max(50, newWidth) // Minimum width of 50px
    }));
  };

  const startResize = (column: keyof ColumnWidths, e: React.MouseEvent) => {
    e.preventDefault();
    setResizing({ column, startX: e.pageX, startWidth: columnWidths[column] });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (resizing) {
      const diff = e.pageX - resizing.startX;
      const newWidth = resizing.startWidth + diff;
      handleColumnResize(resizing.column, newWidth);
    }
  };

  const handleMouseUp = () => {
    setResizing(null);
  };

  useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizing]);

  // Handle click outside for damage cell editing
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingDamageCell.recordId !== null) {
        const target = event.target as HTMLElement;
        // Check if click is outside the editing popover
        if (!target.closest('.editing-popover') && !target.closest('input')) {
          cancelDamageEdit();
        }
      }
    };

    if (editingDamageCell.recordId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [editingDamageCell.recordId]);

  const handleFilterChange = (field: keyof MedicalRecord, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleFilterDropdown = (field: keyof MedicalRecord) => {
    setActiveFilters(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const filteredRecords = records.filter(record => {
    return Object.entries(filters).every(([field, filterValue]) => {
      if (!filterValue || filterValue === '') return true;
      const recordValue = record[field as keyof MedicalRecord]?.toString().toLowerCase() || '';
      return recordValue.includes(filterValue.toLowerCase());
    });
  });

  const renderFilterButton = (field: keyof MedicalRecord, filterType: string = 'text') => {
    const hasFilter = filters[field] && filters[field] !== '';
    const isActive = activeFilters[field];
    
    return (
      <div className="relative">
        <button
          onClick={() => toggleFilterDropdown(field)}
          className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 ${
            hasFilter ? 'opacity-100 bg-blue-100 text-blue-600' : 'text-gray-400'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        {isActive && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 p-2 min-w-48">
            {filterType === 'text' && (
              <input
                type="text"
                placeholder="Filter..."
                value={filters[field] || ''}
                onChange={(e) => handleFilterChange(field, e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                autoFocus
              />
            )}
            {filterType === 'status' && (
              <select
                value={filters[field] || ''}
                onChange={(e) => handleFilterChange(field, e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option value="">All</option>
                <option value="Needs Review">Needs Review</option>
                <option value="Verified">Verified</option>
              </select>
            )}
            {filterType === 'anatomicalLocation' && (
              <select
                value={filters[field] || ''}
                onChange={(e) => handleFilterChange(field, e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option value="">All</option>
                <option value="Lower extremities">Lower extremities</option>
                <option value="Upper extremities">Upper extremities</option>
                <option value="Back">Back</option>
                <option value="Head/Neck">Head/Neck</option>
                <option value="Torso">Torso</option>
              </select>
            )}
            {filterType === 'critical' && (
              <select
                value={filters[field] || ''}
                onChange={(e) => handleFilterChange(field, e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option value="">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            )}
            {filterType === 'provider' && (
              <select
                value={filters[field] || ''}
                onChange={(e) => handleFilterChange(field, e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option value="">All</option>
                <option value="Dr. Michael Rodriguez">Dr. Michael Rodriguez</option>
                <option value="Dr. Jessica Chen">Dr. Jessica Chen</option>
                <option value="Dr. Emily Davis">Dr. Emily Davis</option>
                <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                <option value="Dr. James Wilson">Dr. James Wilson</option>
              </select>
            )}
            <div className="mt-2 flex gap-1">
              <button
                onClick={() => {
                  handleFilterChange(field, '');
                  toggleFilterDropdown(field);
                }}
                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
              <button
                onClick={() => toggleFilterDropdown(field)}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const modifiedCount = getModifiedRecords().length;
  const hasChanges = modifiedCount > 0;

  const anatomicalOptions = ['Lower extremities', 'Upper extremities', 'Back', 'Head/Neck', 'Torso'];
  const providerOptions = ['Dr. Michael Rodriguez', 'Dr. Jessica Chen', 'Dr. Emily Davis', 'Dr. Sarah Johnson', 'Dr. James Wilson'];

  const renderEditableCell = (record: MedicalRecord, field: keyof MedicalRecord, value: string, className: string = "p-2 text-gray-900") => {
    const isEditing = editingCell.recordId === record.id && editingCell.field === field;
    const isModified = isFieldModified(record.id, field);
    
    if (isEditing) {
      if (field === 'narrative' || field === 'treatment' || field === 'treatmentStatus') {
        return (
          <td className={`${className} relative`}>
            <div className="absolute top-0 left-0 z-50 bg-white border-2 border-blue-500 rounded shadow-lg p-2 min-w-96 max-w-lg">
              <textarea
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={confirmEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    confirmEdit();
                  } else if (e.key === 'Escape') {
                    cancelEdit();
                  }
                }}
                className="w-full text-xs resize-none border-none outline-none"
                rows={4}
                placeholder={`Edit ${field}...`}
              />
              <div className="flex gap-2 mt-2 text-xs text-gray-500">
                <span>Enter to save • Escape to cancel</span>
              </div>
            </div>
          </td>
        );
      } else if (field === 'anatomicalLocation') {
        return (
          <td className={`${className} relative`}>
            <div className="editing-popover absolute top-0 left-0 z-50 bg-white border-2 border-blue-500 rounded shadow-lg">
              <select
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={confirmEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmEdit();
                  else if (e.key === 'Escape') cancelEdit();
                }}
                className="px-3 py-2 text-xs border-none outline-none min-w-48"
              >
                {anatomicalOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </td>
        );
      } else if (field === 'date') {
        return (
          <td className={`${className} relative`}>
            <div className="editing-popover absolute top-0 left-0 z-50 bg-white border-2 border-blue-500 rounded shadow-lg">
              <input
                ref={inputRef}
                type="date"
                value={editValue.split('/').reverse().join('-')}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const formatted = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
                  setEditValue(formatted);
                }}
                onBlur={confirmEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmEdit();
                  else if (e.key === 'Escape') cancelEdit();
                }}
                className="px-3 py-2 text-xs border-none outline-none"
              />
            </div>
          </td>
        );
      } else {
        return (
          <td className={`${className} relative`}>
            <div className="editing-popover absolute top-0 left-0 z-50 bg-white border-2 border-blue-500 rounded shadow-lg">
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={confirmEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmEdit();
                  else if (e.key === 'Escape') cancelEdit();
                }}
                className="px-3 py-2 text-xs border-none outline-none min-w-48"
                placeholder={`Edit ${field}...`}
              />
            </div>
          </td>
        );
      }
    }

    return (
      <td 
        className={`${className} hover:bg-gray-50 cursor-pointer ${
          isModified ? 'ring-2 ring-orange-400 ring-inset' : ''
        }`}
        onClick={() => startEditing(record.id, field, value)}
      >
        <span>
          {field === 'narrative' || field === 'treatment' || field === 'treatmentStatus' 
            ? `${value.substring(0, 120)}${value.length > 120 ? '...' : ''}`
            : value
          }
        </span>
      </td>
    );
  };

  const renderStatusCell = (record: MedicalRecord) => {
    const isEditing = editingCell.recordId === record.id && editingCell.field === 'status';
    const isModified = isFieldModified(record.id, 'status');
    
    if (isEditing) {
      return (
        <td className="p-2 relative">
          <div className="absolute top-0 left-0 z-50 bg-white border-2 border-blue-500 rounded shadow-lg">
            <select
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={confirmEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmEdit();
                else if (e.key === 'Escape') cancelEdit();
              }}
              className="px-3 py-2 text-xs border-none outline-none min-w-32"
            >
              <option value="Verified">Verified</option>
              <option value="Needs Review">Needs Review</option>
            </select>
          </div>
        </td>
      );
    }

    return (
      <td className={`p-2 ${isModified ? 'ring-2 ring-orange-400 ring-inset' : ''}`}>
        <button
          onClick={() => handleStatusClick(record)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-80 ${
            record.status === 'Needs Review'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {record.status}
        </button>
      </td>
    );
  };

  const renderCriticalCell = (record: MedicalRecord) => {
    const isEditing = editingCell.recordId === record.id && editingCell.field === 'critical';
    const isModified = isFieldModified(record.id, 'critical');
    
    if (isEditing) {
      return (
        <td className="p-2 relative">
          <div className="absolute top-0 left-0 z-50 bg-white border-2 border-blue-500 rounded shadow-lg">
            <select
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={confirmEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmEdit();
                else if (e.key === 'Escape') cancelEdit();
              }}
              className="px-3 py-2 text-xs border-none outline-none min-w-20"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </td>
      );
    }

    return (
      <td className={`p-2 ${isModified ? 'ring-2 ring-orange-400 ring-inset' : ''}`}>
        <button
          onClick={() => startEditing(record.id, 'critical', record.critical)}
          className="px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-80 bg-gray-100 text-gray-800"
        >
          {record.critical}
        </button>
      </td>
    );
  };

  const renderProviderCell = (record: MedicalRecord) => {
    const isEditing = editingCell.recordId === record.id && editingCell.field === 'diagnosis';
    const isModified = isFieldModified(record.id, 'diagnosis');
    
    if (isEditing) {
      return (
        <td className="p-2 relative">
          <div className="absolute top-0 left-0 z-50 bg-white border-2 border-blue-500 rounded shadow-lg">
            <select
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={confirmEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmEdit();
                else if (e.key === 'Escape') cancelEdit();
              }}
              className="px-3 py-2 text-xs border-none outline-none min-w-40"
            >
              {providerOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </td>
      );
    }

    return (
      <td className={`p-2 ${isModified ? 'ring-2 ring-orange-400 ring-inset' : ''}`}>
        <button
          onClick={() => startEditing(record.id, 'diagnosis', record.diagnosis)}
          className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
        >
          {record.diagnosis}
        </button>
      </td>
    );
  };

  const InjuryDetailView = ({ record, onBack, onSave }: { record: MedicalRecord, onBack: () => void, onSave: (record: MedicalRecord) => void }) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [editedRecord, setEditedRecord] = useState<MedicalRecord>(record);
    const [showSource, setShowSource] = useState<boolean>(false);
    const [currentSource, setCurrentSource] = useState<string>('Office Visit 2025-02-25 pg. 1');

    const handleSave = () => {
      const updatedRecord = { ...editedRecord, status: 'Verified' };
      onSave(updatedRecord);
    };

    const startEditing = (field: string, value: string, source: string) => {
      setEditingField(field);
      setEditValue(value);
      setCurrentSource(source);
      setShowSource(true);
    };

    const confirmEdit = () => {
      if (editingField) {
        setEditedRecord(prev => ({
          ...prev,
          [editingField as keyof MedicalRecord]: editValue
        }));
      }
      cancelEdit();
    };

    const cancelEdit = () => {
      setEditingField(null);
      setEditValue('');
      setShowSource(false);
    };

    const renderEditableField = (field: keyof MedicalRecord, value: string, source: string, isTextarea: boolean = false) => {
      const isEditing = editingField === field;

      if (isEditing) {
        return (
          <div className="space-y-2">
            {isTextarea ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={confirmEdit}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      }

      return (
        <div
          className="cursor-pointer hover:bg-blue-50 p-1 rounded transition-colors"
          onClick={() => startEditing(field, value, source)}
        >
          <div className="text-blue-600 text-sm">{editedRecord[field]}</div>
          <div className="text-xs text-gray-500 mt-1">{source}</div>
        </div>
      );
    };

    const events = [
      { date: '12/15/2024', description: 'Initial ER diagnosis' },
      { date: '01/10/2025', description: 'MRI confirmation' },
      { date: '02/15/2025', description: 'Anterior discectomy' },
      { date: '04/01/2025', description: 'Post-surgery evaluation' }
    ];

    return (
      <div className="h-full bg-white flex flex-col">
        <div className="border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Injury</h1>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">The data presented in blue below was extracted by AI and needs additional review.</p>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          <div className={`${showSource ? 'w-1/2' : 'w-full'} p-6 space-y-6 overflow-y-auto transition-all duration-300`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Name</label>
              {renderEditableField('injury', record.injury, 'Office Visit 2025-02-25 pg. 1')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* ICD Code(s)</label>
              {renderEditableField('icdCode', record.icdCode, 'Office Visit 2025-02-25 pg. 1')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Narrative</label>
              {renderEditableField('narrative', record.narrative, 'Office Visit 2025-02-25 pg. 1', true)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Date of Onset</label>
              {renderEditableField('date', record.date, 'Office Visit 2025-02-25 pg. 1')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anatomical Location</label>
              {renderEditableField('anatomicalLocation', record.anatomicalLocation, 'Office Visit 2025-02-25 pg. 1')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Critical Injury</label>
              {renderEditableField('critical', record.critical, 'Office Visit 2025-02-25 pg. 1')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Treatments</label>
              {renderEditableField('treatment', record.treatment, 'Office Visit 2025-02-25 pg. 1', true)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Treatment Status</label>
              {renderEditableField('treatmentStatus', record.treatmentStatus, 'Office Visit 2025-02-25 pg. 1', true)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Related</label>
              <div className="text-sm text-gray-900">Yes</div>
              <div className="text-xs text-gray-500 mt-1">Office Visit 2025-02-25 pg. 1</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosing Provider</label>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {record.diagnosis}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Events</label>
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 min-w-20">
                      {event.date}
                    </span>
                    <span className="text-sm text-gray-700">{event.description}</span>
                  </div>
                ))}
                <button className="text-blue-600 text-sm hover:text-blue-800">See 10 more</button>
              </div>
            </div>
          </div>

          {/* Source Display Panel - shown when editing */}
          {showSource && (
            <div className="w-1/2 border-l border-gray-200 bg-white">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Source Document</h3>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{currentSource}</p>
              </div>
              <div className="p-4 space-y-3 overflow-y-auto" style={{height: 'calc(100% - 4rem)'}}>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="text-xs text-gray-600 mb-2">Document Preview</div>
                  <div className="text-sm text-gray-800 leading-relaxed">
                    Following the motor vehicle accident on September 21, 2022, Mr. Eli Strauss experienced immediate onset of sharp pain in the right ankle. Mr. Strauss reported being the driver of a 2019 Honda Civic that was struck from behind while stopped at a red light on Main Street.
                  </div>
                  <div className="mt-3 text-sm font-medium text-gray-900 bg-yellow-100 px-2 py-1 rounded">
                    Highlighted: "{editingField === 'injury' ? editedRecord.injury : editingField === 'narrative' ? editedRecord.narrative : editValue}"
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  This content was extracted from {currentSource}
                </div>
              </div>
            </div>
          )}

          {/* Empty state when not editing */}
          {!showSource && (
            <div className="w-1/2 border-l border-gray-200 bg-gray-50 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-500">Select a field to view its source</p>
                <p className="text-xs text-gray-400 mt-1">Click on any blue field to see the source document</p>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded text-sm font-medium"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="bg-teal-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-800"
            >
              Save
            </button>
          </div>
        </div>

      </div>
    );
  };

  const AddInjuryModal = () => {
    const [formData, setFormData] = useState({
      date: '',
      injury: '',
      icdCode: '',
      narrative: '',
      anatomicalLocation: '',
      treatment: '',
      treatmentStatus: '',
      critical: '',
      relatedInjury: '',
      diagnosingProvider: '',
      events: '',
      source: ''
    });

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleSave = () => {
      // Create new record with next ID
      const newRecord: MedicalRecord = {
        id: Math.max(...records.map(r => r.id)) + 1,
        date: formData.date,
        injury: formData.injury,
        status: 'Needs Review',
        icdCode: formData.icdCode,
        narrative: formData.narrative,
        anatomicalLocation: formData.anatomicalLocation,
        treatment: formData.treatment,
        treatmentStatus: formData.treatmentStatus,
        critical: formData.critical,
        diagnosis: formData.diagnosingProvider
      };

      setRecords(prev => [...prev, newRecord]);
      setOriginalRecords(prev => [...prev, newRecord]);
      setShowAddModal(false);

      // Reset form
      setFormData({
        date: '',
        injury: '',
        icdCode: '',
        narrative: '',
        anatomicalLocation: '',
        treatment: '',
        treatmentStatus: '',
        critical: '',
        relatedInjury: '',
        diagnosingProvider: '',
        events: '',
        source: ''
      });
    };

    const handleCancel = () => {
      setShowAddModal(false);
      // Reset form
      setFormData({
        date: '',
        injury: '',
        icdCode: '',
        narrative: '',
        anatomicalLocation: '',
        treatment: '',
        treatmentStatus: '',
        critical: '',
        relatedInjury: '',
        diagnosingProvider: '',
        events: '',
        source: ''
      });
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-base font-semibold text-gray-900">Add Injury</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-3">
            {/* Date Incurred */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                * Date Incurred
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Injury */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                * Injury
              </label>
              <input
                type="text"
                placeholder="Name"
                value={formData.injury}
                onChange={(e) => handleInputChange('injury', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* ICD Code(s) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                * ICD Code(s)
              </label>
              <input
                type="text"
                placeholder="Codes"
                value={formData.icdCode}
                onChange={(e) => handleInputChange('icdCode', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Narrative */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                * Narrative
              </label>
              <textarea
                placeholder="Description"
                rows={2}
                value={formData.narrative}
                onChange={(e) => handleInputChange('narrative', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Anatomical Location */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                * Anatomical Location
              </label>
              <textarea
                placeholder="Description"
                rows={2}
                value={formData.anatomicalLocation}
                onChange={(e) => handleInputChange('anatomicalLocation', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Treatment */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                * Treatment
              </label>
              <textarea
                placeholder="Description"
                rows={2}
                value={formData.treatment}
                onChange={(e) => handleInputChange('treatment', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Treatment Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                * Treatment Status
              </label>
              <textarea
                placeholder="Description"
                rows={2}
                value={formData.treatmentStatus}
                onChange={(e) => handleInputChange('treatmentStatus', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Critical Injury */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                * Critical Injury
              </label>
              <div className="relative">
                <select
                  value={formData.critical}
                  onChange={(e) => handleInputChange('critical', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-8"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Related Injury */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Related Injury
              </label>
              <div className="relative">
                <select
                  value={formData.relatedInjury}
                  onChange={(e) => handleInputChange('relatedInjury', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-8"
                >
                  <option value="">Select</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Diagnosing Provider */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Diagnosing Provider
              </label>
              <div className="relative">
                <select
                  value={formData.diagnosingProvider}
                  onChange={(e) => handleInputChange('diagnosingProvider', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-8"
                >
                  <option value="">Select provider</option>
                  <option value="Dr. Michael Rodriguez">Dr. Michael Rodriguez</option>
                  <option value="Dr. Sarah Chen">Dr. Sarah Chen</option>
                  <option value="Dr. Emily Davis">Dr. Emily Davis</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Events */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Events
              </label>
              <div className="relative">
                <select
                  value={formData.events}
                  onChange={(e) => handleInputChange('events', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-8"
                >
                  <option value="">Select events</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Select Source */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Select source
              </label>
              <div className="relative">
                <select
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-8"
                >
                  <option value="">Select source</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-3 border-t bg-gray-50">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm text-white bg-gray-800 rounded hover:bg-gray-900 focus:ring-2 focus:ring-blue-500"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    );
  };

  const BulkEditModal = () => {
    const [bulkEditData, setBulkEditData] = useState({
      status: '',
      critical: '',
      diagnosingProvider: ''
    });

    const handleBulkInputChange = (field: string, value: string) => {
      setBulkEditData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleBulkSave = () => {
      const selectedRecordIds = Array.from(selectedRecords);
      const updatedRecords = records.map(record => {
        if (selectedRecordIds.includes(record.id)) {
          const updates: Partial<MedicalRecord> = {};
          if (bulkEditData.status) updates.status = bulkEditData.status;
          if (bulkEditData.critical) updates.critical = bulkEditData.critical;
          if (bulkEditData.diagnosingProvider) updates.diagnosis = bulkEditData.diagnosingProvider;

          return { ...record, ...updates };
        }
        return record;
      });

      setRecords(updatedRecords);
      setOriginalRecords(updatedRecords);
      setSelectedRecords(new Set());
      setShowBulkEdit(false);
      setBulkEditData({ status: '', critical: '', diagnosingProvider: '' });
    };

    const handleBulkCancel = () => {
      setShowBulkEdit(false);
      setBulkEditData({ status: '', critical: '', diagnosingProvider: '' });
    };

    if (!showBulkEdit) return null;

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Bulk Edit {selectedRecords.size} Record{selectedRecords.size !== 1 ? 's' : ''}
            </h3>
          </div>

          <div className="p-4 space-y-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={bulkEditData.status}
                onChange={(e) => handleBulkInputChange('status', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Leave unchanged</option>
                <option value="Needs Review">Needs Review</option>
                <option value="Verified">Verified</option>
              </select>
            </div>

            {/* Critical */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Critical Injury
              </label>
              <select
                value={bulkEditData.critical}
                onChange={(e) => handleBulkInputChange('critical', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Leave unchanged</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Diagnosing Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosing Provider
              </label>
              <select
                value={bulkEditData.diagnosingProvider}
                onChange={(e) => handleBulkInputChange('diagnosingProvider', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Leave unchanged</option>
                <option value="Dr. Michael Rodriguez">Dr. Michael Rodriguez</option>
                <option value="Dr. Sarah Chen">Dr. Sarah Chen</option>
                <option value="Dr. Emily Davis">Dr. Emily Davis</option>
              </select>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
            <button
              onClick={handleBulkCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Group damages by facility
  const groupedDamages = damageRecords.reduce((acc, record) => {
    if (!acc[record.facility]) {
      acc[record.facility] = [];
    }
    acc[record.facility].push(record);
    return acc;
  }, {} as Record<string, DamageRecord[]>);

  // Calculate totals
  const totalDamages = damageRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalRecords = damageRecords.length;

  // Calculate category totals (based on reference image)
  const medicalBills = damageRecords.filter(r => r.facility.includes('Hospital') || r.facility.includes('Medical') || r.facility.includes('Health') || r.facility.includes('Clinic') || r.facility.includes('Urgent')).reduce((sum, r) => sum + r.amount, 0);

  const renderEditableDamageCell = (record: DamageRecord, field: keyof DamageRecord, value: string, className: string = "py-1 px-2 text-gray-700") => {
    const isEditing = editingDamageCell.recordId === record.id && editingDamageCell.field === field;

    if (isEditing) {
      if (field === 'amount') {
        return (
          <td className={`${className} relative`}>
            <div className="editing-popover absolute top-0 left-0 z-50 bg-white border-2 border-blue-500 rounded shadow-lg">
              <input
                ref={inputRef}
                type="number"
                value={editDamageValue}
                onChange={(e) => setEditDamageValue(e.target.value)}
                onBlur={confirmDamageEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmDamageEdit();
                  else if (e.key === 'Escape') cancelDamageEdit();
                }}
                className="px-3 py-2 text-xs border-none outline-none min-w-24"
                placeholder="Amount"
              />
            </div>
          </td>
        );
      } else {
        return (
          <td className={`${className} relative`}>
            <div className="editing-popover absolute top-0 left-0 z-50 bg-white border-2 border-blue-500 rounded shadow-lg">
              <input
                ref={inputRef}
                type="text"
                value={editDamageValue}
                onChange={(e) => setEditDamageValue(e.target.value)}
                onBlur={confirmDamageEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmDamageEdit();
                  else if (e.key === 'Escape') cancelDamageEdit();
                }}
                className="px-3 py-2 text-xs border-none outline-none min-w-48"
                placeholder={`Edit ${field}...`}
              />
            </div>
          </td>
        );
      }
    }

    return (
      <td
        className={`${className} hover:bg-gray-50 cursor-pointer`}
        onClick={() => startEditingDamage(record.id, field, value)}
      >
        <span>
          {field === 'amount'
            ? `$${(typeof value === 'number' ? value : parseFloat(value) || 0).toLocaleString()}`
            : value || ''
          }
        </span>
      </td>
    );
  };

  const renderDamageStatusCell = (record: DamageRecord) => {
    return (
      <td className="py-1 px-2">
        <button
          onClick={() => handleDamageStatusClick(record)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-80 ${
            record.status === 'Needs Review'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {record.status}
        </button>
      </td>
    );
  };

  const DamageDetailView = ({ record, onBack, onSave }: { record: DamageRecord, onBack: () => void, onSave: (record: DamageRecord) => void }) => {
    const isVerified = record.status === 'Verified';

    const handleSave = () => {
      const updatedRecord = { ...record, status: 'Verified' };
      onSave(updatedRecord);
    };

    return (
      <div className="h-full bg-white flex flex-col">
        <div className="border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Damage Record</h1>
            </div>
          </div>
          {!isVerified && (
            <p className="text-sm text-gray-600 mt-1">The data presented in blue below was extracted by AI and needs additional review.</p>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          <div className="w-1/2 p-6 space-y-6 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Facility</label>
              <div className={`text-sm ${isVerified ? 'text-gray-900' : 'text-blue-600'}`}>{record.facility}</div>
              <div className="text-xs text-gray-500 mt-1">Bill Document pg. 1</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Date</label>
              <div className={`text-sm ${isVerified ? 'text-gray-900' : 'text-blue-600'}`}>{record.date || 'Not specified'}</div>
              <div className="text-xs text-gray-500 mt-1">Bill Document pg. 1</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Description</label>
              <div className="text-sm text-gray-900 leading-relaxed">{record.description || 'Not specified'}</div>
              <div className="text-xs text-gray-500 mt-1">Bill Document pg. 1</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Amount</label>
              <div className={`text-sm ${isVerified ? 'text-gray-900' : 'text-blue-600'}`}>${record.amount.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Bill Document pg. 1</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Source</label>
              <div className={`text-sm ${isVerified ? 'text-gray-900' : 'text-blue-600'}`}>{record.source || 'Not specified'}</div>
              <div className="text-xs text-gray-500 mt-1">Bill Document pg. 1</div>
            </div>
          </div>

          {/* Empty state when not editing */}
          <div className="w-1/2 border-l border-gray-200 bg-gray-50 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-500">Select a field to view its source</p>
              <p className="text-xs text-gray-400 mt-1">{isVerified ? 'This record has been verified' : 'Click on any blue field to see the source document'}</p>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {!isVerified && (
              <div className="flex items-center gap-3">
              </div>
            )}
            {isVerified && <div></div>}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded text-sm font-medium"
              >
                Close
              </button>
              {!isVerified && (
                <button
                  onClick={handleSave}
                  className="bg-teal-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-800"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EconomicDamagesTable = () => {
    return (
      <div className="w-full bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Economic Damages</h2>
              <div className="text-sm text-gray-600">
                ${totalDamages.toLocaleString()} total • {totalRecords} records
              </div>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-6 mb-4">
            <div className="text-sm font-medium text-gray-900 border-b-2 border-teal-600 pb-1">
              Medical Bills ${medicalBills.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              Out-of-Pocket $57
            </div>
            <div className="text-sm text-gray-600">
              Mileage $20
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{totalRecords} records</span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 px-2 py-1 border border-gray-300 rounded text-xs h-7 min-w-16 justify-center">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M3 10H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M3 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Columns
              </button>
              <button className="text-gray-600 hover:text-gray-800 px-2 py-1 border border-gray-300 rounded text-xs h-7 min-w-20 flex items-center justify-center">
                + Add record
              </button>
              <div className="relative">
                <button className="text-gray-600 hover:text-gray-800 px-2 py-1 border border-gray-300 rounded text-xs h-7 w-7 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="3" r="1" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1" fill="currentColor"/>
                    <circle cx="8" cy="13" r="1" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Damages table */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-xs bg-white">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-2 font-medium text-gray-700 w-48">Facility</th>
                <th className="text-left p-2 font-medium text-gray-700 w-24">Date</th>
                <th className="text-left p-2 font-medium text-gray-700 w-56">Description</th>
                <th className="text-left p-2 font-medium text-gray-700 w-32">Status</th>
                <th className="text-left p-2 font-medium text-gray-700 w-24">Amount</th>
                <th className="text-left p-2 font-medium text-gray-700 w-48">Source</th>
                <th className="text-left p-2 font-medium text-gray-700 w-48">History</th>
                <th className="text-left p-2 font-medium text-gray-700 w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedDamages).map(([facility, records]) => (
                <React.Fragment key={facility}>
                  {/* Facility header row */}
                  <tr
                    className="bg-gray-50 hover:bg-gray-100 h-10"
                    onMouseEnter={() => setHoveredFacility(facility)}
                    onMouseLeave={() => setHoveredFacility(null)}
                  >
                    <td className="py-1 px-2 font-medium text-gray-900">
                      {editingFacility === facility ? (
                        <div className="flex items-center">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className={`mr-2 transition-transform ${expandedFacilities.has(facility) ? 'rotate-90' : ''}`}
                          >
                            <path d="M6 12l6-6H6z"/>
                          </svg>
                          <input
                            ref={inputRef}
                            type="text"
                            value={editFacilityValue}
                            onChange={(e) => setEditFacilityValue(e.target.value)}
                            onBlur={confirmFacilityEdit}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') confirmFacilityEdit();
                              else if (e.key === 'Escape') cancelFacilityEdit();
                            }}
                            className="bg-white border border-blue-500 rounded px-2 py-1 text-xs font-medium min-w-48"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className={`mr-2 transition-transform cursor-pointer ${expandedFacilities.has(facility) ? 'rotate-90' : ''}`}
                            onClick={() => toggleFacilityExpansion(facility)}
                          >
                            <path d="M6 12l6-6H6z"/>
                          </svg>
                          <span
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => startEditingFacility(facility)}
                          >
                            {facility} {records.length}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-1 px-2 text-gray-500"></td>
                    <td className="py-1 px-2 text-gray-500"></td>
                    <td className="py-1 px-2 text-gray-500"></td>
                    <td className="py-1 px-2 font-medium text-gray-900">
                      ${records.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                    </td>
                    <td className="py-1 px-2 text-gray-500"></td>
                    <td className="py-1 px-2 text-gray-500">{records[0]?.history}</td>
                    <td className="py-1 px-2">
                      <div className="flex items-center justify-start">
                        {hoveredFacility === facility ? (
                          <button
                            onClick={() => handleBulkDeleteFacility(facility)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-red-700 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                            title="Delete All Records"
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete All
                          </button>
                        ) : (
                          <div className="text-[10px] text-gray-300 italic opacity-60">Hover to delete all</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Individual records - only show if expanded */}
                  {expandedFacilities.has(facility) && records.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-gray-100 hover:bg-gray-50 h-10"
                      onMouseEnter={() => setHoveredDamageRow(record.id)}
                      onMouseLeave={() => setHoveredDamageRow(null)}
                    >
                      {renderEditableDamageCell(record, 'facility', record.facility, "py-1 px-2 pl-8 text-gray-700")}
                      {renderEditableDamageCell(record, 'date', record.date)}
                      {renderEditableDamageCell(record, 'description', record.description)}
                      {renderDamageStatusCell(record)}
                      {renderEditableDamageCell(record, 'amount', record.amount.toString(), "py-1 px-2 text-gray-900 font-medium")}
                      {renderEditableDamageCell(record, 'source', record.source, "py-1 px-2")}
                      <td className="py-1 px-2 text-gray-500">{record.history}</td>
                      <td className="py-1 px-2">
                        <div className="flex items-center justify-start gap-2">
                          {hoveredDamageRow === record.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDamageDetails(record)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                                title="View Details"
                              >
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Details
                              </button>
                              <button
                                onClick={() => confirmDeleteDamage(record.id)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-red-700 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 italic text-left">Hover for actions</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Create sidebar items with icons
  const sidebarItems = [
    { id: 'overview', icon: <Home size={18} />, label: 'Overview' },
    { id: 'medicals', icon: <Activity size={18} />, label: 'Medicals' },
    { id: 'timeline', icon: <BarChart2 size={18} />, label: 'Timeline' },
    { id: 'damages', icon: <DollarSignIcon size={18} />, label: 'Damages' },
    { id: 'drafting', icon: <PenTool size={18} />, label: 'Drafting' },
    { id: 'files', icon: <Layers size={18} />, label: 'Files' }
  ];


  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-900">Eli Strauss - MVA</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50 flex items-center">
              Export
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Print
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10 w-48">
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Open Case History
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Briefcase size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <div className="w-48 bg-white border-r border-gray-200 flex flex-col z-0 overflow-y-auto">
          <div className="mt-4 flex-1">
            {sidebarItems.map(item => (
              <div
                key={item.id}
                className={`flex items-center px-4 py-2 ${
                  activeNavItem === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                } cursor-pointer`}
                onClick={() => {
                  setActiveNavItem(item.id);
                  if (item.id === 'damages') {
                    setCurrentPage('damages');
                  } else if (item.id === 'medicals') {
                    setCurrentPage('injuries');
                  }
                }}
              >
                <div className="mr-3">{item.icon}</div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {currentPage === 'damages' ? (
            damageDetailView === 'detail' && selectedDamageRecord ? (
              <DamageDetailView
                record={selectedDamageRecord}
                onBack={handleBackToDamageTable}
                onSave={handleDamageDetailSave}
              />
            ) : (
              <EconomicDamagesTable />
            )
          ) : currentView === 'detail' && selectedRecord ? (
            <InjuryDetailView
              record={selectedRecord}
              onBack={handleBackToTable}
              onSave={handleDetailSave}
            />
          ) : (
            <div className="w-full bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Medicals</h2>
        </div>
        
        <div className="flex items-center gap-6 mb-4">
          <div className="text-sm font-medium text-gray-900 border-b-2 border-teal-600 pb-1">
            Injuries 20
          </div>
          <div className="text-sm text-gray-600">
            Providers 3
          </div>
        </div>

        {/* Bulk edit controls */}
        {selectedRecords.size > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedRecords.size} record{selectedRecords.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkEdit}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Bulk Edit
                </button>
                <button
                  onClick={() => setSelectedRecords(new Set())}
                  className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{filteredRecords.length} records</span>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <>
                <button 
                  onClick={saveAllChanges}
                  className="text-white bg-teal-700 hover:bg-teal-800 px-2 py-1 border border-teal-700 rounded text-xs h-7 min-w-20 flex items-center justify-center"
                >
                  Save changes ({modifiedCount})
                </button>
                <button 
                  onClick={cancelAllChanges}
                  className="text-red-600 hover:text-red-800 px-2 py-1 border border-red-300 rounded text-xs h-7 min-w-20 flex items-center justify-center"
                >
                  Cancel all changes
                </button>
              </>
            )}
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 px-2 py-1 border border-gray-300 rounded text-xs h-7 min-w-16 justify-center">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 10H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Columns
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-gray-600 hover:text-gray-800 px-2 py-1 border border-gray-300 rounded text-xs h-7 min-w-20 flex items-center justify-center"
            >+ Add record</button>
            <div className="relative">
              <button className="text-gray-600 hover:text-gray-800 px-2 py-1 border border-gray-300 rounded text-xs h-7 w-7 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="3" r="1" fill="currentColor"/>
                  <circle cx="8" cy="8" r="1" fill="currentColor"/>
                  <circle cx="8" cy="13" r="1" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white">
        <div className="bg-gray-50">
          <div className="pl-2">
            <table className="w-full text-xs bg-white" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-2 font-medium text-gray-700 relative group" style={{ width: `${columnWidths.checkbox}px` }}>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedRecords.size === records.length && records.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => startResize('checkbox', e)}
                    />
                  </th>
                  <th className="text-left p-2 font-medium text-gray-700 relative group" style={{ width: `${columnWidths.date}px` }}>
                    <div className="flex items-center justify-between">
                      <span>Date</span>
                      {renderFilterButton('date', 'text')}
                    </div>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => startResize('date', e)}
                    />
                  </th>
                  <th className="text-left p-2 font-medium text-gray-700 relative group" style={{ width: `${columnWidths.injury}px` }}>
                    <div className="flex items-center justify-between">
                      <span>Injury</span>
                      {renderFilterButton('injury', 'text')}
                    </div>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => startResize('injury', e)}
                    />
                  </th>
                  <th className="text-left p-2 font-medium text-gray-700 relative group" style={{ width: `${columnWidths.status}px` }}>
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      {renderFilterButton('status', 'status')}
                    </div>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => startResize('status', e)}
                    />
                  </th>
                  <th className="text-left p-2 font-medium text-gray-700 relative group" style={{ width: `${columnWidths.icdCode}px` }}>
                    <div className="flex items-center justify-between">
                      <span>ICD Code(s)</span>
                      {renderFilterButton('icdCode', 'text')}
                    </div>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => startResize('icdCode', e)}
                    />
                  </th>
                  <th className="text-left p-2 font-medium text-gray-700 relative group" style={{ width: `${columnWidths.narrative}px` }}>
                    <div className="flex items-center justify-between">
                      <span>Narrative</span>
                      {renderFilterButton('narrative', 'text')}
                    </div>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => startResize('narrative', e)}
                    />
                  </th>
                  <th className="text-left p-2 font-medium text-gray-700 relative group" style={{ width: `${columnWidths.anatomicalLocation}px` }}>
                    <div className="flex items-center justify-between">
                      <span>Anatomical Location</span>
                      {renderFilterButton('anatomicalLocation', 'anatomicalLocation')}
                    </div>
                    <div
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => startResize('anatomicalLocation', e)}
                    />
                  </th>
                  <th className="text-left p-2 font-medium text-gray-700 relative group" style={{ width: `${columnWidths.treatmentStatus}px` }}>
                    <div className="flex items-center justify-between">
                      <span>Treatment Status</span>
                      {renderFilterButton('treatmentStatus', 'text')}
                    </div>
                    <div
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => startResize('treatmentStatus', e)}
                    />
                  </th>
                  <th className="text-left p-2 font-medium text-gray-700 relative group" style={{ width: `${columnWidths.critical}px` }}>
                    <div className="flex items-center justify-between">
                      <span>Critical</span>
                      {renderFilterButton('critical', 'critical')}
                    </div>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => startResize('critical', e)}
                    />
                  </th>
                  <th className="text-left p-2 font-medium text-gray-700 relative group" style={{ width: `${columnWidths.diagnosis}px` }}>
                    <div className="flex items-center justify-between">
                      <span>Diagnosing provider</span>
                      {renderFilterButton('diagnosis', 'provider')}
                    </div>
                    <div 
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => startResize('diagnosis', e)}
                    />
                  </th>
                  <th className="text-left p-2 font-medium text-gray-700 relative group" style={{ width: `${columnWidths.actions}px` }}>
                    <span>Actions</span>
                    <div
                      className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-300 opacity-0 hover:opacity-100"
                      onMouseDown={(e) => startResize('actions', e)}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 hover:bg-gray-50 h-16 relative group"
                    onMouseEnter={() => setHoveredRow(record.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="p-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedRecords.has(record.id)}
                        onChange={(e) => handleSelectRecord(record.id, e.target.checked)}
                      />
                    </td>
                    {renderEditableCell(record, 'date', record.date)}
                    {renderEditableCell(record, 'injury', record.injury)}
                    {renderStatusCell(record)}
                    {renderEditableCell(record, 'icdCode', record.icdCode)}
                    {renderEditableCell(record, 'narrative', record.narrative, "p-2 text-gray-600")}
                    {renderEditableCell(record, 'anatomicalLocation', record.anatomicalLocation, "p-2 text-gray-600")}
                    {renderEditableCell(record, 'treatmentStatus', record.treatmentStatus, "p-2 text-gray-600")}
                    {renderCriticalCell(record)}
                    {renderProviderCell(record)}
                    <td className="p-2">
                      <div className="flex items-center justify-start gap-2">
                        {/* Action buttons - shown on hover */}
                        {hoveredRow === record.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(record)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                              title="View Details"
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => confirmDelete(record.id)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-red-700 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic text-left">Hover for actions</div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>

        {/* Add Injury Modal */}
        <AddInjuryModal />

        {/* Bulk Edit Modal */}
        <BulkEditModal />

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Delete Injury Record</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete this injury record? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteRecord(showDeleteConfirm)}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Damage Confirmation Dialog */}
        {showDeleteDamageConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Delete Damage Record</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete this damage record? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDeleteDamage}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteDamageRecord(showDeleteDamageConfirm)}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MedicalRecordsTable;