import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { availableResources } from '../data/sample-data';
import RichTextToolbar from './RichTextToolbar';
import ResourceParameters from './ResourceParameters';
import type { Section, Step } from '../types/blueprint-types';

interface StepEditorProps {
  section: Section;
  step: Step;
  isFirst: boolean;
  stepIndex: number;
  activeTextStep: number | null;
  setActiveTextStep: (stepId: number | null) => void;
  textAreaRefs: React.MutableRefObject<Record<number, HTMLTextAreaElement | null>>;
  updateStep: (sectionId: number, stepId: number, updates: Partial<Step>) => void;
  updateStepParameter: (sectionId: number, stepId: number, paramId: string, value: any) => void;
  deleteStep: (sectionId: number, stepId: number) => void;
}

const StepEditor: React.FC<StepEditorProps> = ({
  section,
  step,
  isFirst,
  stepIndex,
  activeTextStep,
  setActiveTextStep,
  textAreaRefs,
  updateStep,
  updateStepParameter,
  deleteStep
}) => {
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const resource = step.type === 'resource' && step.resourceId ? 
    availableResources.find(r => r.id === step.resourceId) : null;

  return (
    <div className="flex items-start gap-3 group">
      {/* Step number indicator */}
      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
        {stepIndex + 1}
      </div>

      {/* Step content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <select
            value={step.type}
            onChange={(e) => updateStep(section.id, step.id, { type: e.target.value as any, resourceId: undefined, parameters: {} })}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">Text</option>
            <option value="resource">Resource</option>
            <option value="prompt">Prompt</option>
          </select>

          {!isFirst && (
            <>
              <select
                value={step.action}
                onChange={(e) => updateStep(section.id, step.id, { action: e.target.value as any })}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="append">Append to</option>
                <option value="prepend">Prepend to</option>
                <option value="replace">Replace</option>
              </select>
              <span className="text-sm text-gray-500">previous content</span>
            </>
          )}

          <button
            onClick={() => deleteStep(section.id, step.id)}
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-600"
            disabled={section.steps.length === 1}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {step.type === 'text' ? (
          <div>
            {activeTextStep === step.id && (
              <RichTextToolbar 
                stepId={step.id} 
                textAreaRef={{ current: textAreaRefs.current[step.id] }} 
              />
            )}
            <textarea
              ref={(el) => textAreaRefs.current[step.id] = el}
              value={step.content || ''}
              onChange={(e) => updateStep(section.id, step.id, { content: e.target.value })}
              onFocus={() => setActiveTextStep(step.id)}
              onBlur={() => setActiveTextStep(null)}
              placeholder="Enter text content..."
              className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeTextStep === step.id ? 'rounded-b-md rounded-t-none' : 'rounded-md'
              }`}
              rows={3}
            />
          </div>
        ) : step.type === 'prompt' ? (
          <div>
            <textarea
              value={step.prompt || ''}
              onChange={(e) => updateStep(section.id, step.id, { prompt: e.target.value })}
              placeholder="Enter prompt to transform the current content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <p className="mt-2 text-xs text-gray-500">
              This prompt will be applied to the current working content of this section.
            </p>
          </div>
        ) : (
          <div>
            {resource ? (
              <div>
                <div className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-md">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = resource.icon;
                      return (
                        <>
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">{resource.name}</span>
                        </>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => updateStep(section.id, step.id, { resourceId: undefined, parameters: {} })}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <ResourceParameters resource={resource} step={step} section={section} updateStepParameter={updateStepParameter} />
              </div>
            ) : (
              <button
                onClick={() => setShowResourcePicker(!showResourcePicker)}
                className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Select Resource
              </button>
            )}

            {showResourcePicker && !resource && (
              <div className="mt-2 p-3 bg-white border border-gray-200 rounded-md shadow-sm max-h-64 overflow-y-auto">
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Search resources..."
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {availableResources.map(res => {
                  const Icon = res.icon;
                  return (
                    <button
                      key={res.id}
                      onClick={() => {
                        // Initialize parameters with defaults
                        const defaultParams: Record<string, any> = {};
                        res.parameters.forEach(param => {
                          defaultParams[param.id] = param.default;
                        });
                        updateStep(section.id, step.id, { resourceId: res.id, parameters: defaultParams });
                        setShowResourcePicker(false);
                      }}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded-md flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4 text-gray-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{res.name}</div>
                        <div className="text-xs text-gray-500">{res.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepEditor;