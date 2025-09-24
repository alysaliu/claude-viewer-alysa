import React, { useState, useEffect } from 'react';
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

// Simple Patient Detail View Component
const PatientDetailView = ({ patientData, onBack, onSave }: {
  patientData: any;
  onBack: () => void;
  onSave: (data: any) => void;
}) => {
  const [editData, setEditData] = useState(patientData);

  return (
    <div className="w-full bg-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-blue-600 text-sm flex items-center gap-2">
            ← Back to Overview
          </button>
          <button
            onClick={() => onSave(editData)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
        <h1 className="text-lg font-semibold mb-4">Edit Patient Information</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={editData.gender}
              onChange={(e) => setEditData({...editData, gender: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="text"
              value={editData.dateOfBirth}
              onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State of Residence</label>
            <input
              type="text"
              value={editData.stateOfResidence}
              onChange={(e) => setEditData({...editData, stateOfResidence: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Injury Detail View Component
const InjuryDetailView = ({ record, onBack, onSave }: {
  record: MedicalRecord;
  onBack: () => void;
  onSave: (data: any) => void;
}) => {
  const [editData, setEditData] = useState(record);

  return (
    <div className="w-full bg-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-blue-600 text-sm flex items-center gap-2">
            ← Back to Overview
          </button>
          <button
            onClick={() => onSave(editData)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
        <h1 className="text-lg font-semibold mb-4">Edit {record.injury}</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Narrative</label>
            <textarea
              value={editData.narrative}
              onChange={(e) => setEditData({...editData, narrative: e.target.value})}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={editData.status}
              onChange={(e) => setEditData({...editData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Verified">Verified</option>
              <option value="Unverified">Unverified</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewPage = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [, setIsLoading] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState<string>('overview');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    const stages = [
      { delay: 800, stage: 1 }, // AI Chat loads
      { delay: 2000, stage: 2 }, // Basic patient info loads
      { delay: 3500, stage: 3 }, // Medical history loads
      { delay: 5000, stage: 4 }, // Social history loads
      { delay: 6500, stage: 5 }, // Family history loads
      { delay: 8000, stage: 6 }, // Insights load
      { delay: 9000, stage: 7 }  // Complete
    ];

    stages.forEach(({ delay, stage }) => {
      setTimeout(() => {
        setLoadingStage(stage);
        if (stage === 7) {
          setIsLoading(false);
        }
      }, delay);
    });
  }, []);

  const patientData = {
    name: 'Brian Wayne Holyoke',
    gender: 'Male',
    dateOfBirth: '10/05/1966 (age 58 years)',
    stateOfResidence: 'UT',
    medicalHistory: [
      { description: 'Pulmonary emboli\nSuspected disease caused by 2019-nCoV', date: '05/29/2020' }
    ],
    socialHistory: 'Alcohol used\nNever smoker',
    familyHistory: [
      { relation: 'Mother', condition: 'Cancer, Lymphoma, Osteoporosis' },
      { relation: 'Father', condition: 'Diabetes mellitus, Osteoporosis' },
      { relation: 'Sibling', condition: 'Diabetes mellitus, Heart attack,\nParkinson\'s, Osteoporosis' }
    ],
    insights: {
      dateOfIncident: '08/03/2023',
      locationOfIncident: 'I-15 southbound off-ramp to 7200 South in Midvale, Utah',
      descriptionOfIncident: 'On August 3, 2023, at approximately 9:15 AM, a multi-vehicle collision occurred at the I-15 southbound off-ramp to 7200 South in Midvale, Utah. Kamron Scott Clark, driving a 2015 Freightliner delivery box truck owned by DS Services of America, Inc., experienced brake failure while exiting the freeway. In an attempt to slow the truck, he steered it into a concrete wall but was unable to stop. The truck collided with a 2016 Ford Focus driven by Gary L. Wood, who was stopped at the red light, and then rear-ended a 2018 Honda CR-V driven by Brian Wayne Holyoke, who was also stopped at the light. The truck eventually came to a stop after hitting a crash cushion in the median.'
    }
  };

  const handleEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleBackToOverview = () => {
    setEditingSection(null);
  };

  const handleSave = (data: any) => {
    console.log('Saving data:', data);
    setEditingSection(null);
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

  // If editing a section, show the appropriate detail view
  if (editingSection === 'patient') {
    return (
      <PatientDetailView
        patientData={patientData}
        onBack={handleBackToOverview}
        onSave={handleSave}
      />
    );
  } else if (editingSection === 'insights') {
    const mockRecord: MedicalRecord = {
      id: 1,
      date: patientData.insights.dateOfIncident,
      injury: 'Case Insights',
      status: 'Unverified',
      icdCode: patientData.insights.locationOfIncident,
      narrative: patientData.insights.descriptionOfIncident,
      anatomicalLocation: patientData.name,
      treatment: patientData.gender,
      treatmentStatus: patientData.dateOfBirth,
      critical: patientData.stateOfResidence,
      diagnosis: `Medical: ${patientData.medicalHistory[0].description}; Social: ${patientData.socialHistory}`
    };

    return (
      <InjuryDetailView
        record={mockRecord}
        onBack={handleBackToOverview}
        onSave={handleSave}
      />
    );
  } else if (editingSection) {
    const mockRecord: MedicalRecord = {
      id: 1,
      date: '08/03/2023',
      injury: editingSection === 'medical' ? 'Medical History' : editingSection === 'social' ? 'Social History' : 'Family History',
      status: 'Unverified',
      icdCode: 'N/A',
      narrative: 'Detailed information for ' + editingSection,
      anatomicalLocation: 'N/A',
      treatment: 'N/A',
      treatmentStatus: 'N/A',
      critical: 'No',
      diagnosis: 'N/A'
    };

    return (
      <InjuryDetailView
        record={mockRecord}
        onBack={handleBackToOverview}
        onSave={handleSave}
      />
    );
  }

  const LoadingSkeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );

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
          <div className="w-full bg-white">
            <div className="p-4">
              {/* Full Width AI Chat Card */}
              <div className="mb-4">
          <div className="bg-white rounded border border-gray-200">
            <div className="flex items-center justify-between p-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                Chat with AI about this case
              </h3>
            </div>
            <div className="p-3">
              {loadingStage >= 1 ? (
                <>
                  <p className="text-xs text-gray-500 mb-3">Ask questions about Brian's medical history, incident details, or case insights</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask me anything about this case..."
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="px-3 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 flex items-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <LoadingSkeleton className="h-3 w-3/4" />
                  <LoadingSkeleton className="h-8 w-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-3 gap-4">
          {/* Patient Information Column */}
          <div>
            {/* Combined Patient Information Card */}
            <div className="bg-white rounded border border-gray-200">
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">Patient information</h3>
                <div className="flex items-center gap-2">
                  {loadingStage >= 5 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                      Has conflicts
                    </span>
                  )}
                  <button
                    onClick={() => handleEdit('patient')}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div className="p-3 space-y-4 text-xs">
                {/* Basic Info */}
                <div className="space-y-2">
                  <div><span className="text-gray-500">Name</span><br />{loadingStage >= 2 ? <span className="text-gray-900">{patientData.name}</span> : <LoadingSkeleton className="h-4 w-48" />}</div>
                  <div><span className="text-gray-500">Gender</span><br />{loadingStage >= 2 ? <span className="text-gray-900">{patientData.gender}</span> : <LoadingSkeleton className="h-4 w-20" />}</div>
                  <div><span className="text-gray-500">Date of birth</span><br />{loadingStage >= 2 ? <span className="text-gray-900">{patientData.dateOfBirth}</span> : <LoadingSkeleton className="h-4 w-56" />}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">State of residence</span>
                    <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0 0l4-4a4 4 0 00-5.656-5.656l-4 4a4 4 0 105.656 5.656l-1.102 1.102" />
                    </svg>
                    <br />{loadingStage >= 2 ? <span className="text-gray-900">{patientData.stateOfResidence}</span> : <LoadingSkeleton className="h-4 w-8" />}
                  </div>
                </div>

                {/* Medical History */}
                <div className="border-t border-gray-100 pt-3">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1 mb-2">
                    Medical history
                    <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0 0l4-4a4 4 0 00-5.656-5.656l-4 4a4 4 0 105.656 5.656l-1.102 1.102" />
                    </svg>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-500 mb-1">Description</div>
                      {loadingStage >= 3 ? (
                        <div className="text-gray-900 whitespace-pre-line">{patientData.medicalHistory[0].description}</div>
                      ) : (
                        <LoadingSkeleton className="h-12 w-full" />
                      )}
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Date</div>
                      {loadingStage >= 3 ? (
                        <div className="text-gray-900">{patientData.medicalHistory[0].date}</div>
                      ) : (
                        <LoadingSkeleton className="h-4 w-24" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Social History */}
                <div className="border-t border-gray-100 pt-3">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1 mb-2">
                    Social history
                    <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0 0l4-4a4 4 0 00-5.656-5.656l-4 4a4 4 0 105.656 5.656l-1.102 1.102" />
                    </svg>
                  </h4>
                  <div>
                    <div className="text-gray-500 mb-1">Description</div>
                    {loadingStage >= 4 ? (
                      <div className="text-gray-900 whitespace-pre-line">{patientData.socialHistory}</div>
                    ) : (
                      <LoadingSkeleton className="h-8 w-full" />
                    )}
                  </div>
                </div>

                {/* Family History */}
                <div className="border-t border-gray-100 pt-3">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1 mb-2">
                    Family history
                    <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0 0l4-4a4 4 0 00-5.656-5.656l-4 4a4 4 0 105.656 5.656l-1.102 1.102" />
                    </svg>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-gray-500">Relation</div>
                    <div className="text-gray-500">Condition</div>
                    {loadingStage >= 5 ? (
                      patientData.familyHistory.map((item, index) => (
                        <React.Fragment key={index}>
                          <div className="text-gray-900">{item.relation}</div>
                          <div className="text-gray-900 whitespace-pre-line">{item.condition}</div>
                        </React.Fragment>
                      ))
                    ) : (
                      <>
                        <LoadingSkeleton className="h-4 w-16" />
                        <LoadingSkeleton className="h-4 w-full" />
                        <LoadingSkeleton className="h-4 w-16" />
                        <LoadingSkeleton className="h-4 w-full" />
                        <LoadingSkeleton className="h-4 w-16" />
                        <LoadingSkeleton className="h-4 w-full" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Column */}
          <div>
            <div className="bg-white rounded border border-gray-200">
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">Insights</h3>
                {loadingStage >= 6 && (
                  <button
                    onClick={() => handleEdit('insights')}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="p-3 space-y-3 text-xs">
                <div>
                  <div className="text-gray-500 mb-1 flex items-center gap-1">
                    Date of incident
                    <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0 0l4-4a4 4 0 00-5.656-5.656l-4 4a4 4 0 105.656 5.656l-1.102 1.102" />
                    </svg>
                  </div>
                  {loadingStage >= 6 ? (
                    <div className="text-gray-900">{patientData.insights.dateOfIncident}</div>
                  ) : (
                    <LoadingSkeleton className="h-4 w-32" />
                  )}
                </div>
                <div>
                  <div className="text-gray-500 mb-1 flex items-center gap-1">
                    Location of incident
                    <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0 0l4-4a4 4 0 00-5.656-5.656l-4 4a4 4 0 105.656 5.656l-1.102 1.102" />
                    </svg>
                  </div>
                  {loadingStage >= 6 ? (
                    <div className="text-gray-900">{patientData.insights.locationOfIncident}</div>
                  ) : (
                    <LoadingSkeleton className="h-4 w-full" />
                  )}
                </div>
                <div>
                  <div className="text-gray-500 mb-1 flex items-center gap-1">
                    Description of incident
                    <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0 0l4-4a4 4 0 00-5.656-5.656l-4 4a4 4 0 105.656 5.656l-1.102 1.102" />
                    </svg>
                  </div>
                  {loadingStage >= 6 ? (
                    <div className="text-gray-900 text-xs leading-relaxed">{patientData.insights.descriptionOfIncident}</div>
                  ) : (
                    <LoadingSkeleton className="h-16 w-full" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Case Status Column */}
          <div>
            <div className="bg-white rounded border border-gray-200">
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">Case status</h3>
              </div>
              <div className="p-3">
                <div className="space-y-2 text-xs">
                  <div className="text-gray-900">Files</div>
                  <div className="text-gray-900">Chat</div>
                  <div className="text-gray-900">Incident timeline</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">Case summary</span>
                    {loadingStage < 7 && (
                      <div className="animate-spin h-3 w-3 border border-gray-300 border-t-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-gray-900">Medical records</div>
                  <div className="text-gray-900">Treatment history</div>
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
};

export default OverviewPage;