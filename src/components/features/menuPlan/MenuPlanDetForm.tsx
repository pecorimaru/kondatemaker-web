import React, { useEffect, useRef, useState } from "react";


import { useRecipeNmSuggestions } from "../../../hooks/useFetchData";
import { FormCloseButton, FormSubmitButton, OptionFromDict, RequiredMark, AutoComplete } from "@/components/ui";
import { MenuPlanDetFormData } from "@/types";
import { useApp } from "@/hooks";
import { EMPTY_CD } from "@/constants";

interface MenuPlanDetFormProps {
  submitAction: (formData: { weekdayCd: string, recipeNm: string }) => void;
  closeMenuPlanDetForm: () => void;
  editData?: MenuPlanDetFormData;
}

export const MenuPlanDetForm: React.FC<MenuPlanDetFormProps> = ({ submitAction, closeMenuPlanDetForm, editData }) => {
  
  const { weekdayDict, setIsOpeningForm } = useApp()

  const [weekdayCd, setWeekdayCd] = useState<string>(editData?.weekdayCd ?? EMPTY_CD);
  const [recipeNm, setRecipeNm] = useState<string>(editData?.recipeNm ?? "");

  const { recipeNmSuggestions, recipeNmSuggestionsStat } = useRecipeNmSuggestions(recipeNm);
  const [recipeNmSuggestionsVisible, setRecipeNmSuggestionsVisible] = useState<boolean>(false);
  const recipeNmRef = useRef<HTMLInputElement>(null);
  const recipeNmSuggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {setIsOpeningForm(true)}, [setIsOpeningForm]);

  const handleRecipeNmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setRecipeNm(e.target.value);
    setRecipeNmSuggestionsVisible(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    submitAction({ weekdayCd, recipeNm });
  };

  return (
    <div className="form-bg-layout-base">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
              <label className="block text-sm text-gray-700">曜日<RequiredMark/></label>
              <select
                value={weekdayCd}
                onChange={(e) => setWeekdayCd(e.target.value)}
                className="form-input-base"
              >
                <OptionFromDict dict={weekdayDict} emptyOption={true} emptyLabel="" />
              </select>
            </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-700">レシピ名<RequiredMark/></label>
            <input
              type="text"
              id="recipeNm"
              value={recipeNm}
              onChange={handleRecipeNmChange}
              onFocus={() => setRecipeNmSuggestionsVisible(true)}
              className="form-input-base"
              autoComplete="off"
              required
              ref={recipeNmRef}
            />
              {!recipeNmSuggestionsStat?.isLoading && recipeNmSuggestionsVisible && (
                <AutoComplete
                  suggestions={recipeNmSuggestions}
                  setCallback={setRecipeNm}
                  contentRef={recipeNmRef}
                  suggestionsRef={recipeNmSuggestionsRef}
                  setSuggestionsVisible={setRecipeNmSuggestionsVisible}
                />
              )}

          </div>
          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeMenuPlanDetForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};
