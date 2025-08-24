import { RefObject } from "react";
import { useEventHandler } from "../../../hooks/useEventHandler";

interface AutoCompleteProps {
    suggestions?: string[];
    setCallback: (suggestion: string) => void;
    contentRef: RefObject<HTMLDivElement | null>;
    suggestionsRef: RefObject<HTMLDivElement | null>;
    setSuggestionsVisible?: (visible: boolean) => void;
    setIsContentChanged?: (changed: boolean) => void;
  }
  
  export const AutoComplete: React.FC<AutoCompleteProps> = ({ 
    suggestions, 
    setCallback, 
    contentRef,
    suggestionsRef,
    setSuggestionsVisible,
    setIsContentChanged, 
  }) => {
  
    const handleSuggestionClick = (suggestion: string) => {
      setCallback(suggestion);
      if (typeof setSuggestionsVisible === 'function') {
        setSuggestionsVisible(false);
      };
      if (typeof setIsContentChanged === 'function') {
        setIsContentChanged(true);
      };
    };
  
    // 入力候補 or 対象項目以外を押下した場合に入力候補エリアを非表示
    const handleClickOutside = (e: Event) => {
  
      if (e instanceof MouseEvent) {
        const target = e.target as Node; // 型アサーションを使用
        if ((!suggestionsRef?.current?.contains(target)) && (!contentRef?.current?.contains(target))) {
          if (typeof setSuggestionsVisible === 'function') {
            setSuggestionsVisible(false);
          };
        };
      };
    };
    useEventHandler("mousedown", handleClickOutside);
  
    return (
      <div 
        className="relative"
        ref={suggestionsRef}
      >
        <ul className="absolute text-xs w-full bg-white border border-gray-300 z-10 rounded-md shadow-lg">
          {suggestions?.map((item, index) => (
            <li
              className="px-3 py-2 cursor-pointer hover:bg-gray-200"
              key={index} 
              onClick={() => handleSuggestionClick(item)}
              tabIndex={0}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  