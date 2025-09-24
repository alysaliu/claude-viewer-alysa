import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';

interface RichTextToolbarProps {
  stepId: number;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
}

const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ stepId, textAreaRef }) => {
  const applyFormatting = (command: string, value: string | null = null) => {
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    let newText = '';
    
    switch (command) {
      case 'bold':
        newText = selectedText ? `**${selectedText}**` : '**bold text**';
        break;
      case 'italic':
        newText = selectedText ? `*${selectedText}*` : '*italic text*';
        break;
      case 'underline':
        newText = selectedText ? `<u>${selectedText}</u>` : '<u>underlined text</u>';
        break;
      case 'bulletList':
        newText = selectedText ? `• ${selectedText}` : '• List item';
        break;
      case 'numberedList':
        newText = selectedText ? `1. ${selectedText}` : '1. List item';
        break;
      case 'fontSize':
        newText = selectedText ? `<span style="font-size: ${value}">${selectedText}</span>` : `<span style="font-size: ${value}">text</span>`;
        break;
      default:
        return;
    }
    
    const newValue = beforeText + newText + afterText;
    textarea.value = newValue;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    
    const newCursorPos = start + newText.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="border border-gray-300 rounded-t-md bg-gray-50 px-3 py-2 flex items-center gap-1 flex-wrap">
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
        <button
          onClick={() => applyFormatting('bold')}
          className="p-1 hover:bg-gray-200 rounded text-gray-700"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormatting('italic')}
          className="p-1 hover:bg-gray-200 rounded text-gray-700"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormatting('underline')}
          className="p-1 hover:bg-gray-200 rounded text-gray-700"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
        <button
          onClick={() => applyFormatting('bulletList')}
          className="p-1 hover:bg-gray-200 rounded text-gray-700"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormatting('numberedList')}
          className="p-1 hover:bg-gray-200 rounded text-gray-700"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-1">
        <select
          onChange={(e) => applyFormatting('fontSize', e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
          defaultValue=""
        >
          <option value="">Font Size</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
        </select>
      </div>
    </div>
  );
};

export default RichTextToolbar;