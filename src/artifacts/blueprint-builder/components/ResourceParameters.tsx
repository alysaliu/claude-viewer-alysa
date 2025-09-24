import React from 'react';
import type { Resource, Step, Section } from '../types/blueprint-types';

interface ResourceParametersProps {
  resource: Resource;
  step: Step;
  section: Section;
  updateStepParameter: (sectionId: number, stepId: number, paramId: string, value: any) => void;
}

const ResourceParameters: React.FC<ResourceParametersProps> = ({
  resource,
  step,
  section,
  updateStepParameter
}) => {
  if (!resource.parameters || resource.parameters.length === 0) return null;

  return (
    <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-md">
      {resource.parameters.map(param => {
        const value = step.parameters?.[param.id] ?? param.default;

        switch (param.type) {
          case 'select':
            return (
              <div key={param.id}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{param.name}</label>
                <select
                  value={value}
                  onChange={(e) => updateStepParameter(section.id, step.id, param.id, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {param.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            );

          case 'multiselect':
            return (
              <div key={param.id}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{param.name}</label>
                <div className="space-y-1">
                  {param.options?.map(option => (
                    <label key={option} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={value.includes(option)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...value, option]
                            : value.filter((v: string) => v !== option);
                          updateStepParameter(section.id, step.id, param.id, newValue);
                        }}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            );

          case 'checkbox':
            return (
              <label key={param.id} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateStepParameter(section.id, step.id, param.id, e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{param.name}</span>
              </label>
            );

          case 'text':
            return (
              <div key={param.id}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{param.name}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateStepParameter(section.id, step.id, param.id, e.target.value)}
                  placeholder={param.placeholder}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            );

          case 'prompt':
            return (
              <div key={param.id}>
                <label className="block text-xs font-medium text-gray-700 mb-1">{param.name}</label>
                <textarea
                  value={value}
                  onChange={(e) => updateStepParameter(section.id, step.id, param.id, e.target.value)}
                  placeholder={param.placeholder}
                  rows={3}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default ResourceParameters;