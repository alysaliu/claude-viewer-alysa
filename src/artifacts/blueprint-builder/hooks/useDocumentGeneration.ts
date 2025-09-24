import { useState } from 'react';
import type { Section } from '../types/blueprint-types';
import { availableResources } from '../data/sample-data';

export const useDocumentGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const generateDocument = async (
    blueprintName: string,
    selectedCase: string,
    sections: Section[],
    setShowPreview: (show: boolean) => void
  ) => {
    if (!selectedCase || sections.length === 0) {
      alert('Please select a case and add at least one section to generate a document.');
      return;
    }

    setIsGenerating(true);
    setShowPreview(true);

    // Simulate document generation
    setTimeout(() => {
      let content = `# ${blueprintName}\n\n`;
      content += `**Case:** ${selectedCase}\n\n`;
      content += `**Generated on:** ${new Date().toLocaleDateString()}\n\n`;
      content += `---\n\n`;

      sections.forEach((section, index) => {
        content += `## ${index + 1}. ${section.name}\n\n`;
        
        section.steps.forEach((step, stepIndex) => {
          if (step.type === 'text' && step.content) {
            content += `${step.content}\n\n`;
          } else if (step.type === 'prompt' && step.prompt) {
            content += `[Applied prompt transformation: "${step.prompt.substring(0, 50)}..."]\n\n`;
            content += `[Transformed content based on the prompt would appear here]\n\n`;
          } else if (step.type === 'resource') {
            const resource = availableResources.find(r => r.id === step.resourceId);
            if (resource) {
              // Simulate resource output with parameters
              content += `[Generated content from ${resource.name}`;
              
              // Add parameter info
              if (step.parameters) {
                const paramInfo = Object.entries(step.parameters)
                  .filter(([key, value]) => value !== '' && value !== false && (Array.isArray(value) ? value.length > 0 : true))
                  .map(([key, value]) => {
                    const param = resource.parameters.find(p => p.id === key);
                    return param ? `${param.name}: ${Array.isArray(value) ? value.join(', ') : value}` : null;
                  })
                  .filter(Boolean);
                
                if (paramInfo.length > 0) {
                  content += ` with ${paramInfo.join(', ')}`;
                }
              }
              
              content += `]\n\n`;
              
              // Add some sample content based on resource type
              switch (resource.id) {
                case 'case_summary':
                  content += `This is a motor vehicle accident case involving the plaintiff ${selectedCase.split(' v. ')[0]} and defendant ${selectedCase.split(' v. ')[1] || 'Unknown'}. The incident occurred on March 15, 2024, resulting in significant injuries to the plaintiff.\n\n`;
                  break;
                case 'key_entities':
                  content += `• Plaintiff: ${selectedCase.split(' v. ')[0]}\n• Defendant: ${selectedCase.split(' v. ')[1] || 'Unknown'}\n• Witness 1: John Smith\n• Witness 2: Mary Johnson\n• Expert: Dr. Robert Chen, MD\n\n`;
                  break;
                case 'chronology':
                  content += `• March 15, 2024: Motor vehicle collision occurred at intersection\n• March 16, 2024: Plaintiff admitted to hospital\n• March 20, 2024: Initial surgery performed\n• April 1, 2024: Plaintiff discharged from hospital\n• April 15, 2024: Follow-up appointment with specialist\n\n`;
                  break;
                default:
                  content += `[Sample output from ${resource.name}]\n\n`;
              }
            }
          }
        });

        content += '\n';
      });

      setGeneratedContent(content);
      setIsGenerating(false);
    }, 2000);
  };

  return {
    isGenerating,
    generatedContent,
    generateDocument
  };
};