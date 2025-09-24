import React, { useState, useEffect } from 'react';
import { Briefcase, PenTool, Bookmark, Check } from 'lucide-react';
import type { Job } from '../../types/drafting-types';
import { formatTimeAgo } from '../../utils/time';

interface JobsListPanelProps {
  jobs: Job[];
  onJobClick?: (job: Job) => void;
  onSaveReferenceAsBlueprint?: (title: string, description: string, referenceFile: string, documentType?: string, additionalInstructions?: string, starred?: boolean) => void;
}

const JobsListPanel: React.FC<JobsListPanelProps> = ({
  jobs,
  onJobClick,
  onSaveReferenceAsBlueprint
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second to refresh timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[100]">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Jobs</h3>
      </div>
      {jobs.length === 0 ? (
        <div className="p-8 text-center">
          <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
          <h4 className="text-sm font-medium text-gray-900 mb-1">No recent jobs</h4>
          <p className="text-sm text-gray-500">Background jobs you initiate will appear here</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {jobs
            .slice()
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((job) => {
              // Format creation method
              const creationMethod = job.creationMethod === 'blueprint'
                ? `from Blueprint "${job.blueprintName || 'Unknown'}"`
                : job.creationMethod === 'reference'
                  ? 'from example document'
                  : 'Unknown method';

              // Format document title with dashes in date (MM-DD-YYYY)
              const dateStr = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
              const documentTitle = `Michael Garcia - MVA - ${(job.documentType || 'Draft').replace(/\//g, '-')} - ${dateStr}`;

              // Format start time
              const startTime = new Date(job.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });

              // Calculate elapsed time
              const elapsed = job.status === 'In Progress' ? currentTime - job.startTime : (job.elapsedTime || 0);
              const minutes = Math.floor(elapsed / 60000);
              const seconds = Math.floor((elapsed % 60000) / 1000);
              const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

              return (
                <div
                  key={job.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onJobClick?.(job);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          job.status === 'Complete' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          <PenTool size={14} className={`${
                            job.status === 'Complete' ? 'text-green-600' : 'text-blue-600'
                          }`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {documentTitle}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                            job.status === 'Complete'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {job.status === 'Complete' ? 'Complete' : 'In Progress'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 truncate mb-1">
                          {creationMethod}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          Started {startTime} • {timeDisplay}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center ml-2">
                      {/* Blueprint save button - only for draft-from-example jobs */}
                      {job.status === 'Complete' && job.creationMethod === 'reference' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!job.savedAsBlueprint && onSaveReferenceAsBlueprint) {
                              const docJob = job as any; // Cast to access DocumentGenerationJob properties
                              // Generate a default blueprint title and description
                              const defaultTitle = `Blueprint from ${docJob.referenceFile || 'Document'}`;
                              const defaultDescription = `Blueprint created from ${docJob.documentType || 'document'} on ${new Date().toLocaleDateString()}`;
                              onSaveReferenceAsBlueprint(
                                defaultTitle,
                                defaultDescription,
                                docJob.referenceFile || 'Generated Document',
                                docJob.documentType,
                                docJob.additionalInstructions,
                                false // Not starred by default
                              );
                            }
                          }}
                          disabled={job.savedAsBlueprint}
                          className={`p-1 rounded mr-1 transition-colors ${
                            job.savedAsBlueprint
                              ? 'text-green-600 bg-green-50 cursor-default'
                              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'
                          }`}
                          title={job.savedAsBlueprint ? 'Saved as Blueprint' : 'Save as Blueprint'}
                        >
                          {job.savedAsBlueprint ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Bookmark className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default JobsListPanel;