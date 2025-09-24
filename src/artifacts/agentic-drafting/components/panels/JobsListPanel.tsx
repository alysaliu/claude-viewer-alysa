import React from 'react';
import { Briefcase, PenTool } from 'lucide-react';
import type { Job } from '../../types/drafting-types';
import { formatTimeAgo } from '../../utils/time';

interface JobsListPanelProps {
  jobs: Job[];
  onJobClick?: (job: Job) => void;
}

const JobsListPanel: React.FC<JobsListPanelProps> = ({
  jobs,
  onJobClick
}) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onJobClick?.(job)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PenTool size={14} className="text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {job.title}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                      job.status === 'Complete' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {job.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Started {formatTimeAgo(job.createdAt)}</span>
                    <span>
                      {job.status === 'Complete' 
                        ? `Completed in ${job.elapsedTime}s`
                        : `${job.elapsedTime}s elapsed`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsListPanel;