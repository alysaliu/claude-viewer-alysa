import React from 'react';
import { Plus, FileText, X } from 'lucide-react';

// Import organized components and hooks
import BlueprintListView from './blueprint-builder/components/views/BlueprintListView';
import BlueprintBuilderView from './blueprint-builder/components/views/BlueprintBuilderView';
import { useBlueprintState } from './blueprint-builder/hooks/useBlueprintState';
import { useDocumentGeneration } from './blueprint-builder/hooks/useDocumentGeneration';
import { sampleBlueprints } from './blueprint-builder/data/sample-data';
import type { Blueprint, UnderlayFile } from './blueprint-builder/types/blueprint-types';

const BlueprintBuilderRefactored = () => {
  const blueprintState = useBlueprintState();
  const { isGenerating, generatedContent, generateDocument } = useDocumentGeneration();

  const handleCreateNew = () => {
    blueprintState.setBlueprintName('New Blueprint');
    blueprintState.setBlueprintDescription('');
    blueprintState.setSections([]);
    blueprintState.setSelectedCase('');
    blueprintState.setUnderlayFile(null);
    blueprintState.setCurrentView('builder');
  };

  const handleSelectBlueprint = (blueprint: Blueprint) => {
    blueprintState.setCurrentBlueprintId(blueprint.id);
    blueprintState.setBlueprintName(blueprint.name);
    blueprintState.setBlueprintDescription(blueprint.description);
    if (blueprint.sections) {
      blueprintState.setSections(blueprint.sections);
    }
    if (blueprint.selectedCase) {
      blueprintState.setSelectedCase(blueprint.selectedCase);
    }
    if (blueprint.underlayFile) {
      blueprintState.setUnderlayFile(blueprint.underlayFile);
    }
    blueprintState.setCurrentView('builder');
  };

  const handleGenerate = () => {
    generateDocument(
      blueprintState.blueprintName,
      blueprintState.selectedCase,
      blueprintState.sections,
      blueprintState.setShowPreview
    );
  };

  const handleUnderlayUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.docx')) {
      // Simulate analyzing the file for section tags
      const mockFoundTags = blueprintState.sections.slice(0, Math.floor(blueprintState.sections.length * 0.7)).map(s => s.tag);
      
      blueprintState.setUnderlayFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        uploadedAt: new Date().toLocaleString(),
        foundTags: mockFoundTags
      });
    }
  };

  const UnderlayModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Configure Default Underlay Document</h2>
          <button
            onClick={() => blueprintState.setShowUnderlayModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!blueprintState.underlayFile ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-6 max-w-[75%] mx-auto">
                Upload a .docx template file that contains section tags to map your blueprint content. This will be used as the default underlay for document generation.
              </p>
              
              <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
                <input
                  type="file"
                  accept=".docx"
                  onChange={handleUnderlayUpload}
                  className="hidden"
                />
              </label>
              
              <div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">How it works:</h3>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Copy section tags from your blueprint (e.g., SEC_ABC123)</li>
                  <li>Place these tags in your .docx template where content should appear</li>
                  <li>Upload the template here to link sections to document locations</li>
                  <li>Generated content will replace the tags in your template</li>
                </ol>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <div>
                      <button
                        onClick={() => blueprintState.setShowUnderlayPreview(true)}
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {blueprintState.underlayFile.name}
                      </button>
                      <p className="text-sm text-gray-500">
                        {blueprintState.underlayFile.size} • Uploaded {blueprintState.underlayFile.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => blueprintState.setUnderlayFile(null)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Section Mapping Status</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {blueprintState.sections.map((section, index) => {
                    const isFound = blueprintState.underlayFile?.foundTags.includes(section.tag);
                    return (
                      <div
                        key={section.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isFound ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500">
                            {index + 1}.
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{section.name}</p>
                            <p className="text-sm text-gray-500">Tag: {section.tag}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isFound ? (
                            <span className="flex items-center text-sm text-green-700">
                              <span className="w-4 h-4 mr-1">✓</span>
                              Found
                            </span>
                          ) : (
                            <span className="flex items-center text-sm text-red-700">
                              <X className="w-4 h-4 mr-1" />
                              Not found
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {blueprintState.sections.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No sections created yet. Add sections to your blueprint first.
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <label className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer">
                  Replace Document
                  <input
                    type="file"
                    accept=".docx"
                    onChange={handleUnderlayUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (blueprintState.currentView === 'list') {
    return (
      <BlueprintListView 
        onCreateNew={handleCreateNew}
        onSelectBlueprint={handleSelectBlueprint}
      />
    );
  }

  return (
    <>
      <BlueprintBuilderView
        blueprintName={blueprintState.blueprintName}
        setBlueprintName={blueprintState.setBlueprintName}
        blueprintDescription={blueprintState.blueprintDescription}
        setBlueprintDescription={blueprintState.setBlueprintDescription}
        showEditDetailsModal={blueprintState.showEditDetailsModal}
        setShowEditDetailsModal={blueprintState.setShowEditDetailsModal}
        sections={blueprintState.sections}
        selectedCase={blueprintState.selectedCase}
        setSelectedCase={blueprintState.setSelectedCase}
        showPreview={blueprintState.showPreview}
        setShowPreview={blueprintState.setShowPreview}
        generatedContent={generatedContent}
        isGenerating={isGenerating}
        underlayFile={blueprintState.underlayFile}
        onBack={() => blueprintState.setCurrentView('list')}
        onGenerate={handleGenerate}
        onConfigureUnderlay={() => blueprintState.setShowUnderlayModal(true)}
        addSection={blueprintState.addSection}
        updateSectionName={blueprintState.updateSectionName}
        deleteSection={blueprintState.deleteSection}
        toggleSection={blueprintState.toggleSection}
        moveSection={blueprintState.moveSection}
        addStep={blueprintState.addStep}
        updateStep={blueprintState.updateStep}
        updateStepParameter={blueprintState.updateStepParameter}
        deleteStep={blueprintState.deleteStep}
      />

      {/* Modals */}
      {blueprintState.showUnderlayModal && <UnderlayModal />}
    </>
  );
};

export default BlueprintBuilderRefactored;