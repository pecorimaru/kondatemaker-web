import React, { useEffect, useState } from "react";

import { useApp } from "@/hooks";
import { FormCloseButton, FormSubmitButton, OptionFromDict, RequiredMark } from "@/components/ui";
import { RecipeFormData } from "@/types";

interface RecipeFormProps {
  submitAction: (formData: RecipeFormData) => Promise<void>;
  closeRecipeForm: () => void;
  editData?: RecipeFormData;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ submitAction, closeRecipeForm, editData }) => {

  const { recipeTypeDict, recipeTypeDictStat, setIsOpeningForm } = useApp();
  
  const [recipeNm, setRecipeNm] = useState<string>(editData?.recipeNm || '');
  const [recipeNmK, setRecipeNmK] = useState<string>(editData?.recipeNmK || '');
  const [recipeType, setRecipeType] = useState<string>(editData?.recipeType || (recipeTypeDict ? Object.keys(recipeTypeDict)[0] : ''));
  const [recipeUrl, setRecipeUrl] = useState<string>(editData?.recipeUrl || '');
  
  useEffect(() => {setIsOpeningForm(true)}, [setIsOpeningForm]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitAction({recipeId: editData?.recipeId, recipeNm, recipeNmK, recipeType, recipeUrl});
  };

  return (
    <div className="form-bg-layout-base">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm text-gray-700">レシピ名<RequiredMark/></label>
            <input
              type="text"
              id="recipeNm"
              value={recipeNm}
              onChange={(e) => setRecipeNm(e.target.value)}
              className="form-input-base"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">レシピ名（かな）</label>
            <input
              type="text"
              id="recipeNmK"
              value={recipeNmK}
              onChange={(e) => setRecipeNmK(e.target.value)}
              className="form-input-base"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">レシピ区分<RequiredMark/></label>
            <select
              value={recipeType}
              onChange={(e) => setRecipeType(e.target.value)}
              className="form-input-base"
            >
              {!recipeTypeDictStat.isLoading && <OptionFromDict dict={recipeTypeDict} />}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">レシピURL</label>
            <input
              type="text"
              value={recipeUrl}
              onChange={(e) => setRecipeUrl(e.target.value)}
              className="form-input-base"
            />
          </div>

          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeRecipeForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};
