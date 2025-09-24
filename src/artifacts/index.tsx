import React, { useState, useEffect } from 'react';
import { FileText, Play, RefreshCw, FolderOpen } from 'lucide-react';

interface ArtifactFile {
  name: string;
  displayName: string;
  component: React.ComponentType;
  lastModified: Date;
}

const ArtifactPicker = () => {
  const [artifacts, setArtifacts] = useState<ArtifactFile[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);
  const [currentComponent, setCurrentComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to scan for TSX files using Vite's glob import
  const scanArtifacts = async () => {
    try {
      // Use Vite's glob import to get all TSX files except index.tsx
      const modules = import.meta.glob('./*.tsx', { eager: true });
      const artifactFiles: ArtifactFile[] = [];
      
      for (const [path, module] of Object.entries(modules)) {
        // Skip the index file (this file)
        if (path === './index.tsx') continue;
        
        const filename = path.replace('./', '').replace('.tsx', '');
        const mod = module as { default?: React.ComponentType };
        
        if (mod.default) {
          artifactFiles.push({
            name: filename,
            displayName: filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            component: mod.default,
            lastModified: new Date() // In a real implementation, you'd get this from file stats
          });
        }
      }

      // Sort by name
      artifactFiles.sort((a, b) => a.name.localeCompare(b.name));
      setArtifacts(artifactFiles);
      setError(null);
    } catch (err) {
      console.error('Error scanning artifacts:', err);
      setError('Failed to scan artifacts directory');
    }
  };

  // Load a specific artifact component
  const loadArtifact = async (artifact: ArtifactFile) => {
    setLoading(true);
    setError(null);
    
    try {
      setCurrentComponent(() => artifact.component);
      setSelectedArtifact(artifact.name);
    } catch (err) {
      console.error('Error loading artifact:', err);
      setError(`Failed to load ${artifact.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Go back to file picker
  const goBackToPicker = () => {
    setCurrentComponent(null);
    setSelectedArtifact(null);
    setError(null);
  };


  // Scan for artifacts on mount
  useEffect(() => {
    scanArtifacts();
  }, []);

  // If a component is loaded, render it
  if (currentComponent) {
    const ComponentToRender = currentComponent;
    
    return (
      <div className="h-screen relative">
        {/* Floating back button */}
        <button
          onClick={goBackToPicker}
          className="fixed bottom-4 left-4 z-50 flex items-center space-x-2 px-3 py-2 text-sm bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white shadow-lg rounded-lg transition-all"
        >
          <FolderOpen size={16} />
          <span>Back to Picker</span>
        </button>
        
        {/* Render the selected component in full screen */}
        <ComponentToRender />
      </div>
    );
  }

  // Main file picker interface
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Claude Artifact Runner</h1>
          <p className="mt-2 text-gray-600">Preview and interact with React component prototypes</p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Available Artifacts ({artifacts.length})</h2>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-red-700 font-medium">Error</span>
            </div>
            <p className="mt-1 text-red-600">{error}</p>
          </div>
        )}

        {artifacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-8">
              <div className="text-center">
                <FileText size={48} className="mx-auto text-blue-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Artifacts Found</h3>
                <p className="text-gray-600 mb-4">
                  Add .tsx files to <code className="bg-gray-100 px-2 py-1 rounded">src/artifacts/</code> to get started
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw size={20} />
                  <span>Scan for Files</span>
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left max-w-2xl mx-auto">
              <h4 className="font-medium text-blue-900 mb-3">Requirements for TSX files:</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Must have a default export: <code className="bg-blue-100 px-1 rounded">export default MyComponent;</code></li>
                <li>Should be a React functional component</li>
                <li>Can include any valid React/JSX code</li>
                <li>Will be rendered in full-screen mode</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artifacts.map((artifact) => (
              <div
                key={artifact.name}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{artifact.displayName}</h3>
                        <p className="text-sm text-gray-500">{artifact.name}.tsx</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Ready to launch
                    </span>
                    <button
                      onClick={() => loadArtifact(artifact)}
                      disabled={loading}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          <span>Launch</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        {artifacts.length > 0 && (
          <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-medium text-gray-900 mb-3">Quick Start:</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Click "Launch" to preview any prototype in full-screen mode</p>
              <p>• Use "Back to Picker" to return and select a different prototype</p>
              <p>• Add new files to <code className="bg-gray-100 px-1 rounded">src/artifacts/</code> and refresh</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArtifactPicker;