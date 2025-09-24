import React from 'react';
import { FileText, ChevronRight, Paperclip, Search } from 'lucide-react';
import DocumentThumbnail from '../common/DocumentThumbnail';
import { recentDocuments, allDocuments, sidebarItems } from '../../data/sample-data';
import type { GetStartedOption, Document } from '../../types/complaint-types';

interface HomepageViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  documentSearchQuery: string;
  setDocumentSearchQuery: (query: string) => void;
  onShowBlueprintModal: () => void;
}

const HomepageView: React.FC<HomepageViewProps> = ({
  searchQuery,
  setSearchQuery,
  documentSearchQuery,
  setDocumentSearchQuery,
  onShowBlueprintModal,
}) => {
  const getStartedOptions: GetStartedOption[] = [
    {
      id: "blueprint",
      title: "Use a Blueprint",
      description: "Start with a predefined workflow to generate specific document types",
      icon: <FileText className="h-6 w-6" />,
      hasCustomContent: false
    },
    {
      id: "respond",
      title: "Build Responses",
      description: "Assemble responses to a list of requests or questions, e.g. interrogatories, production",
      icon: <FileText className="h-6 w-6" />,
      hasCustomContent: true
    }
  ];

  const filteredDocuments = documentSearchQuery 
    ? allDocuments.filter((doc: Document) => 
        doc.title.toLowerCase().includes(documentSearchQuery.toLowerCase())
      )
    : allDocuments;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-900">Michael Garcia - MVA</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Update case
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Open Case History
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-white hover:bg-gray-50">
              Print
            </button>
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
          <div className="max-w-full xl:max-w-7xl mx-auto p-4 md:p-6">
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-medium text-gray-900">Get Started</h2>
                <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-500 rounded">
                  <FileText size={16} className="mr-2" />
                  Create Blank Document
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-lg font-medium text-gray-700 mb-3">What do you want to draft today?</label>
                  <div className="relative max-w-[70vw] mx-auto">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 border pl-4 pr-12 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
                      placeholder="Describe what you want to draft..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {getStartedOptions.map(option => (
                    <div 
                      key={option.id} 
                      className="border border-gray-200 rounded-lg p-4 transition-colors duration-150 flex flex-col"
                      style={{ width: "calc(min(400px, 30vw))", height: "350px" }}
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                        {option.icon}
                      </div>
                      <h3 className="font-medium text-lg text-gray-900 mb-1">{option.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{option.description}</p>
                      
                      {option.id === "blueprint" && (
                        <div className="mt-auto">
                          <button 
                            onClick={onShowBlueprintModal}
                            className="w-full flex items-center justify-center border border-blue-500 text-blue-600 rounded-md py-2 px-3 hover:bg-blue-50 font-medium"
                          >
                            Use Blueprint
                          </button>
                        </div>
                      )}
                      
                      {option.hasCustomContent && option.id === "respond" && (
                        <div className="border-t border-gray-200 pt-3">
                          <div className="space-y-3">
                            <button className="w-full flex items-center justify-center border border-blue-500 text-blue-600 rounded-md py-2 px-3 hover:bg-blue-50">
                              <Paperclip size={16} className="mr-2" />
                              Upload File
                            </button>
                            <div className="text-xs text-gray-500 text-center">Supported: docx, txt, pdf</div>
                            <button className="w-full text-gray-600 hover:text-blue-600 hover:bg-gray-100 text-sm mt-2 py-1 px-3 rounded underline underline-offset-2 transition-colors">
                              or add manually
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-medium text-gray-900">Recent Documents</h2>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-4">
                  {recentDocuments.map((doc: Document) => (
                    <div key={doc.id} className="cursor-pointer group" style={{ width: "180px" }}>
                      <DocumentThumbnail type={doc.thumbnail || 'default'} />
                      <div className="mt-2">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">{doc.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.lastModified}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-medium text-gray-900">All Documents</h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2 py-0.5">9</span>
                </div>
                <div className="flex space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Search documents..."
                      value={documentSearchQuery}
                      onChange={(e) => setDocumentSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.map((doc: Document) => (
                      <tr key={doc.id} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-700">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                              <div className="text-xs text-gray-500">Supio • {doc.editor}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Last modified: {doc.lastModified}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2 justify-end">
                            <button className="text-gray-400 hover:text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  1 / 25 pages
                </div>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    Previous
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomepageView;