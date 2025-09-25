import React, { useState, useEffect } from 'react';
import { Home, BarChart2, Layers, PenTool, ChevronDown, MoreVertical, Bell, Briefcase, Activity, DollarSignIcon } from 'lucide-react';


// Detailed Patient Detail View Component that matches the design
const PatientDetailView = ({ patientData, onBack, onSave }: {
  patientData: any;
  onBack: () => void;
  onSave: (data: any) => void;
}) => {
  const [editedData, setEditedData] = React.useState(patientData);
  const [originalData, setOriginalData] = React.useState(patientData);
  const [showSource, setShowSource] = React.useState(false);
  const [currentField, setCurrentField] = React.useState('');
  const [modifiedFields, setModifiedFields] = React.useState<Set<string>>(new Set());
  const [dateOfBirthConflict, setDateOfBirthConflict] = React.useState(true);
  const [alternativeDateOfBirth, setAlternativeDateOfBirth] = React.useState("10/05/66");

  const handleFieldChange = (field: string, value: string) => {
    const newData = { ...editedData, [field]: value };
    setEditedData(newData);

    // Track which fields have been modified
    const newModifiedFields = new Set(modifiedFields);
    if (getFieldValue(originalData, field) !== value) {
      newModifiedFields.add(field);
    } else {
      newModifiedFields.delete(field);
    }
    setModifiedFields(newModifiedFields);
  };

  const getFieldValue = (data: any, fieldPath: string): any => {
    if (fieldPath.includes('.')) {
      const parts = fieldPath.split('.');
      let value = data;
      for (const part of parts) {
        if (part.includes('[') && part.includes(']')) {
          const [arrayName, indexStr] = part.split('[');
          const index = parseInt(indexStr.replace(']', ''));
          value = value[arrayName]?.[index];
        } else {
          value = value[part];
        }
      }
      return value;
    }
    return data[fieldPath];
  };

  const handleCancelChanges = () => {
    setEditedData(originalData);
    setModifiedFields(new Set());
  };

  const handleSave = () => {
    // Save the changes by calling the parent's onSave function
    onSave(editedData);

    // Update the original data to match the saved data
    setOriginalData(editedData);

    // Clear the modified fields since everything is now saved
    setModifiedFields(new Set());
  };

  const resolveDateOfBirthConflict = (selectedValue: string) => {
    // Update the main dateOfBirth field with the selected value
    const newData = { ...editedData, dateOfBirth: selectedValue };
    setEditedData(newData);

    // Mark the field as modified
    const newModifiedFields = new Set(modifiedFields);
    newModifiedFields.add('dateOfBirth');
    setModifiedFields(newModifiedFields);

    // Remove the conflict state
    setDateOfBirthConflict(false);
  };

  const handleFieldClick = (fieldName: string) => {
    setCurrentField(fieldName);
    setShowSource(true);
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
            {modifiedFields.size > 0 && (
              <button
                onClick={handleCancelChanges}
                className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
              >
                Cancel All Changes
              </button>
            )}
            <button
              onClick={handleSave}
              className={`px-4 py-2 text-white text-sm rounded ${
                modifiedFields.size > 0
                  ? 'bg-teal-700 hover:bg-teal-800'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={modifiedFields.size === 0}
            >
              {modifiedFields.size > 0 ? `Save Changes (${modifiedFields.size})` : 'Save'}
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
        <div className="w-1/2 overflow-auto p-4 space-y-4">
          {/* Basic Patient Information */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h2>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">* Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onClick={() => handleFieldClick('Name')}
                  className="w-full px-2 py-1.5 pr-7 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 cursor-pointer"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                  <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Updated by Alysa Liu on 9/20/25
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">* Gender</label>
              <div className="relative">
                <input
                  type="text"
                  value={editedData.gender}
                  onChange={(e) => handleFieldChange('gender', e.target.value)}
                  onClick={() => handleFieldClick('Gender')}
                  className="w-full px-2 py-1.5 pr-7 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 cursor-pointer"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                  <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Updated by Supio AI on 8/15/23
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-1">
                * Date of Birth
                {dateOfBirthConflict && (
                  <span className="text-xs font-medium text-orange-600">
                    Has Conflict
                  </span>
                )}
              </label>
{dateOfBirthConflict ? (
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={editedData.dateOfBirth}
                      onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                      onClick={() => handleFieldClick('Date of Birth')}
                      className="w-full px-2 py-1.5 pr-14 border border-gray-300 bg-orange-50 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-orange-100 cursor-pointer"
                    />
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        onClick={() => resolveDateOfBirthConflict(editedData.dateOfBirth)}
                        className="p-0.5 text-gray-400 hover:text-green-500 cursor-pointer"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <div className="group/tooltip">
                        <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                        <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                          Updated by Supio AI on 9/25/25
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={alternativeDateOfBirth}
                      onChange={(e) => setAlternativeDateOfBirth(e.target.value)}
                      onClick={() => handleFieldClick('Alternative Date of Birth')}
                      className="w-full px-2 py-1.5 pr-14 border border-gray-300 bg-orange-50 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-orange-100 cursor-pointer"
                      placeholder="Alternative value"
                    />
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        onClick={() => resolveDateOfBirthConflict(alternativeDateOfBirth)}
                        className="p-0.5 text-gray-400 hover:text-green-500 cursor-pointer"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <div className="group/tooltip">
                        <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                        <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                          Alternative from Document B
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={editedData.dateOfBirth}
                    onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                    onClick={() => handleFieldClick('Date of Birth')}
                    className="w-full px-2 py-1.5 pr-7 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 cursor-pointer"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                    <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      Updated by Supio AI on 9/25/25
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5 flex items-center gap-1">
                * State of Residence
                <span className="text-xs font-medium text-red-600">
                  Missing
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={editedData.stateOfResidence}
                  onChange={(e) => handleFieldChange('stateOfResidence', e.target.value)}
                  onClick={() => handleFieldClick('State of Residence')}
                  className="w-full px-2 py-1.5 pr-7 border border-red-300 bg-red-50 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 hover:bg-red-100 cursor-pointer"
                  placeholder="Enter field"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                  <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Updated by Alysa Liu on 9/22/25
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Medical history</h2>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">* Description</label>
              <div className="relative">
                <textarea
                  value={editedData.medicalHistory?.[0]?.description || ''}
                  onChange={(e) => {
                    const newHistory = [...(editedData.medicalHistory || [])];
                    if (newHistory[0]) {
                      newHistory[0].description = e.target.value;
                    } else {
                      newHistory[0] = { description: e.target.value, date: '' };
                    }
                    const newData = { ...editedData, medicalHistory: newHistory };
                    setEditedData(newData);

                    // Track changes
                    const newModifiedFields = new Set(modifiedFields);
                    const originalValue = originalData.medicalHistory?.[0]?.description || '';
                    if (originalValue !== e.target.value) {
                      newModifiedFields.add('medicalHistory[0].description');
                    } else {
                      newModifiedFields.delete('medicalHistory[0].description');
                    }
                    setModifiedFields(newModifiedFields);
                  }}
                  onClick={() => handleFieldClick('Medical Description')}
                  className="w-full px-2 py-1.5 pr-7 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 cursor-pointer resize-none"
                  rows={2}
                  placeholder="Typing!"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                  <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Updated by Supio AI on 8/15/23
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">* Date</label>
              <div className="relative">
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
                    const newData = { ...editedData, medicalHistory: newHistory };
                    setEditedData(newData);

                    // Track changes
                    const newModifiedFields = new Set(modifiedFields);
                    const originalValue = originalData.medicalHistory?.[0]?.date || '';
                    if (originalValue !== e.target.value) {
                      newModifiedFields.add('medicalHistory[0].date');
                    } else {
                      newModifiedFields.delete('medicalHistory[0].date');
                    }
                    setModifiedFields(newModifiedFields);
                  }}
                  onClick={() => handleFieldClick('Medical Date')}
                  className="w-full px-2 py-1.5 pr-7 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 cursor-pointer"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                  <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Updated by Alysa Liu on 9/20/25
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social History */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Social history</h2>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">* Description</label>
              <div className="relative">
                <textarea
                  value={editedData.socialHistory || ''}
                  onChange={(e) => handleFieldChange('socialHistory', e.target.value)}
                  onClick={() => handleFieldClick('Social History')}
                  className="w-full px-2 py-1.5 pr-7 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 cursor-pointer resize-none"
                  rows={2}
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                  <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Updated by Supio AI on 8/20/23
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">Smoking Status</label>
              <div className="relative">
                <input
                  type="text"
                  onClick={() => handleFieldClick('Smoking Status')}
                  className="w-full px-2 py-1.5 pr-7 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 cursor-pointer"
                  placeholder="Enter field"
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                  <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Updated by Alysa Liu on 9/18/25
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Family History */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Family history</h2>

            {editedData.familyHistory?.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">* Relation</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={item.relation}
                      onChange={(e) => {
                        const newHistory = [...(editedData.familyHistory || [])];
                        newHistory[index] = { ...item, relation: e.target.value };
                        const newData = { ...editedData, familyHistory: newHistory };
                        setEditedData(newData);

                        // Track changes
                        const newModifiedFields = new Set(modifiedFields);
                        const originalValue = originalData.familyHistory?.[index]?.relation || '';
                        if (originalValue !== e.target.value) {
                          newModifiedFields.add(`familyHistory[${index}].relation`);
                        } else {
                          newModifiedFields.delete(`familyHistory[${index}].relation`);
                        }
                        setModifiedFields(newModifiedFields);
                      }}
                      onClick={() => handleFieldClick('Family Relation')}
                      className="w-full px-2 py-1.5 pr-7 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 cursor-pointer"
                    />
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                      <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                        Updated by Supio AI on 8/25/23
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">* Condition</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={item.condition}
                      onChange={(e) => {
                        const newHistory = [...(editedData.familyHistory || [])];
                        newHistory[index] = { ...item, condition: e.target.value };
                        const newData = { ...editedData, familyHistory: newHistory };
                        setEditedData(newData);

                        // Track changes
                        const newModifiedFields = new Set(modifiedFields);
                        const originalValue = originalData.familyHistory?.[index]?.condition || '';
                        if (originalValue !== e.target.value) {
                          newModifiedFields.add(`familyHistory[${index}].condition`);
                        } else {
                          newModifiedFields.delete(`familyHistory[${index}].condition`);
                        }
                        setModifiedFields(newModifiedFields);
                      }}
                      onClick={() => handleFieldClick('Family Condition')}
                      className="w-full px-2 py-1.5 pr-7 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 cursor-pointer"
                    />
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                      <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                        Updated by Alysa Liu on 9/15/25
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) || []}

            {/* Empty State Example */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">Relation</label>
                <div className="relative">
                  <input
                    type="text"
                    onClick={() => handleFieldClick('Family Relation')}
                    className="w-full px-2 py-1.5 pr-7 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 cursor-pointer"
                    placeholder="Enter field"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                    <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      Updated by Alysa Liu on 9/10/25
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">Condition</label>
                <div className="relative">
                  <input
                    type="text"
                    onClick={() => handleFieldClick('Family Condition')}
                    className="w-full px-2 py-1.5 pr-7 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 cursor-pointer"
                    placeholder="Enter field"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 group/tooltip">
                    <svg className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <div className="absolute top-full right-0 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      Updated by Supio AI on 9/12/25
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Source Document */}
        <div className="w-1/2 border-l border-gray-200 bg-white flex flex-col">
          {showSource ? (
            <div className="flex-1 flex flex-col">
              {/* Source Header */}
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {currentField ? `${currentField} - Source Document` : 'Source: Physician\'s Note'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Physician's Note</p>
                  </div>
                  <button
                    onClick={() => setShowSource(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >

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
              <div className="text-center px-8">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-gray-900 mb-2">No source document selected</div>
                <div className="text-xs text-gray-500 mb-4">Click on any field to view the source document where that information was extracted from.</div>
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
  const [currentExtractionText, setCurrentExtractionText] = useState(0);

  const extractionTexts = [
    "Supio AI is extracting information from the police report...",
    "Supio AI is extracting information from medical records...",
    "Supio AI is extracting information from witness statements...",
    "Supio AI is extracting information from insurance documents...",
    "Supio AI is extracting information from repair estimates...",
    "Supio AI is extracting information from EMT reports...",
    "Supio AI is extracting information from traffic citations...",
    "Supio AI is extracting information from hospital records..."
  ];

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

  // Cycle through extraction texts while loading
  useEffect(() => {
    const interval = setInterval(() => {
      if (loadingStage < 7) { // Only cycle while still loading
        setCurrentExtractionText((prev) => (prev + 1) % extractionTexts.length);
      }
    }, 1000); // Change text every 1 second

    return () => clearInterval(interval);
  }, [loadingStage, extractionTexts.length]);

  const patientData = {
    name: 'Brian Wayne Holyoke',
    gender: 'Male',
    dateOfBirth: '10/05/1966 (age 58 years)',
    stateOfResidence: 'No data found',
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

    // Update the patient data with the saved changes
    // This will persist the changes in the main component
    Object.assign(patientData, data);

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

  // No other editing sections are currently supported

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
          <div className="text-gray-500 text-xs">
            {loadingStage < 7
              ? extractionTexts[currentExtractionText]
              : "Supio AI has finished extracting data from your uploaded documents."
            }
          </div>
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