import React from 'react';

// Import organized components and hooks
import HomepageView from './complaint-drafting/components/views/HomepageView';
import AnalyzingView from './complaint-drafting/components/views/AnalyzingView';
import CountsReviewView from './complaint-drafting/components/views/CountsReviewView';
import GeneratingView from './complaint-drafting/components/views/GeneratingView';
import DraftEditorView from './complaint-drafting/components/views/DraftEditorView';
import BlueprintModal from './complaint-drafting/components/modals/BlueprintModal';
import { useComplaintState } from './complaint-drafting/hooks/useComplaintState';
import { useComplaintActions } from './complaint-drafting/hooks/useComplaintActions';
import type { Blueprint } from './complaint-drafting/types/complaint-types';

const SupioComplaintDrafter = () => {
  const complaintState = useComplaintState();
  const complaintActions = useComplaintActions({
    setSelectedBlueprint: complaintState.setSelectedBlueprint,
    setCurrentView: complaintState.setCurrentView,
    setIsAnalyzing: complaintState.setIsAnalyzing,
    setIdentifiedCounts: complaintState.setIdentifiedCounts,
    setShowBlueprintModal: complaintState.setShowBlueprintModal,
    setDraftedComplaint: complaintState.setDraftedComplaint,
    setEditingSection: complaintState.setEditingSection,
    setEditedCounts: complaintState.setEditedCounts,
    setEditingCount: complaintState.setEditingCount,
    setHasBeenSaved: complaintState.setHasBeenSaved,
    identifiedCounts: complaintState.identifiedCounts,
    editedCounts: complaintState.editedCounts,
  });
  
  
  if (complaintState.currentView === 'homepage') {
    return (
      <>
        <HomepageView 
          searchQuery={complaintState.searchQuery}
          setSearchQuery={complaintState.setSearchQuery}
          documentSearchQuery={complaintState.documentSearchQuery}
          setDocumentSearchQuery={complaintState.setDocumentSearchQuery}
          onShowBlueprintModal={() => complaintState.setShowBlueprintModal(true)}
        />
        {complaintState.showBlueprintModal && (
          <BlueprintModal 
            onClose={() => complaintState.setShowBlueprintModal(false)}
            onSelectBlueprint={complaintActions.handleSelectBlueprint}
          />
        )}
      </>
    );
  }
  
  if (complaintState.currentView === 'analyzing') {
    return <AnalyzingView />;
  }
  
  if (complaintState.currentView === 'counts-review') {
    return (
      <CountsReviewView 
        identifiedCounts={complaintState.identifiedCounts}
        editedCounts={complaintState.editedCounts}
        editingCount={complaintState.editingCount}
        onToggleCountSelection={complaintActions.toggleCountSelection}
        onAddCustomCount={complaintActions.handleAddCustomCount}
        onDeleteCount={complaintActions.handleDeleteCount}
        onCountDescriptionEdit={complaintActions.handleCountDescriptionEdit}
        setIdentifiedCounts={complaintState.setIdentifiedCounts}
        setEditingCount={complaintState.setEditingCount}
        onBack={() => complaintState.setCurrentView('homepage')}
        onGenerateDraft={complaintActions.handleGenerateDraft}
      />
    );
  }
  
  if (complaintState.currentView === 'generating') {
    return <GeneratingView />;
  }
  
  if (complaintState.currentView === 'draft-editor') {
    return (
      <DraftEditorView 
        draftedComplaint={complaintState.draftedComplaint}
        activeSection={complaintState.activeSection}
        editingSection={complaintState.editingSection}
        showChat={complaintState.showChat}
        chatInput={complaintState.chatInput}
        documentTitle={complaintState.documentTitle}
        setActiveSection={complaintState.setActiveSection}
        setEditingSection={complaintState.setEditingSection}
        setShowChat={complaintState.setShowChat}
        setChatInput={complaintState.setChatInput}
        setDraftedComplaint={complaintState.setDraftedComplaint}
        onSectionEdit={complaintActions.handleSectionEdit}
        onSaveDocument={complaintActions.handleSaveDocument}
        onExportDocument={complaintActions.handleExportDocument}
      />
    );
  }
  
  // Default fallback
  return (
    <>
      <HomepageView 
        searchQuery={complaintState.searchQuery}
        setSearchQuery={complaintState.setSearchQuery}
        documentSearchQuery={complaintState.documentSearchQuery}
        setDocumentSearchQuery={complaintState.setDocumentSearchQuery}
        onShowBlueprintModal={() => complaintState.setShowBlueprintModal(true)}
      />
      {complaintState.showBlueprintModal && (
        <BlueprintModal 
          onClose={() => complaintState.setShowBlueprintModal(false)}
          onSelectBlueprint={complaintActions.handleSelectBlueprint}
        />
      )}
    </>
  );
};

export default SupioComplaintDrafter;