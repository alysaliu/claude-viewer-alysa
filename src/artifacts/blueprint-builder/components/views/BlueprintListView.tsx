import React from 'react';
import { Plus, FileText, Settings } from 'lucide-react';
import { sampleBlueprints } from '../../data/sample-data';
import type { Blueprint } from '../../types/blueprint-types';

interface BlueprintListViewProps {
  onCreateNew: () => void;
  onSelectBlueprint: (blueprint: Blueprint) => void;
}

const BlueprintListView: React.FC<BlueprintListViewProps> = ({
  onCreateNew,
  onSelectBlueprint
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-semibold text-gray-900">Blueprint Library</h1>
            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Blueprint
            </button>
          </div>
        </div>
      </div>

      {/* Blueprint List */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Blueprints</h2>
            <p className="mt-1 text-sm text-gray-500">Manage and organize your document blueprints</p>
          </div>

          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Creator</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-2">Modified</div>
              <div className="col-span-1">Sections</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Blueprint Rows */}
            <div className="divide-y divide-gray-200">
              {sampleBlueprints.map((blueprint) => (
                <div
                  key={blueprint.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 cursor-pointer group"
                  onClick={() => onSelectBlueprint(blueprint)}
                >
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{blueprint.name}</div>
                        <div className="text-sm text-gray-500">{blueprint.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">{blueprint.creator}</div>
                  <div className="col-span-2 text-sm text-gray-600">{new Date(blueprint.dateCreated).toLocaleDateString()}</div>
                  <div className="col-span-2 text-sm text-gray-600">{new Date(blueprint.lastModified).toLocaleDateString()}</div>
                  <div className="col-span-1 text-sm text-gray-600">{blueprint.sectionCount}</div>
                  <div className="col-span-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Could add more actions here like duplicate, delete, etc.
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {sampleBlueprints.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No blueprints yet</p>
                <button
                  onClick={onCreateNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Blueprint
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintListView;