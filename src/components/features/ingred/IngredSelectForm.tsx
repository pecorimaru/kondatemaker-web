import '@/css/styles.css';
import '@/css/output.css';

import React, { useEffect, useRef, useState } from "react";

import { FormCloseButton, FormSubmitButton, LoadingSpinner, OptionFromDict, RequiredMark, AutoComplete } from "@/components/ui";
import { IngredSelectFormData } from "@/types";
import { useApp, useEventHandler, useDefaultSetsByIngred, useIngredNmSuggestions, useUnitDictByIngred } from '@/hooks';
import { DATA_TYPE } from '@/constants';
import { CheckBoxItem } from '@/components/ui/Form/CheckBoxItem';

interface IngredSelectFormProps {
  dataType: DATA_TYPE;
  submitAction: (formData: IngredSelectFormData, clearForm: () => void) => Promise<void>;
  closeIngredForm: () => void;
  editData?: IngredSelectFormData;
}

export const IngredSelectForm: React.FC<IngredSelectFormProps> = ({ dataType, submitAction, closeIngredForm, editData }) => {

  const { salesAreaDict, salesAreaDictStat, setIsOpeningForm } = useApp();

  const [ingredNm, setIngredNm] = useState<string>(editData?.ingredNm ?? "");
  const [qty, setQty] = useState<number | null>(editData?.qty ?? null);
  const { unitDictByIngred, unitDictByIngredStat } = useUnitDictByIngred(ingredNm ?? null);
  const [unitCd, setUnitCd] = useState(editData ? editData?.unitCd : !unitDictByIngredStat.isLoading ? unitDictByIngred ? Object.keys(unitDictByIngred)[0] : "1" : "1");
  const [salesAreaType, setSalesAreaType] = useState(editData ? editData?.salesAreaType : salesAreaDict ? Object.keys(salesAreaDict)[0] : "1");

  const { defaultSetsByIngred, defaultSetsByIngredStat } = useDefaultSetsByIngred(ingredNm ?? null);
  const { ingredNmSuggestions, ingredNmSuggestionsStat } = useIngredNmSuggestions(ingredNm ?? null);
  const [ingredNmSuggestionsVisible, setIngredNmSuggestionsVisible] = useState(false);
  const [isRegisterContinue, setIsRegisterContinue] = useState(false);
  const [isBuyEveryWeek, setIsBuyEveryWeek] = useState(false);
  
  const ingredNmRef = useRef<HTMLInputElement>(null);
  const ingredNmSuggestionsRef = useRef<HTMLDivElement | null>(null);

  // 食材名以外の項目を変更してもデフォルト値更新の処理が動作してしまうため、フラグで管理
  const [isIngredNmChanged, setIsIngredNmChanged] = useState(false);

  useEffect(() => {setIsOpeningForm(true)}, [setIsOpeningForm]);

  // 食材名を変更した場合に単位と売り場の初期値を更新
  useEffect(() => {
    if(!defaultSetsByIngredStat.isLoading) {
      if(isIngredNmChanged) {
        if(defaultSetsByIngred?.unitCd) {
          setUnitCd(defaultSetsByIngred?.unitCd);
        };
        if(defaultSetsByIngred?.salesAreaType) {
          setSalesAreaType(defaultSetsByIngred?.salesAreaType);
        };
        setIsIngredNmChanged(false);
      };
    };
  }, [defaultSetsByIngred, defaultSetsByIngredStat, isIngredNmChanged]);

  const clearForm = () => {
    setIngredNm("");
    setQty(0);
    setUnitCd(unitDictByIngred ? Object.keys(unitDictByIngred)[0] : "1");
    setSalesAreaType(salesAreaDict ? Object.keys(salesAreaDict)[0] : "1");
  }

  const handleIngredNmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIngredNm(e.target.value);
    setIsIngredNmChanged(true);
    setIngredNmSuggestionsVisible(true);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData: IngredSelectFormData = {
      ingredNm,
      qty,
      unitCd,
      salesAreaType,
      isBuyEveryWeek,
      isRegisterContinue,
    };
    submitAction(formData, clearForm);
  };

  const handleKeyDown = (e: Event) => {
    
    if (e instanceof KeyboardEvent) {

      if (e.key === 'Enter') {
        if (ingredNmSuggestionsVisible) {
          e.preventDefault();
        };
        if (ingredNmSuggestionsRef.current && e.target instanceof Node) {
          if (ingredNmSuggestionsRef?.current?.contains(e.target)) {
            if (ingredNmSuggestions) { 
              const target = e.target as HTMLInputElement;
              setIngredNm(target.value);
              setIngredNmSuggestionsVisible(false);
            }
          };
        }
      };

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
    <div className="form-bg-layout-base">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700">食材名<RequiredMark/></label>
            <input
              type="text"
              value={ingredNm}
              onChange={handleIngredNmChange}
              onFocus={() => setIngredNmSuggestionsVisible(true)}
              className="form-input-base"
              required
              ref={ingredNmRef}
            />
          </div>
          {!ingredNmSuggestionsStat?.isLoading && ingredNmSuggestionsVisible && (
            <AutoComplete
              suggestions={ingredNmSuggestions}
              setCallback={(suggestion: string) => setIngredNm(suggestion)}
              setIsContentChanged={setIsIngredNmChanged}
              contentRef={ingredNmRef}
              suggestionsRef={ingredNmSuggestionsRef}
              setSuggestionsVisible={setIngredNmSuggestionsVisible}
            />
          )}

          <div className="mt-4">
            <label className="block text-sm text-gray-700">
              必要量{dataType === DATA_TYPE.RECIPE_INGRED && <RequiredMark />}
            </label>
            <input
              type="number"
              value={qty ?? ""}
              onChange={(e) => setQty(e.target.value ? Number(e.target.value) : null)}
              onFocus={() => setIngredNmSuggestionsVisible(false)}
              className="form-input-base"
              step="0.01"
              required={dataType === DATA_TYPE.RECIPE_INGRED ? true : false}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">
              単位{dataType === DATA_TYPE.RECIPE_INGRED && <RequiredMark />}
            </label>
            {!unitDictByIngredStat.isLoading ?
              <select
                value={unitCd ?? ""}
                onChange={(e) => setUnitCd(e.target.value)}
                className="form-input-base"
                required={dataType === DATA_TYPE.RECIPE_INGRED ? true : false}
              >
                <OptionFromDict dict={unitDictByIngred}/>
              </select>
            :
              <div className="form-input-base">
                <LoadingSpinner />
              </div>
            }
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">売り場</label>
            <select
              value={salesAreaType ?? ""}
              onChange={(e) => setSalesAreaType(e.target.value)}
              className={`form-input-base ${dataType === DATA_TYPE.RECIPE_INGRED && "bg-slate-200 text-slate-900"}`}
              disabled={dataType === DATA_TYPE.RECIPE_INGRED}
            >
              {!salesAreaDictStat.isLoading && <OptionFromDict dict={salesAreaDict} />}
            </select>
          </div>
          {dataType === DATA_TYPE.BUY_INGRED &&
            <CheckBoxItem
              label="毎週購入する"
              checked={isBuyEveryWeek}
              onChange={() => setIsBuyEveryWeek(!isBuyEveryWeek)}
            />
          }

          {editData === undefined &&
            <CheckBoxItem
              label="続けて登録"
              checked={isRegisterContinue}
              onChange={() => setIsRegisterContinue(!isRegisterContinue)}
            />
          }

          <div className="flex justify-between mt-8">
            <FormCloseButton onClick={closeIngredForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};
