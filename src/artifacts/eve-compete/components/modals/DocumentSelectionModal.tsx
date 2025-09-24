import React, { useState } from 'react';
import { X, FileText, Scale, Users, UserX, Heart, Upload } from 'lucide-react';

interface BlueprintSelectionModalProps {
  show: boolean;
  onClose: () => void;
  onSelectBlueprint: (blueprintId: string) => void;
  onSelectReferenceDocument: (file: File) => void;
}

const BlueprintSelectionModal: React.FC<BlueprintSelectionModalProps> = ({
  show,
  onClose,
  onSelectBlueprint,
  onSelectReferenceDocument
}) => {
  const [selectedOption, setSelectedOption] = useState<'blueprint' | 'reference' | null>(null);

  if (!show) return null;

  const blueprints = [
    {
      id: 'complaint',
      title: 'Complaint',
      description: 'Draft a legal complaint for civil litigation',
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      available: true
    },
    {
      id: 'motion-summary-judgment',
      title: 'Motion for Summary Judgment',
      description: 'Draft a motion for summary judgment',
      icon: <Scale className="h-8 w-8 text-gray-400" />,
      available: false
    },
    {
      id: 'expert-disclosure',
      title: 'Expert Disclosure',
      description: 'Draft an expert witness disclosure',
      icon: <UserX className="h-8 w-8 text-gray-400" />,
      available: false
    },
    {
      id: 'mediation-brief',
      title: 'Mediation Brief',
      description: 'Draft a brief for mediation proceedings',
      icon: <Users className="h-8 w-8 text-gray-400" />,
      available: false
    },
    {
      id: 'medical-summary',
      title: 'Medical Summary',
      description: 'Draft a medical summary report',
      icon: <Heart className="h-8 w-8 text-gray-400" />,
      available: false
    }
  ];

  const handleBlueprintSelect = (blueprintId: string, available: boolean) => {
    if (!available) return;
    onSelectBlueprint(blueprintId);
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSelectReferenceDocument(file);
      onClose();
    }
  };

  const handleModalClose = () => {
    setSelectedOption(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Draft a Document</h3>
          <button
            onClick={handleModalClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Existing Blueprints */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Use Existing Blueprint</h4>
              <p className="text-gray-600 mb-6">Choose from our pre-built document templates:</p>

              <div className="space-y-3">
                {blueprints.map((blueprint) => (
                  <div
                    key={blueprint.id}
                    onClick={() => handleBlueprintSelect(blueprint.id, blueprint.available)}
                    className={`p-4 border rounded-lg transition-all ${
                      blueprint.available
                        ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {blueprint.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className={`font-medium ${
                            blueprint.available ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {blueprint.title}
                          </h5>
                          {!blueprint.available && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${
                          blueprint.available ? 'text-gray-600' : 'text-gray-500'
                        }`}>
                          {blueprint.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Document Option */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Use Reference Document</h4>
              <p className="text-gray-600 mb-6">Upload a document to use as a template:</p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h5 className="text-lg font-medium text-gray-900 mb-2">Upload Reference Document</h5>
                <p className="text-gray-600 mb-4">
                  Upload a Word document, PDF, or text file to use as a template for your new document.
                </p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                  <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleModalClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlueprintSelectionModal;