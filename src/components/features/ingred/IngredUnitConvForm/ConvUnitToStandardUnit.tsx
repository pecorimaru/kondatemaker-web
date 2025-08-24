import React from "react";
import { IngredDto } from "@/types";
import { useApp } from "@/hooks";
import { OptionFromDict } from "@/components/ui";

interface ConvUnitToStandardUnitProps {
  ingred: IngredDto;
  convUnitCd: string;
  setFromUnitCd: (fromUnitCd: string) => void;
  setConvRate: (convRate: number) => void;
  excConvRate: number;
  setExcConvRate: (excConvRate: number) => void;
  convUnitWeight?: number | null;
}

// 例：かぼちゃは1個あたり1200g
export const ConvUnitToStandardUnit: React.FC<ConvUnitToStandardUnitProps> = ({ 
  ingred, 
  convUnitCd, 
  setFromUnitCd, 
  setConvRate, 
  excConvRate, 
  setExcConvRate, 
  convUnitWeight 
}) => {
  const { unitDict, unitDictStat } = useApp();

  const handleConvRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = parseFloat(e.target.value);
    setExcConvRate(value);
    if (ingred.unitConvWeight) {
      setConvRate(ingred.unitConvWeight / value);
    }
  };

  return (
    <div>
      <div className="mt-4 text-lg">
        <div>
          {`${ingred.ingredNm} は`}
        </div>
        <div className="flex items-center mt-2">
          <span className="mx-2 text-center w-8">{convUnitWeight ? convUnitWeight : 1}</span>
          <select
            id="convUnitCd"
            value={convUnitCd}
            onChange={(e) => setFromUnitCd(e.target.value)}
            className="form-input-base w-28"
          >
            {!unitDictStat.isLoading && <OptionFromDict dict={unitDict} />}
          </select>  
          <span className="pl-2 w-16">あたり</span>
        </div>
      </div>
      <div className="flex items-center mt-2 ">
        <span className="mx-2 w-8" />
        <input
          type="number"
          id="excConvRate"
          value={excConvRate}
          onChange={handleConvRateChange}
          className="form-input-base w-36"
          step="0.01"
        />
        <span className="pl-2 w-14">
          {unitDict && unitDict[ingred.buyUnitCd]}
        </span>
      </div>
    </div>
  );
}; 