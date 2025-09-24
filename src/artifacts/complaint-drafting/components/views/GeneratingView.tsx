import React from 'react';
import { Loader } from 'lucide-react';

const GeneratingView: React.FC = () => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-900">Michael Garcia - MVA</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full text-center">
          <Loader className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-6" />
          
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Generating Complaint Draft
          </h2>
          
          <p className="text-gray-600 mb-6">
            Supio is drafting your complaint with the selected counts. Each section is being carefully crafted based on your case facts and applicable law.
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-blue-600 h-2.5 rounded-full w-4/5 animate-pulse"></div>
          </div>
          
          <div className="text-sm text-gray-500">
            Drafting count 2 of 3: Vicarious Liability...
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratingView;