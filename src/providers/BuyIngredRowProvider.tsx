import React from 'react';
import { BuyIngredRowContextTypes, BuyIngredRowProviderTypes } from "@/types";
import { BuyIngredRowContext } from "@/contexts";
import { useApp, useBuyPage } from "@/hooks";


export const BuyIngredRowProvider: React.FC<BuyIngredRowProviderTypes> = ({
  row,
  index,
  children,
}) => {

  const { setApplyHighlighted } = useApp();

  const {
    openEditIngredForm,
    submitDeleteBuyIngred,
  } = useBuyPage();

  const cssColor = row?.isBought ? "bg-slate-300 text-slate-500" : "bg-white text-slate-900";

  const handleOpenEditIngredForm = () => {
    setApplyHighlighted(false);
    openEditIngredForm(row);
  };

  const handleSubmitDeleteBuyIngred = () => {
    setApplyHighlighted(false);
    submitDeleteBuyIngred(row);
  };

  const contextValue: BuyIngredRowContextTypes = {
    row,
    index,
    cssColor,
    handleOpenEditIngredForm,
    handleSubmitDeleteBuyIngred,
  };

  return (
    <BuyIngredRowContext.Provider value={contextValue}>
      {children}
    </BuyIngredRowContext.Provider>
  );
}; 