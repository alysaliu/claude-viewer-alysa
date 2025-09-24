import { useState } from 'react';
import { mockTabMessages, mockChatTabs } from '../data/mockMessages';
import type { Message } from '../types/drafting-types';

export interface ChatTab {
  id: number;
  name: string;
  isDocumentTab: boolean;
  associatedJobId: string | null;
  createdFrom?: 'ai-assistant' | 'explore';
  hiddenInAI?: boolean;
  aiPosition?: number;
}

export interface ChatTabState {
  chatTabs: ChatTab[];
  activeChatTab: number;
  tabMessages: Record<number, Message[]>;
  tabFiles: Record<number, Array<{id: string; name: string; size: number; type: string; file: File}>>;
  tabStagedFiles: Record<number, Array<{id: string; name: string; size: number; type: string; file: File}>>;
  conversationInputs: Record<number, string>;
}

export interface ChatTabActions {
  setChatTabs: (tabs: ChatTab[]) => void;
  setActiveChatTab: (tabId: number) => void;
  setTabMessages: (messages: Record<number, Message[]>) => void;
  setTabFiles: (files: Record<number, Array<{id: string; name: string; size: number; type: string; file: File}>>) => void;
  setTabStagedFiles: (files: Record<number, Array<{id: string; name: string; size: number; type: string; file: File}>>) => void;
  setConversationInputs: (inputs: Record<number, string>) => void;
  updateConversationInput: (tabId: number, input: string) => void;
  getTabLastMessageTimestamp: (tabId: number) => Date | null;
  getFirstRealConversation: () => ChatTab | null;
  findStagedConversation: (createdFrom: 'ai-assistant' | 'explore') => ChatTab | undefined;
  isConversationStaged: (tabId: number) => boolean;
  getVisibleAITabs: () => ChatTab[];
}

export const useChatTabs = (): [ChatTabState, ChatTabActions] => {
  const [chatTabs, setChatTabs] = useState<ChatTab[]>(mockChatTabs);
  const [activeChatTab, setActiveChatTab] = useState(4);
  const [tabMessages, setTabMessages] = useState<Record<number, Message[]>>(mockTabMessages);
  const [tabFiles, setTabFiles] = useState<Record<number, Array<{id: string; name: string; size: number; type: string; file: File}>>>({});
  const [tabStagedFiles, setTabStagedFiles] = useState<Record<number, Array<{id: string; name: string; size: number; type: string; file: File}>>>({});
  const [conversationInputs, setConversationInputs] = useState<Record<number, string>>({});

  const updateConversationInput = (tabId: number, input: string) => {
    setConversationInputs(prev => ({
      ...prev,
      [tabId]: input
    }));
  };

  const getTabLastMessageTimestamp = (tabId: number): Date | null => {
    const messages = tabMessages[tabId] || [];
    if (messages.length === 0) return null;

    const sortedMessages = [...messages].sort((a, b) => {
      const aTimestamp = a.timestamp;
      const bTimestamp = b.timestamp;
      if (!aTimestamp || !bTimestamp) return 0;
      return bTimestamp.getTime() - aTimestamp.getTime();
    });

    return sortedMessages.length > 0 ? sortedMessages[0].timestamp : null;
  };

  const getFirstRealConversation = (): ChatTab | null => {
    const realTabs = chatTabs.filter(tab => {
      const messages = tabMessages[tab.id] || [];
      return messages.length > 0;
    }).sort((a, b) => {
      const aTimestamp = getTabLastMessageTimestamp(a.id);
      const bTimestamp = getTabLastMessageTimestamp(b.id);
      if (!aTimestamp || !bTimestamp) return 0;
      return bTimestamp.getTime() - aTimestamp.getTime();
    });
    return realTabs.length > 0 ? realTabs[0] : null;
  };

  const findStagedConversation = (createdFrom: 'ai-assistant' | 'explore'): ChatTab | undefined => {
    return chatTabs.find(tab => {
      const messages = tabMessages[tab.id] || [];
      return messages.length === 0 && tab.createdFrom === createdFrom;
    });
  };

  const isConversationStaged = (tabId: number): boolean => {
    const messages = tabMessages[tabId] || [];
    return messages.length === 0;
  };

  const getVisibleAITabs = (): ChatTab[] => {
    return chatTabs.filter(tab => {
      if (tab.hiddenInAI) return false;
      if (tab.createdFrom === 'explore' && isConversationStaged(tab.id)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const aIsAIStaged = a.createdFrom === 'ai-assistant' && isConversationStaged(a.id);
      const bIsAIStaged = b.createdFrom === 'ai-assistant' && isConversationStaged(b.id);

      if (aIsAIStaged && !bIsAIStaged) return -1;
      if (!aIsAIStaged && bIsAIStaged) return 1;

      if (a.aiPosition !== undefined && b.aiPosition !== undefined) {
        return a.aiPosition - b.aiPosition;
      }

      const aTimestamp = getTabLastMessageTimestamp(a.id);
      const bTimestamp = getTabLastMessageTimestamp(b.id);
      if (!aTimestamp || !bTimestamp) return 0;
      return bTimestamp.getTime() - aTimestamp.getTime();
    });
  };

  const state: ChatTabState = {
    chatTabs,
    activeChatTab,
    tabMessages,
    tabFiles,
    tabStagedFiles,
    conversationInputs,
  };

  const actions: ChatTabActions = {
    setChatTabs,
    setActiveChatTab,
    setTabMessages,
    setTabFiles,
    setTabStagedFiles,
    setConversationInputs,
    updateConversationInput,
    getTabLastMessageTimestamp,
    getFirstRealConversation,
    findStagedConversation,
    isConversationStaged,
    getVisibleAITabs,
  };

  return [state, actions];
};