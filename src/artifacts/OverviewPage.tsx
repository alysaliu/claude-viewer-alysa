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

// Detailed Patient Detail View Component that matches the design
const PatientDetailView = ({ patientData, onBack, onSave }: {
  patientData: any;
  onBack: () => void;
  onSave: (data: any) => void;
}) => {
  const [editedData, setEditedData] = React.useState(patientData);
  const [showSource, setShowSource] = React.useState(true);

  const handleFieldChange = (field: string, value: string) => {
    setEditedData({ ...editedData, [field]: value });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Patient Information</h1>
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-500">Last updated by Supio AI on 9/25/25 | 0 edits made by Alysa Liu</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSave(editedData)}
              className="px-4 py-2 bg-teal-700 text-white text-sm rounded hover:bg-teal-800"
            >
              Save
            </button>
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-1/2 overflow-auto p-6 space-y-6">
          {/* Basic Patient Information */}
          <div className="space-y-4">
            <h2 className="text-base font-medium text-gray-900">Basic Information</h2>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">* Name</label>
              <input
                type="text"
                value={editedData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">* Gender</label>
              <input
                type="text"
                value={editedData.gender}
                onChange={(e) => handleFieldChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                * Date of Birth
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                  Conflict
                </span>
              </label>
              <input
                type="text"
                value={editedData.dateOfBirth}
                onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="mt-1 text-xs text-orange-600">Alternative value: 10/05/66</div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">* State of Residence</label>
              <input
                type="text"
                value={editedData.stateOfResidence}
                onChange={(e) => handleFieldChange('stateOfResidence', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Missing required data"
              />
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-4">
            <h2 className="text-base font-medium text-gray-900">Medical History</h2>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">* Description</label>
              <textarea
                value={editedData.medicalHistory?.[0]?.description || ''}
                onChange={(e) => {
                  const newHistory = [...(editedData.medicalHistory || [])];
                  if (newHistory[0]) {
                    newHistory[0].description = e.target.value;
                  } else {
                    newHistory[0] = { description: e.target.value, date: '' };
                  }
                  setEditedData({ ...editedData, medicalHistory: newHistory });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">* Date</label>
              <input
                type="text"
                value={editedData.medicalHistory?.[0]?.date || ''}
                onChange={(e) => {
                  const newHistory = [...(editedData.medicalHistory || [])];
                  if (newHistory[0]) {
                    newHistory[0].date = e.target.value;
                  } else {
                    newHistory[0] = { description: '', date: e.target.value };
                  }
                  setEditedData({ ...editedData, medicalHistory: newHistory });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Source Document */}
        <div className="w-1/2 border-l border-gray-200 bg-white flex flex-col">
          {showSource ? (
            <div className="flex-1 flex flex-col">
              {/* Source Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Source: Physician's Note</h3>
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

              {/* Source Content */}
              <div className="flex-1 p-4 overflow-auto">
                <div className="text-xs leading-relaxed">
                  <div className="mb-4">
                    <div className="font-medium">PATIENT NAME: Holyoke, Bryan</div>
                    <div>DOS: 08/29/2018</div>
                  </div>

                  <div className="mb-4">
                    <div className="font-medium mb-2">HISTORY:</div>
                    <div>This is a 51-year-old male who comes to us complaining of pain in the left leg also. He injured himself on 08/19/2018 while playing golf. He thinks he may have twisted his left knee. He woke up that night in the lot of pain. He got a brace to use, but he does not feel that the brace is helping him. He is complaining of swelling in his left leg also.</div>
                  </div>

                  <div className="mb-4">
                    <div className="font-medium mb-2">PHYSICAL EXAMINATION:</div>
                    <div>This is a well-developed, very overweight male in mild distress. It is obvious that he has a very antalgic gait with a short stance phase on the left knee. There is 2+ edema of the left knee. The point of maximum tenderness is over the lateral joint line. There is also edema of the lower extremity below the knee probably from the brace being too tight. He moves his ankle well and has no pain in the lower leg.</div>
                  </div>

                  <div className="mb-4">
                    <div>Provocative testing reveals a negative Lachman test. There is a positive McMurray test of the left knee and a positive Apley's test. I do not feel any significant clicking however. Neurologically he is intact.</div>
                  </div>

                  <div className="mb-4">
                    <div className="font-medium mb-2">IMPRESSION:</div>
                    <div>I am very concerned this gentleman has torn the lateral meniscus of his left knee. He is a right-handed golfer and he puts a torque on his left knee when he swings.</div>
                  </div>

                  <div className="mb-4">
                    <div className="font-medium mb-2">RECOMMENDATIONS:</div>
                    <div>I would definitely recommend an MRI of the left knee to investigate this further. He will have the MRI performed and then we will recheck him in the office to see if our fears are confirmed.</div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div>John D. Sonnenberg M.D.</div>
                    <div>JS/ZOD/PR</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-sm">No source selected</div>
                <button
                  onClick={() => setShowSource(true)}
                  className="text-blue-600 text-xs mt-2 hover:text-blue-800"
                >
                  Show source document
                </button>
              </div>
            </div>
          )}
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
    console.log('handleEdit called with:', section);
    console.log('Current editingSection before:', editingSection);
    setEditingSection(section);
    console.log('Setting editingSection to:', section);
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

  // If editing insights section, show detail view (keeping existing behavior)
  if (editingSection === 'insights') {
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
      <PatientDetailView
        record={mockRecord}
        onBack={handleBackToOverview}
        onSave={handleSave}
      />
    );
  } else if (editingSection && editingSection !== 'patient') {
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
      <PatientDetailView
        patientData={mockRecord}
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

      {/* Patient Detail Drawer - ALWAYS show for debugging */}
      {editingSection === 'patient' && (
        <>
          <div className="fixed inset-0 z-[60] overflow-hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleBackToOverview}></div>
            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-2/3 bg-white shadow-xl transform translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto">
              <PatientDetailView
                patientData={patientData}
                onBack={handleBackToOverview}
                onSave={handleSave}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OverviewPage;