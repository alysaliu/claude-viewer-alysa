import React from 'react';
import { 
  ChevronLeft, FileText, Eye, Play, Edit2, Save, Check, X, Plus, 
  ChevronDown, ChevronRight, ChevronUp, Trash2, Copy 
} from 'lucide-react';
import { sampleCases, availableResources } from '../../data/sample-data';
import { useRichTextEditor } from '../../hooks/useRichTextEditor';
import RichTextToolbar from '../RichTextToolbar';
import StepEditor from '../StepEditor';
import ResourceParameters from '../ResourceParameters';
import type { Section, Step, UnderlayFile } from '../../types/blueprint-types';

interface BlueprintBuilderViewProps {
  // State
  blueprintName: string;
  setBlueprintName: (name: string) => void;
  blueprintDescription: string;
  setBlueprintDescription: (description: string) => void;
  showEditDetailsModal: boolean;
  setShowEditDetailsModal: (show: boolean) => void;
  sections: Section[];
  selectedCase: string;
  setSelectedCase: (caseId: string) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  generatedContent: string;
  isGenerating: boolean;
  underlayFile: UnderlayFile | null;
  
  // Actions
  onBack: () => void;
  onGenerate: () => void;
  onConfigureUnderlay: () => void;
  addSection: () => void;
  updateSectionName: (sectionId: number, name: string) => void;
  deleteSection: (sectionId: number) => void;
  toggleSection: (sectionId: number) => void;
  moveSection: (index: number, direction: 'up' | 'down') => void;
  addStep: (sectionId: number) => void;
  updateStep: (sectionId: number, stepId: number, updates: Partial<Step>) => void;
  updateStepParameter: (sectionId: number, stepId: number, paramId: string, value: any) => void;
  deleteStep: (sectionId: number, stepId: number) => void;
}

const BlueprintBuilderView: React.FC<BlueprintBuilderViewProps> = ({
  blueprintName,
  setBlueprintName,
  blueprintDescription,
  setBlueprintDescription,
  showEditDetailsModal,
  setShowEditDetailsModal,
  sections,
  selectedCase,
  setSelectedCase,
  showPreview,
  setShowPreview,
  generatedContent,
  isGenerating,
  underlayFile,
  onBack,
  onGenerate,
  onConfigureUnderlay,
  addSection,
  updateSectionName,
  deleteSection,
  toggleSection,
  moveSection,
  addStep,
  updateStep,
  updateStepParameter,
  deleteStep
}) => {
  const { activeTextStep, setActiveTextStep, textAreaRefs, copyToClipboard } = useRichTextEditor();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="text-gray-400 hover:text-gray-600"
                  title="Back to Blueprint Library"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900">Blueprint Builder</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium mr-6">{blueprintName}</span>
                <button
                  onClick={() => setShowEditDetailsModal(true)}
                  className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Details
                </button>
                <button className="px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              
              <button 
                onClick={onConfigureUnderlay}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Configure Default Underlay
                {underlayFile && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" />
                    Default Set
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2 border rounded-md flex items-center gap-2 transition-colors ${
                  showPreview 
                    ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <select
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a case...</option>
                {sampleCases.map(caseName => (
                  <option key={caseName} value={caseName}>{caseName}</option>
                ))}
              </select>
              
              <button
                onClick={onGenerate}
                disabled={!selectedCase || sections.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex" style={{height: 'calc(100vh - 4rem)'}}>
        {/* Builder Panel */}
        <div className={`px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 overflow-y-auto ${
          showPreview ? 'w-3/5' : 'w-full'
        }`}>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Document Structure</h2>
              <p className="mt-1 text-sm text-gray-500">Build your document by adding sections and steps</p>
            </div>

            <div className="p-6">
              {sections.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No sections yet. Add your first section to get started.</p>
                  <button
                    onClick={addSection}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {sections.map((section, index) => (
                    <div key={section.id} className="relative">
                      {/* Section divider line */}
                      {index > 0 && (
                        <div className="absolute -top-3 left-0 right-0 flex items-center justify-center">
                          <div className="bg-gray-200 h-px flex-1"></div>
                        </div>
                      )}

                      {/* Section header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {section.isExpanded ? 
                              <ChevronDown className="w-4 h-4" /> : 
                              <ChevronRight className="w-4 h-4" />
                            }
                          </button>
                          
                          <input
                            type="text"
                            value={section.name}
                            onChange={(e) => updateSectionName(section.id, e.target.value)}
                            className="flex-1 text-lg font-medium px-2 py-1 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                          />
                          
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <span className="font-mono">{section.tag}</span>
                            <button
                              onClick={() => copyToClipboard(section.tag)}
                              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                              title="Copy tag to clipboard"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => moveSection(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveSection(index, 'down')}
                              disabled={index === sections.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteSection(section.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Section steps */}
                      {section.isExpanded && (
                        <div className="ml-4 space-y-4">
                          {section.steps.map((step, stepIndex) => (
                            <StepEditor
                              key={step.id}
                              section={section}
                              step={step}
                              isFirst={stepIndex === 0}
                              stepIndex={stepIndex}
                              activeTextStep={activeTextStep}
                              setActiveTextStep={setActiveTextStep}
                              textAreaRefs={textAreaRefs}
                              updateStep={updateStep}
                              updateStepParameter={updateStepParameter}
                              deleteStep={deleteStep}
                            />
                          ))}
                          
                          <button
                            onClick={() => addStep(section.id)}
                            className="ml-11 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add Step
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={addSection}
                    className="w-full mt-6 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Section
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Preview Sidebar */}
        {showPreview && (
          <div className="w-2/5 bg-white shadow-xl border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-auto">
              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Generating document...</p>
                </div>
              ) : generatedContent ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap font-mono text-sm">{generatedContent}</div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No content generated yet</p>
                  <p className="text-sm text-gray-400">Select a case and click Generate to see a preview</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Details Modal */}
      {showEditDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Edit Blueprint Details</h2>
              <button
                onClick={() => setShowEditDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blueprint Name
                </label>
                <input
                  type="text"
                  value={blueprintName}
                  onChange={(e) => setBlueprintName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={blueprintDescription}
                  onChange={(e) => setBlueprintDescription(e.target.value)}
                  placeholder="Add a description for this blueprint..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEditDetailsModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditDetailsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlueprintBuilderView;