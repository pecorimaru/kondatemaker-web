import React from "react";
import { IngredDto } from "@/types";
import { useApp } from "@/hooks";
import { LoadingSpinner, OptionFromDict } from "@/components/ui";

interface StandardUnitToConvUnitProps {
  ingred: IngredDto;
  convUnitCd: string;
  setFromUnitCd: (fromUnitCd: string) => void;
  convRate: number;
  setConvRate: (convRate: number) => void;
  setExcConvRate: (excConvRate: number) => void;
}

// かぼちゃは100gあたり0.83個
export const StandardUnitToConvUnit: React.FC<StandardUnitToConvUnitProps> = ({ 
  ingred, 
  convUnitCd, 
  setFromUnitCd, 
  convRate, 
  setConvRate, 
  setExcConvRate 
}) => {
  const { unitDict, unitDictStat } = useApp();

  const handleConvRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = parseFloat(e.target.value);
    setConvRate(value);
    if (ingred.unitConvWeight) {
      setExcConvRate(ingred.unitConvWeight / value);
    }
  };

  return (
    <div className="mx-0.5">
      <div className="text-lg">
        {!unitDictStat.isLoading && unitDict ? `${ingred.ingredNm} は ${ingred.unitConvWeight} ${unitDict[ingred.buyUnitCd]} あたり` : <LoadingSpinner />}
      </div>
      <div className="flex justify-between gap-1 mt-2">
        <input
          type="number"
          id="convRate"
          value={convRate}
          onChange={handleConvRateChange}
          className="form-input-base w-32"
          step="0.01"
        />
        <select
          id="convRate"
          value={convUnitCd}
          onChange={(e) => setFromUnitCd(e.target.value)}
          className="form-input-base w-28"
        >
          {!unitDictStat.isLoading && <OptionFromDict dict={unitDict} />}
        </select>
      </div>
    </div>
  );
}; 