import React from 'react';
import { ChevronLeft, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { sidebarItems } from '../../data/sample-data';
import type { Count } from '../../types/complaint-types';

interface CountsReviewViewProps {
  identifiedCounts: Count[];
  editedCounts: Set<number>;
  editingCount: number | null;
  onToggleCountSelection: (countId: number) => void;
  onAddCustomCount: () => void;
  onDeleteCount: (countId: number) => void;
  onCountDescriptionEdit: (countId: number, description: string) => void;
  setIdentifiedCounts: (counts: Count[]) => void;
  setEditingCount: (count: number | null) => void;
  onBack: () => void;
  onGenerateDraft: () => void;
}

const CountsReviewView: React.FC<CountsReviewViewProps> = ({
  identifiedCounts,
  editedCounts,
  editingCount,
  onToggleCountSelection,
  onAddCustomCount,
  onDeleteCount,
  onCountDescriptionEdit,
  setIdentifiedCounts,
  setEditingCount,
  onBack,
  onGenerateDraft,
}) => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-900">Michael Garcia - MVA</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 bg-white border-r border-gray-200 flex flex-col z-0 overflow-y-auto">
          <div className="mt-4 flex-1">
            {sidebarItems.map(item => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={item.id} 
                  className={`flex items-center px-4 py-2 ${item.active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer`}
                >
                  <div className="mr-3"><IconComponent size={18} /></div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Identified Counts of Claim</h2>
              <p className="text-gray-600">Supio has analyzed your case materials and identified the following potential counts. Review and modify as needed before generating the complaint.</p>
            </div>
            
            <div className="space-y-4 mb-6">
              {identifiedCounts.map((count: Count) => (
                <div 
                  key={count.id}
                  className={`border rounded-lg p-4 ${count.selected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <input
                        type="checkbox"
                        checked={count.selected}
                        onChange={() => onToggleCountSelection(count.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            {count.isCustom ? (
                              <input
                                type="text"
                                value={count.title}
                                onChange={(e) => {
                                  setIdentifiedCounts(identifiedCounts.map((c: Count) => 
                                    c.id === count.id ? { ...c, title: e.target.value } : c
                                  ));
                                }}
                                className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                              />
                            ) : (
                              count.title
                            )}
                            {editedCounts.has(count.id) && (
                              <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                                Edited
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingCount(editingCount === count.id ? null : count.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <Edit size={16} className="inline mr-1" />
                              {editingCount === count.id ? 'Cancel' : 'Edit'}
                            </button>
                            {count.isCustom && (
                              <button
                                onClick={() => onDeleteCount(count.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                        {editingCount === count.id ? (
                          <div className="mt-1">
                            <textarea
                              value={count.description}
                              onChange={(e) => {
                                setIdentifiedCounts(identifiedCounts.map((c: Count) => 
                                  c.id === count.id ? { ...c, description: e.target.value } : c
                                ));
                              }}
                              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                              rows={3}
                            />
                            <div className="mt-2 flex justify-end space-x-2">
                              <button
                                onClick={() => setEditingCount(null)}
                                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => onCountDescriptionEdit(count.id, count.description)}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-600 mt-1">{count.description}</p>
                        )}
                        
                        {!editedCounts.has(count.id) && editingCount !== count.id && count.keyFacts.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Key Supporting Facts:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {count.keyFacts.map((fact: string, idx: number) => (
                                <li key={idx}>{fact}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {!editedCounts.has(count.id) && editingCount !== count.id && count.supportingDocs.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Supporting Documents:</h4>
                            <div className="flex flex-wrap gap-2">
                              {count.supportingDocs.map((doc: string, idx: number) => (
                                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <FileText size={12} className="mr-1" />
                                  {doc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={onAddCustomCount}
              className="mb-6 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <Plus size={16} className="mr-2" />
              Add Custom Count
            </button>
            
            <div className="flex justify-between items-center border-t border-gray-200 pt-6">
              <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ChevronLeft size={16} className="mr-2" />
                Back
              </button>
              
              <button
                onClick={onGenerateDraft}
                disabled={!identifiedCounts.some((c: Count) => c.selected)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CountsReviewView;