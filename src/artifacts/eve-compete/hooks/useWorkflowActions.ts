import type { ActiveTab } from '../types/workflow-types';

interface WorkflowActionsProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const useWorkflowActions = ({ setActiveTab }: WorkflowActionsProps) => {
  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
  };

  const handleBlueprintClick = () => {
    // Handle blueprint modal functionality
    console.log('Blueprint clicked');
  };

  const handleResponsesClick = () => {
    // Handle build responses functionality
    console.log('Build responses clicked');
  };

  return {
    handleTabClick,
    handleBlueprintClick,
    handleResponsesClick,
  };
};