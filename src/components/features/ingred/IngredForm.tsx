import '@/css/styles.css';
import '@/css/output.css';

import React, { useEffect, useRef, useState } from "react";

import { useEventHandler } from "../../../hooks/useEventHandler";
import { useIngredNmSuggestions } from "../../../hooks/useFetchData";


import { IngredFormData } from '@/types';
import { useApp } from '@/hooks';
import { RequiredMark, AutoComplete, FormCloseButton, FormSubmitButton, OptionFromDict } from '@/components/ui';



interface IngredFormProps {
  submitAction: (formData: IngredFormData) => void;
  closeIngredForm: () => void;
  editData?: IngredFormData;
}

export const IngredForm: React.FC<IngredFormProps> = ({ submitAction, closeIngredForm, editData }) => {

  const { unitDict, unitDictStat, salesAreaDict, salesAreaDictStat, setIsOpeningForm } = useApp();

  const [ingredNm, setIngredNm] = useState<string>(editData?.ingredNm || "");
  const [ingredNmK, setIngredNmK] = useState<string>(editData?.ingredNmK || "");
  const [parentIngredNm, setParentIngredNm] = useState<string>(editData?.parentIngredNm || "");
  const [buyUnitCd, setStandardUnitCd] = useState<string>(editData?.buyUnitCd || (unitDict ? Object.keys(unitDict)[0] : "1"));
  const [salesAreaType, setSalesAreaType] = useState<string>(editData?.salesAreaType || (salesAreaDict ? Object.keys(salesAreaDict)[0] : "1"));
  const { ingredNmSuggestions, ingredNmSuggestionsStat } = useIngredNmSuggestions(parentIngredNm);
  const [ingredNmSuggestionsVisible, setIngredNmSuggestionsVisible] = useState(false);
  
  const parentIngredNmRef = useRef<HTMLDivElement>(null);
  const ingredNmSuggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {setIsOpeningForm(true)}, [setIsOpeningForm]);

  const handleParentIngredNmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setParentIngredNm(e.target.value);
    setIngredNmSuggestionsVisible(true);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: IngredFormData = { ingredNm, ingredNmK, parentIngredNm, buyUnitCd, salesAreaType };
    submitAction(formData);
  };

  const handleKeyDown = (e: Event) => {
    if (e instanceof KeyboardEvent) { 
      if (e.key === 'Escape') {
        e.preventDefault();
        if (ingredNmSuggestionsVisible) {
          setIngredNmSuggestionsVisible(false);
        } else {
          closeIngredForm();
        };
      };
    };
  };
  useEventHandler("keydown", handleKeyDown)
  
  return (
    <div 
      className="form-bg-layout-base"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700">食材名<RequiredMark/></label>
            <input
              type="text"
              value={ingredNm}
              onChange={(e) => setIngredNm(e.target.value)}
              className="form-input-base"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">食材名（かな）</label>
            <input
              type="text"
              value={ingredNmK}
              onChange={(e) => setIngredNmK(e.target.value)}
              className="form-input-base"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">購入食材名<RequiredMark/></label>
            <input
              type="text"
              value={parentIngredNm}
              onFocus={() => setIngredNmSuggestionsVisible(true)}
              onChange={handleParentIngredNmChange}
              className="form-input-base"
              required
            />
          </div>
          {!ingredNmSuggestionsStat?.isLoading && ingredNmSuggestionsVisible && (
            <AutoComplete
              suggestions={ingredNmSuggestions}
              setCallback={(suggestion: string) => setParentIngredNm(suggestion)}
              contentRef={parentIngredNmRef}
              suggestionsRef={ingredNmSuggestionsRef}
              setSuggestionsVisible={setIngredNmSuggestionsVisible}
            />
          )}

          <div className="mt-4">
            <label className="block text-sm text-gray-700">標準単位<RequiredMark/></label>
            <select
              value={buyUnitCd}
              onChange={(e) => setStandardUnitCd(e.target.value)}
              className="form-input-base"
            >
              {!unitDictStat.isLoading && <OptionFromDict dict={unitDict} />}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">売り場<RequiredMark/></label>
            <select
              value={salesAreaType}
              onChange={(e) => setSalesAreaType(e.target.value)}
              className="form-input-base"
            >
              {!salesAreaDictStat.isLoading && <OptionFromDict dict={salesAreaDict} />}
            </select>
          </div>
          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeIngredForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};
