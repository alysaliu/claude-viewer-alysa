import { useState, useRef } from 'react';

export const useRichTextEditor = () => {
  const [activeTextStep, setActiveTextStep] = useState<number | null>(null);
  const textAreaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    });
  };

  return {
    activeTextStep,
    setActiveTextStep,
    textAreaRefs,
    copyToClipboard
  };
};