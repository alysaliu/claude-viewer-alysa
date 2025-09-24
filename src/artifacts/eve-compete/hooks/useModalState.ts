import { useState } from 'react';

export interface ModalState {
  showMoreMenu: boolean;
  showAIPanel: boolean;
  showUnifiedModal: boolean;
  showPromptsModal: boolean;
  unifiedModalDefaultTab: 'library' | 'draft';
  selectedBlueprintId: string | undefined;
  openInExampleMode: boolean;
  showToast: boolean;
  toastMessage: string;
  showCanvas: boolean;
}

export interface ModalActions {
  setShowMoreMenu: (show: boolean) => void;
  setShowAIPanel: (show: boolean) => void;
  setShowUnifiedModal: (show: boolean) => void;
  setShowPromptsModal: (show: boolean) => void;
  setUnifiedModalDefaultTab: (tab: 'library' | 'draft') => void;
  setSelectedBlueprintId: (id: string | undefined) => void;
  setOpenInExampleMode: (mode: boolean) => void;
  setShowToast: (show: boolean) => void;
  setToastMessage: (message: string) => void;
  setShowCanvas: (show: boolean) => void;
  closeAllModals: () => void;
  showToastMessage: (message: string) => void;
  closeUnifiedModal: () => void;
}

export const useModalState = (): [ModalState, ModalActions] => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showUnifiedModal, setShowUnifiedModal] = useState(false);
  const [showPromptsModal, setShowPromptsModal] = useState(false);
  const [unifiedModalDefaultTab, setUnifiedModalDefaultTab] = useState<'library' | 'draft'>('library');
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string | undefined>(undefined);
  const [openInExampleMode, setOpenInExampleMode] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCanvas, setShowCanvas] = useState(false);

  const closeAllModals = () => {
    setShowMoreMenu(false);
    setShowAIPanel(false);
    setShowUnifiedModal(false);
    setShowPromptsModal(false);
    setShowCanvas(false);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const closeUnifiedModal = () => {
    setShowUnifiedModal(false);
    setUnifiedModalDefaultTab('library');
    setSelectedBlueprintId(undefined);
    setOpenInExampleMode(false);
  };

  const state: ModalState = {
    showMoreMenu,
    showAIPanel,
    showUnifiedModal,
    showPromptsModal,
    unifiedModalDefaultTab,
    selectedBlueprintId,
    openInExampleMode,
    showToast,
    toastMessage,
    showCanvas,
  };

  const actions: ModalActions = {
    setShowMoreMenu,
    setShowAIPanel,
    setShowUnifiedModal,
    setShowPromptsModal,
    setUnifiedModalDefaultTab,
    setSelectedBlueprintId,
    setOpenInExampleMode,
    setShowToast,
    setToastMessage,
    setShowCanvas,
    closeAllModals,
    showToastMessage,
    closeUnifiedModal,
  };

  return [state, actions];
};