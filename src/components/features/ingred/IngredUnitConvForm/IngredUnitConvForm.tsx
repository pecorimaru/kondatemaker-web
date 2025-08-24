import React, { useEffect, useState } from "react";

import { FormCloseButton, FormSubmitButton } from "@/components/ui";
import { IngredDto, IngredUnitConvFormData } from "@/types";
import { useApp } from "@/hooks";
import { UNIT_CONV_TYPE_100_COMP } from "@/constants";
import { ConvUnitToStandardUnit } from "./ConvUnitToStandardUnit";
import { StandardUnitToConvUnit } from "./StandardUnitToConvUnit";

interface IngredUnitConvFormProps {
  ingred: IngredDto;
  submitAction: (formData: IngredUnitConvFormData) => void;
  closeIngredUnitConvForm: () => void;
  editData?: Partial<IngredUnitConvFormData>;
}

// interface ConvUnitToStandardUnitProps {
//   ingred: IngredDto;
//   convUnitCd: string;
//   setFromUnitCd: (fromUnitCd: string) => void;
//   convRate: number;
//   setConvRate: (convRate: number) => void;
//   excConvRate: number;
//   setExcConvRate: (excConvRate: number) => void;
//   convUnitWeight?: number | null;
// }

// interface StandardUnitToConvUnitProps {
//   ingred: IngredDto;
//   convUnitCd: string;
//   setFromUnitCd: (fromUnitCd: string) => void;
//   convRate: number;
//   setConvRate: (convRate: number) => void;
//   excConvRate: number;
//   setExcConvRate: (excConvRate: number) => void;
// }

export const IngredUnitConvForm: React.FC<IngredUnitConvFormProps> = ({ ingred, submitAction, closeIngredUnitConvForm, editData }) => {

  const { unitDict, setIsOpeningForm } = useApp();
  const [convUnitCd, setFromUnitCd] = useState<string>(editData ? editData?.convUnitCd || (unitDict ? Object.keys(unitDict)[0] : "1") : unitDict ? Object.keys(unitDict)[0] : "1");
  const [convRate, setConvRate] = useState<number>(ingred.unitConvWeight && editData?.convRate ? editData.convRate * ingred.unitConvWeight : 0);
  const [excConvRate, setExcConvRate] = useState<number>(editData?.convWeight && editData?.convRate ? editData.convWeight / editData.convRate : 0);
  const [convUnitWeight] = useState<number | null | undefined>(editData?.convWeight);
  const [formToggle, setFormToggle] = useState<boolean>(ingred.unitConvWeight ? ingred.unitConvWeight === UNIT_CONV_TYPE_100_COMP : false);

  useEffect(() => {setIsOpeningForm(true)}, [setIsOpeningForm]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ingred.ingredId) {
      const formData: IngredUnitConvFormData = { 
        ingredId: ingred.ingredId, 
        convUnitCd: convUnitCd, 
        convRate: convRate,
        convWeight: convUnitWeight
      };
      submitAction(formData);
    }
  };

  return (
    <div className="form-bg-layout-base">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-end">
          <div className="inline-block">
            <button 
              className={`fa-solid fa-arrow-right-arrow-left bg-lime-400 text-white mt-0.5 py-2 px-2 rounded-md shadow-sm border-b-4 border-lime-500 hover:bg-lime-400 hover:shadow-lg active:shadow-sm active:border-opacity-0 active:translate-y-0.5 transition duration-100`}
              onClick={() => setFormToggle(!formToggle)}
            />
          </div>
        </div>
        <form 
          onSubmit={handleSubmit}
        >    
          {formToggle ?
            <ConvUnitToStandardUnit
              ingred={ingred}
              convUnitCd={convUnitCd}
              setFromUnitCd={setFromUnitCd}
              setConvRate={setConvRate}
              excConvRate={excConvRate}
              setExcConvRate={setExcConvRate}
              convUnitWeight={convUnitWeight}
            /> :
            <StandardUnitToConvUnit
              ingred={ingred}
              convUnitCd={convUnitCd}
              convRate={convRate}
              setFromUnitCd={setFromUnitCd}
              setConvRate={setConvRate}
              setExcConvRate={setExcConvRate}
            />}
          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeIngredUnitConvForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};

// // 例：かぼちゃは1個あたり1200g
// const ConvUnitToStandardUnit: React.FC<ConvUnitToStandardUnitProps> = ({ ingred, convUnitCd, setFromUnitCd, setConvRate, excConvRate, setExcConvRate, convUnitWeight }) => {

//   const { unitDict, unitDictStat } = useApp();

//   const handleConvRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const value = parseFloat(e.target.value);
//     setExcConvRate(value);
//     if (ingred.unitConvWeight) {
//       setConvRate(ingred.unitConvWeight / value);
//     }
//   };

//   return (
//     <div>
//       <div className="mt-4 text-lg">
//         <div>
//           {`${ingred.ingredNm} は`}
//         </div>
//         <div className="flex items-center mt-2">
//           <span className="mx-2 text-center w-8">{convUnitWeight ? convUnitWeight : 1}</span>
//           <select
//             id="convUnitCd"
//             value={convUnitCd}
//             onChange={(e) => setFromUnitCd(e.target.value)}
//             className="form-input-base w-28"
//           >
//             {!unitDictStat.isLoading && <OptionFromDict dict={unitDict} />}
//           </select>  
//           <span className="pl-2 w-16">あたり</span>
//         </div>
//       </div>
//       <div className="flex items-center mt-2 ">
//         <span className="mx-2 w-8" />
//         <input
//           type="number"
//           id="excConvRate"
//           value={excConvRate}
//           onChange={handleConvRateChange}
//           className="form-input-base w-36"
//           step="0.01"
//         />
//         <span className="pl-2 w-14">
//           {unitDict && unitDict[ingred.buyUnitCd]}
//         </span>
//       </div>
//     </div>
//   )
// };

// // かぼちゃは100gあたり0.83個
// const StandardUnitToConvUnit: React.FC<StandardUnitToConvUnitProps> = ({ ingred, convUnitCd, setFromUnitCd, convRate, setConvRate, excConvRate, setExcConvRate }) => {

//   const { unitDict, unitDictStat } = useApp();

//   const handleConvRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const value = parseFloat(e.target.value);
//     setConvRate(value);
//     if (ingred.unitConvWeight) {
//       setExcConvRate(ingred.unitConvWeight / value);
//     }
//   };

//   return (
//     <div className="mx-0.5">
//       <div className="text-lg">
//         {!unitDictStat.isLoading && unitDict ? `${ingred.ingredNm} は ${ingred.unitConvWeight} ${unitDict[ingred.buyUnitCd]} あたり` : <LoadingSpinner />}
//       </div>
//       <div className="flex justify-between gap-1 mt-2">
//         <input
//           type="number"
//           id="convRate"
//           value={convRate}
//           onChange={handleConvRateChange}
//           className="form-input-base w-32"
//           step="0.01"
//         />
//         <select
//           id="convRate"
//           value={convUnitCd}
//           onChange={(e) => setFromUnitCd(e.target.value)}
//           className="form-input-base w-28"
//         >
//           {!unitDictStat.isLoading && <OptionFromDict dict={unitDict} />}
//         </select>
//       </div>
//     </div>
//   );
// };