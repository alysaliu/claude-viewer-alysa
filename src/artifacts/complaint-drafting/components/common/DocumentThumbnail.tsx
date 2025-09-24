import React from 'react';

interface DocumentThumbnailProps {
  type: string;
}

const DocumentThumbnail: React.FC<DocumentThumbnailProps> = ({ type }) => {
  const bgColor = type === 'deposition' ? 'bg-blue-50' :
                 type === 'timeline' ? 'bg-green-50' :
                 type === 'analysis' ? 'bg-purple-50' :
                 type === 'motion' ? 'bg-amber-50' :
                 'bg-gray-50';
                 
  const textColor = type === 'deposition' ? 'text-blue-800' :
                   type === 'timeline' ? 'text-green-800' :
                   type === 'analysis' ? 'text-purple-800' :
                   type === 'motion' ? 'text-amber-800' :
                   'text-gray-800';
                   
  const icon = type === 'deposition' ? "Q" :
             type === 'timeline' ? "T" :
             type === 'analysis' ? "A" :
             type === 'motion' ? "M" :
             type === 'letter' ? "L" :
             "D";
             
  return (
    <div className={`w-full ${bgColor} rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden`} 
         style={{ aspectRatio: '1/1.414' }}>
      <div className={`text-4xl font-bold ${textColor}`}>{icon}</div>
    </div>
  );
};

export default DocumentThumbnail;