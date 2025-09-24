import { useState } from 'react';
import { initialAiMessages } from '../data/ai-messages';
import type { AiMessage } from '../types/deposition-types';

export const useAiChat = () => {
  const [aiMessages, setAiMessages] = useState<AiMessage[]>(initialAiMessages);
  const [aiInputValue, setAiInputValue] = useState('');
  const [showAiChat, setShowAiChat] = useState(false);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: AiMessage = {
      id: Date.now(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    // Generate AI response
    const aiResponse: AiMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: "Based on the current testimony, I recommend focusing on the timeline discrepancies. The witness's statements about weather and timing are inconsistent, which could be crucial for establishing credibility.",
      timestamp: new Date()
    };
    
    setAiMessages(prev => [...prev, userMessage, aiResponse]);
    setAiInputValue('');
  };

  const handleSendMessage = () => {
    sendMessage(aiInputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && aiInputValue.trim()) {
      sendMessage(aiInputValue);
    }
  };

  const toggleAiChat = () => {
    setShowAiChat(prev => !prev);
  };

  const clearChat = () => {
    setAiMessages(initialAiMessages);
  };

  const addMessage = (message: Omit<AiMessage, 'id' | 'timestamp'>) => {
    const newMessage: AiMessage = {
      ...message,
      id: Date.now(),
      timestamp: new Date()
    };
    setAiMessages(prev => [...prev, newMessage]);
  };

  return {
    // State
    aiMessages,
    aiInputValue,
    showAiChat,
    
    // Setters (for external components that need direct access)
    setAiMessages,
    setAiInputValue,
    setShowAiChat,
    
    // Actions
    sendMessage,
    handleSendMessage,
    handleKeyPress,
    toggleAiChat,
    clearChat,
    addMessage
  };
};

export default useAiChat;