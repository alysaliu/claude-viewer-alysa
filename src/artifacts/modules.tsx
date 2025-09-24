import React, { useState, useRef, useEffect } from 'react';
import { Home, BarChart2, Layers, PenTool, ChevronDown, MoreVertical, Bell, Briefcase, Activity, DollarSignIcon } from 'lucide-react';
import OverviewPage from './OverviewPage';

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
  const [savedFields, setSavedFields] = useState<Set<string>>(new Set());
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
      setSavedFields(prev => new Set(prev).add(`${editingCell.recordId}-${editingCell.field}`));
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

    const isSaved = savedFields.has(`${record.id}-${field}`);

    return (
      <td
        className={`${className} hover:bg-gray-50 cursor-pointer`}
        onClick={() => startEditing(record.id, field, value)}
      >
        <span className={`${isSaved ? 'text-gray-900' : isModified ? 'text-blue-600' : 'text-gray-900'} ${isModified ? 'font-semibold' : ''}`}>
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
      <td className="p-2">
        <button
          onClick={() => handleStatusClick(record)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-80 ${
            record.status === 'Needs Review'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-green-100 text-green-800'
          } ${isModified ? 'font-bold' : ''}`}
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
    const isVerified = record.status === 'Verified';
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [editedRecord, setEditedRecord] = useState<MedicalRecord>(record);
    const [showSource, setShowSource] = useState<boolean>(false);
    const [currentSource, setCurrentSource] = useState<string>('Office Visit 2025-02-25 pg. 1');
    const [savedFields, setSavedFields] = useState<Set<string>>(new Set());


    const handleSaveAndVerifyAll = () => {
      // Update current record to verified
      const updatedRecord = { ...editedRecord, status: 'Verified' };
      onSave(updatedRecord);

      // TODO: In a real app, this would trigger verification of all records
      // For now, we'll just save the current record
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
        setSavedFields(prev => new Set(prev).add(editingField));
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
          <div className={`text-sm ${isVerified || savedFields.has(field) ? 'text-gray-900' : 'text-blue-600'}`}>{editedRecord[field]}</div>
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
          {!isVerified && (
            <p className="text-sm text-gray-600 mt-1">The data presented in blue below was extracted by AI and needs additional review.</p>
          )}
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
              <div className="flex-1 p-4 overflow-auto bg-gray-100">
                <div className="bg-white rounded shadow-sm">
                  <img
                    src="/med-source.png"
                    alt="Medical Source Document"
                    className="w-full h-auto"
                    style={{ maxHeight: 'none' }}
                  />
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
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Last updated by Supio AI on 9/23/25
            </div>
            <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm font-medium"
            >
              Close
            </button>
            <button
              onClick={handleSaveAndVerifyAll}
              className="bg-teal-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-800"
            >
              Save and verify all
            </button>
            </div>
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
    const [showSource, setShowSource] = useState<boolean>(false);
    const [currentField, setCurrentField] = useState<string>('');
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [editedRecord, setEditedRecord] = useState<DamageRecord>(record);
    const [savedFields, setSavedFields] = useState<Set<string>>(new Set());


    const handleSaveAndVerifyAll = () => {
      // Update current record to verified
      const updatedRecord = { ...editedRecord, status: 'Verified' };
      onSave(updatedRecord);

      // TODO: In a real app, this would trigger verification of all records
      // For now, we'll just save the current record
    };

    const startEditing = (field: string, value: string, source: string) => {
      setEditingField(field);
      setEditValue(value);
      setCurrentField(source);
      setShowSource(true);
    };

    const confirmEdit = () => {
      if (editingField) {
        setEditedRecord(prev => ({
          ...prev,
          [editingField as keyof DamageRecord]: editValue
        }));
        setSavedFields(prev => new Set(prev).add(editingField));
      }
      cancelEdit();
    };

    const cancelEdit = () => {
      setEditingField(null);
      setEditValue('');
      setShowSource(false);
    };


    const renderEditableField = (field: keyof DamageRecord, value: string, source: string) => {
      const isEditing = editingField === field;

      if (isEditing) {
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
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
          <div className={`text-sm ${isVerified || savedFields.has(field) ? 'text-gray-900' : 'text-blue-600'}`}>{editedRecord[field]}</div>
          <div className="text-xs text-gray-500 mt-1">{source}</div>
        </div>
      );
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
              {renderEditableField('facility', editedRecord.facility, 'Bill Document pg. 1')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Date</label>
              {renderEditableField('date', editedRecord.date || 'Not specified', 'Bill Document pg. 1')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Description</label>
              {renderEditableField('description', editedRecord.description || 'Not specified', 'Bill Document pg. 1')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Amount</label>
              {renderEditableField('amount', `$${editedRecord.amount.toLocaleString()}`, 'Bill Document pg. 1')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">* Source</label>
              {renderEditableField('source', editedRecord.source || 'Not specified', 'Bill Document pg. 1')}
            </div>
          </div>

          {/* Source Document Panel */}
          <div className="w-1/2 border-l border-gray-200 bg-white flex flex-col">
            {showSource ? (
              <div className="flex-1 flex flex-col">
                {/* Source Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{currentField} - Source Document</h3>
                      <p className="text-xs text-gray-500 mt-1">Bill Document pg. 1</p>
                    </div>
                    <button
                      onClick={() => setShowSource(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Document Image */}
                <div className="flex-1 p-4 overflow-auto bg-gray-100">
                  <div className="bg-white rounded shadow-sm">
                    <img
                      src="/image.png"
                      alt="Source Document"
                      className="w-full h-auto"
                      style={{ maxHeight: 'none' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-500">Select a field to view its source</p>
                  <p className="text-xs text-gray-400 mt-1">{isVerified ? 'This record has been verified' : 'Click on any field to see the source document'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Last updated by Supio AI on 9/23/25
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm font-medium"
              >
                Close
              </button>
              {!isVerified && (
                <button
                  onClick={handleSaveAndVerifyAll}
                  className="bg-teal-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-teal-800"
                >
                  Save and verify all
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PatientDetailView = ({ patientData, onBack, onSave }: {
    patientData: any;
    onBack: () => void;
    onSave: (data: any) => void;
  }) => {
    const [editedData, setEditedData] = React.useState(patientData);
    const [showSource, setShowSource] = React.useState(false);
    const [currentField, setCurrentField] = React.useState('');
    const [currentFieldIsEmpty, setCurrentFieldIsEmpty] = React.useState(false);
    const [editingField, setEditingField] = React.useState<string | null>(null);
    const [isVerified, setIsVerified] = React.useState(false);
    const [unsavedFields, setUnsavedFields] = React.useState<Set<string>>(new Set());
    const [editCount, setEditCount] = React.useState(0);

    const handleSaveAndVerifyAll = () => {
      setIsVerified(true);
      setUnsavedFields(new Set()); // Clear unsaved fields when saving
      onSave(editedData);
    };

    const handleFieldChange = (fieldPath: string, value: string) => {
      // Check if this is actually a change by getting the previous value
      const keys = fieldPath.split('.');
      let previousValue = editedData;
      for (const key of keys) {
        if (previousValue && typeof previousValue === 'object' && key in previousValue) {
          previousValue = previousValue[key];
        } else {
          previousValue = '';
          break;
        }
      }

      const newData = { ...editedData };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      setEditedData(newData);

      // Increment edit count if this is actually a change
      if (previousValue !== value) {
        setEditCount(prev => prev + 1);
      }

      // Mark field as unsaved if it has a value
      if (value && value.trim() !== '') {
        setUnsavedFields(prev => new Set([...prev, fieldPath]));
      } else {
        // Remove from unsaved if value is empty
        setUnsavedFields(prev => {
          const newSet = new Set(prev);
          newSet.delete(fieldPath);
          return newSet;
        });
      }
    };

    const renderEditableField = (field: string, value: string, sourceDoc: string, fieldPath: string, isEmpty: boolean = false, conflicts: string[] = [], updatedBy: 'ai' | 'human' = 'ai') => {
      const isEditing = editingField === field;

      // Get the current value from editedData for empty fields
      const getCurrentValue = () => {
        const keys = fieldPath.split('.');
        let current = editedData;
        for (const key of keys) {
          if (current && typeof current === 'object' && key in current) {
            current = current[key];
          } else {
            return isEmpty ? '' : value;
          }
        }
        return current || (isEmpty ? '' : value);
      };

      const currentValue = getCurrentValue();

      const handleFieldClick = () => {
        setEditingField(field);
        setCurrentField(field);
        setCurrentFieldIsEmpty(isEmpty);
        setShowSource(true);
      };

      const handleInputFocus = () => {
        setCurrentField(field);
        setCurrentFieldIsEmpty(isEmpty);
        setShowSource(true);
      };

      return (
        <div className="relative group">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setEditingField(null);
                    if (e.key === 'Escape') setEditingField(null);
                  }}
                  className="w-full p-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              ) : (
                <div
                  className={`p-1.5 border rounded min-h-[32px] bg-white cursor-pointer hover:bg-gray-50 transition-colors ${
                    !currentValue || currentValue === ''
                      ? 'border-dashed border-gray-300 bg-gray-50'
                      : conflicts.length > 0
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-200'
                  }`}
                  onClick={handleFieldClick}
                >
                  {!currentValue || currentValue === '' ? (
                    <span className="text-gray-400 text-xs italic">Enter data</span>
                  ) : conflicts.length > 0 ? (
                    <div className="space-y-2">
                      {/* Current value option */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          {isEditing && editingField === `${field}_current` ? (
                            <input
                              type="text"
                              value={currentValue}
                              onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
                              onFocus={handleInputFocus}
                              onBlur={() => setEditingField(null)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') setEditingField(null);
                                if (e.key === 'Escape') setEditingField(null);
                              }}
                              className="w-full p-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              autoFocus
                            />
                          ) : (
                            <div
                              className="p-1.5 border border-blue-300 rounded bg-white cursor-pointer hover:bg-blue-50 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingField(`${field}_current`);
                                setCurrentField(field);
                                setCurrentFieldIsEmpty(false);
                                setShowSource(true);
                              }}
                            >
                              <span className="text-gray-900 text-xs">{currentValue}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {/* Sparkle Icon for AI */}
                          <div className="relative group/tooltip">
                            <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                            </svg>
                            <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                              Updated by Supio AI on 9/25/25
                            </div>
                          </div>
                          {/* Accept Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFieldChange(fieldPath, currentValue);
                            }}
                            className="w-4 h-4 flex items-center justify-center text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                            title="Accept this value"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {/* Conflict value options */}
                      {conflicts.map((conflictValue, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1">
                            {isEditing && editingField === `${field}_conflict_${index}` ? (
                              <input
                                type="text"
                                value={conflictValue}
                                onChange={(e) => {
                                  // For simplicity, we'll just update the field directly
                                  // In a real app, you might want to manage conflict values separately
                                  handleFieldChange(fieldPath, e.target.value);
                                }}
                                onFocus={handleInputFocus}
                                onBlur={() => setEditingField(null)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') setEditingField(null);
                                  if (e.key === 'Escape') setEditingField(null);
                                }}
                                className="w-full p-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                autoFocus
                              />
                            ) : (
                              <div
                                className="p-1.5 border border-gray-300 rounded bg-white cursor-pointer hover:bg-blue-50 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingField(`${field}_conflict_${index}`);
                                  setCurrentField(field);
                                  setCurrentFieldIsEmpty(false);
                                  setShowSource(true);
                                }}
                              >
                                <span className="text-gray-900 text-xs">{conflictValue}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {/* Sparkle Icon for AI */}
                            <div className="relative group/tooltip">
                              <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                              </svg>
                              <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                Updated by Supio AI on 8/15/23
                              </div>
                            </div>
                            {/* Accept Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFieldChange(fieldPath, conflictValue);
                              }}
                              className="w-4 h-4 flex items-center justify-center text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                              title="Accept this value"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-900 text-xs">{currentValue}</span>
                  )}
                </div>
              )}
            </div>

            {currentValue && currentValue !== '' && !unsavedFields.has(fieldPath) && conflicts.length === 0 && (
              <div className="flex items-center gap-1">
                {updatedBy === 'ai' ? (
                  /* Sparkle Icon for AI */
                  <div className="relative group/tooltip">
                    <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      Updated by Supio AI on 9/25/25
                    </div>
                  </div>
                ) : (
                  /* Person Icon for Human */
                  <div className="relative group/tooltip">
                    <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      Updated by Alysa Liu on 9/20/25
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Patient Information</h1>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">{editCount} edit{editCount !== 1 ? 's' : ''} made by Alysa Liu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/2 overflow-auto p-6 space-y-6">
            {/* Basic Patient Information */}
            <div className="space-y-4">
              <h2 className="text-base font-medium text-gray-900">Basic Information</h2>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">* Name</label>
                {renderEditableField('name', editedData.name, 'Patient Registration Form', 'name', false, [], 'human')}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">* Gender</label>
                {renderEditableField('gender', editedData.gender, 'Patient Registration Form', 'gender')}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                  * Date of Birth
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                    Conflict
                  </span>
                </label>
                {renderEditableField('dateOfBirth', editedData.dateOfBirth, 'Patient Registration Form', 'dateOfBirth', false, ['10/05/66'])}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">* State of Residence</label>
                {renderEditableField('stateOfResidence', editedData.stateOfResidence, 'Patient Registration Form', 'stateOfResidence')}
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-4">
              <h2 className="text-base font-medium text-gray-900">Medical History</h2>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">* Description</label>
                {renderEditableField('medicalDescription', editedData.medicalHistory[0].description, 'Medical Records', 'medicalHistory.0.description')}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">* Date</label>
                {renderEditableField('medicalDate', editedData.medicalHistory[0].date, 'Medical Records', 'medicalHistory.0.date')}
              </div>
            </div>

            {/* Social History */}
            <div className="space-y-4">
              <h2 className="text-base font-medium text-gray-900">Social History</h2>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">* Description</label>
                {renderEditableField('socialHistory', editedData.socialHistory, 'Social History Form', 'socialHistory')}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Smoking Status</label>
                {renderEditableField('smokingStatus', '', 'Social History Form', 'smokingStatus', true)}
              </div>
            </div>

            {/* Family History */}
            <div className="space-y-4">
              <h2 className="text-base font-medium text-gray-900">Family History</h2>

              {editedData.familyHistory.map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">* Relation</label>
                    {renderEditableField(`familyRelation${index}`, item.relation, 'Family History Form', `familyHistory.${index}.relation`)}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">* Condition</label>
                    {renderEditableField(`familyCondition${index}`, item.condition, 'Family History Form', `familyHistory.${index}.condition`)}
                  </div>
                </div>
              ))}

              {/* Empty State Example */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Relation</label>
                  {renderEditableField('emptyRelation', '', 'Family History Form', 'emptyRelation', true)}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Condition</label>
                  {renderEditableField('emptyCondition', '', 'Family History Form', 'emptyCondition', true)}
                </div>
              </div>
            </div>
          </div>

          {/* Source Document Panel */}
          <div className="w-1/2 border-l border-gray-200 bg-white flex flex-col">
            {showSource ? (
              <div className="flex-1 flex flex-col">
                {/* Source Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{currentField} - Source Document</h3>
                      <p className="text-xs text-gray-500 mt-1">{currentFieldIsEmpty ? 'No source available' : 'Patient Registration Form'}</p>
                    </div>
                    <button
                      onClick={() => setShowSource(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Document Content */}
                <div className="flex-1 p-4 overflow-auto bg-gray-100">
                  {currentFieldIsEmpty ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-500 mb-1">No source document available</p>
                        <p className="text-xs text-gray-400">This field has no associated source data</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded shadow-sm">
                      <img
                        src="/med-source.png"
                        alt="Source Document"
                        className="w-full h-auto"
                        style={{ maxHeight: 'none' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-500">Select a field to view its source</p>
                  <p className="text-xs text-gray-400 mt-1">{isVerified ? 'This patient record has been verified' : 'Click on any field to see the source document'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm font-medium"
              >
                Close
              </button>
              {!isVerified && (
                <button
                  onClick={handleSaveAndVerifyAll}
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

  // OverviewPage has been moved to OverviewPage.tsx

  const FilesPage = () => {
    const [files, setFiles] = React.useState([
      {
        id: 3,
        name: 'Riverton Hospital - Records',
        type: 'Medical Records',
        uploadedDate: '09/16/2025 13:13',
        size: '139.69 MB',
        extractionsToReview: 12,
        icon: '📄'
      },
      {
        id: 4,
        name: '2025.02.22 Update from Brian',
        type: 'Letter',
        uploadedDate: '09/16/2025 13:13',
        size: '1.41 MB',
        extractionsToReview: 0,
        icon: '📄'
      },
      {
        id: 5,
        name: 'Brian Holyoke EMG results',
        type: 'Medical Test',
        uploadedDate: '09/16/2025 13:13',
        size: '881.94 KB',
        extractionsToReview: 3,
        icon: '📄'
      },
      {
        id: 6,
        name: 'accident_report_202530700_Aug-3-8-12-AM',
        type: 'Accident Report',
        uploadedDate: '09/16/2025 13:13',
        size: '67.28 KB',
        extractionsToReview: 0,
        icon: '📄'
      },
      {
        id: 7,
        name: '2025.01.02 Letter to Social Security',
        type: 'Letter',
        uploadedDate: '09/16/2025 13:13',
        size: '526.82 KB',
        extractionsToReview: 2,
        icon: '📄'
      },
      {
        id: 8,
        name: 'Accident time line 2',
        type: 'Accident Report',
        uploadedDate: '09/16/2025 13:13',
        size: '477.70 KB',
        extractionsToReview: 0,
        icon: '📄'
      },
      {
        id: 9,
        name: 'Intmtn Spine Institute - Bills',
        type: 'Medical Bill',
        uploadedDate: '09/16/2025 13:13',
        size: '38.54 KB',
        extractionsToReview: 8,
        icon: '📄'
      },
      {
        id: 10,
        name: 'Unified Fire Authority - Records',
        type: 'Medical Records',
        uploadedDate: '09/16/2025 13:13',
        size: '144.56 KB',
        extractionsToReview: 0,
        icon: '📄'
      }
    ]);

    const [editingType, setEditingType] = React.useState<number | null>(null);
    const [newType, setNewType] = React.useState('');

    const handleTypeEdit = (fileId: number, currentType: string) => {
      setEditingType(fileId);
      setNewType(currentType);
    };

    const handleTypeSave = (fileId: number) => {
      const currentFile = files.find(f => f.id === fileId);
      if (currentFile && newType !== currentFile.type && newType.trim()) {
        const shouldRegenerate = window.confirm(
          `Document classification changed from "${currentFile.type}" to "${newType}". Would you like Supio to regenerate the extractions based on this new classification?`
        );

        setFiles(files.map(file =>
          file.id === fileId
            ? { ...file, type: newType.trim() }
            : file
        ));

        if (shouldRegenerate) {
          console.log(`Regenerating extractions for file ${fileId} with new type: ${newType}`);
          // Here you would call the API to regenerate extractions
        }
      }
      setEditingType(null);
      setNewType('');
    };

    const handleTypeCancel = () => {
      setEditingType(null);
      setNewType('');
    };

    const documentTypes = [
      'Medical Records',
      'Medical Bill',
      'Medical Test',
      'Accident Report',
      'Letter',
      'Insurance Document',
      'Legal Document',
      'Other'
    ];

    return (
      <div className="w-full bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">All Files</h2>
              <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                {files.length}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Uploaded</option>
                <option>Generated</option>
                <option>All</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs bg-white">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-2 font-medium text-gray-700 w-56">Name</th>
                <th className="text-left p-2 font-medium text-gray-700 w-24">Type</th>
                <th className="text-left p-2 font-medium text-gray-700 w-32">Uploaded</th>
                <th className="text-left p-2 font-medium text-gray-700 w-24">Size</th>
                <th className="text-left p-2 font-medium text-gray-700 w-32">Status</th>
                <th className="text-left p-2 font-medium text-gray-700 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-2">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm">{file.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{file.name}</div>
                        {file.type === 'Generated' && (
                          <div className="flex items-center mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              Generated
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-gray-900">
                    {editingType === file.id ? (
                      <div className="flex items-center gap-1">
                        <select
                          value={newType}
                          onChange={(e) => setNewType(e.target.value)}
                          onBlur={() => handleTypeSave(file.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleTypeSave(file.id);
                            if (e.key === 'Escape') handleTypeCancel();
                          }}
                          className="text-xs border border-gray-300 rounded px-1 py-0.5 w-32 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus
                        >
                          {documentTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTypeEdit(file.id, file.type)}
                        className="text-left hover:bg-gray-100 px-1 py-0.5 rounded transition-colors w-full"
                      >
                        {file.type}
                      </button>
                    )}
                  </td>
                  <td className="p-2 text-gray-500">{file.uploadedDate}</td>
                  <td className="p-2 text-gray-500">{file.size}</td>
                  <td className="p-2">
                    {file.extractionsToReview > 0 ? (
                      <button
                        className="px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-80 bg-orange-100 text-orange-800"
                        onClick={() => {
                          // Handle click to navigate to extractions
                          console.log(`Navigate to ${file.extractionsToReview} extractions for ${file.name}`);
                        }}
                      >
                        {file.extractionsToReview} extractions to review
                      </button>
                    ) : (
                      <button
                        className="px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-80 bg-green-100 text-green-800"
                        onClick={() => {
                          // Handle click for completed files
                          console.log(`File ${file.name} is complete`);
                        }}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                  <td className="p-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <span className="sr-only">More options</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">2</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">3</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">4</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="text-sm text-gray-500 ml-2">25 / page</span>
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
                  if (item.id === 'overview') {
                    setCurrentPage('overview');
                  } else if (item.id === 'damages') {
                    setCurrentPage('damages');
                  } else if (item.id === 'medicals') {
                    setCurrentPage('injuries');
                  } else if (item.id === 'files') {
                    setCurrentPage('files');
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
          {currentPage === 'overview' ? (
            <OverviewPage />
          ) : currentPage === 'files' ? (
            <FilesPage />
          ) : currentPage === 'damages' ? (
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