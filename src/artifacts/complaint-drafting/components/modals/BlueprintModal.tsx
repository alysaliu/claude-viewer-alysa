import React from 'react';
import { X, FileText } from 'lucide-react';
import { blueprints } from '../../data/sample-data';
import type { Blueprint } from '../../types/complaint-types';

interface BlueprintModalProps {
  onClose: () => void;
  onSelectBlueprint: (blueprint: Blueprint) => void;
}

const BlueprintModal: React.FC<BlueprintModalProps> = ({ onClose, onSelectBlueprint }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 h-5/6 max-w-4xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium text-lg">Select a Blueprint</h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blueprints.map(blueprint => (
              <div 
                key={blueprint.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex flex-col"
                onClick={() => onSelectBlueprint(blueprint)}
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg text-gray-900 mb-1">{blueprint.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{blueprint.description}</p>
                
                <div className="mt-auto border-t border-gray-200 pt-3">
                  <div className="text-xs text-gray-500">Last used: {blueprint.lastUsed}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintModal;