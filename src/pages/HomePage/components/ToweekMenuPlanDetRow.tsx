import '@/css/styles.css';
import '@/css/output.css';

import React from 'react';

import { ContextMenu, LoadingSpinner, AutoComplete } from '@/components/ui';
import { useApp, useToweekMenuPlanDetRow } from '@/hooks';
import { DATA_TYPE, WEEKDAY_ITEMS_DICT } from '@/constants';


// function getEditingToweekMenuPlanDet(toweekMenuPlanDetViewList: ToweekMenuPlanDetView[]) {
//   const toweekMenuPlanDet = toweekMenuPlanDetViewList.filter((item) => item.isEditing);
//   return toweekMenuPlanDet ? toweekMenuPlanDet[0] : undefined;
// };


export const ToweekMenuPlanDetRow:React.FC = () => {

  const { 
    openContextMenu, 
    touchStart, 
    touchEnd, 
    contextMenuTargetId,
  } = useApp();

  const { 
    weekdayCd,
    toweekMenuPlanDetViewListDict,
    isRefreshing,
    toweekMenuPlanDetViewList,
    recipeNmEditing,
    setIsEditing,
    recipeNmRef,
    recipeNmSuggestionsRef,
    recipeNmSuggestions,
    handleEditClick,
    handleAddRecipeNmChange,
    handleEditRecipeNmChange,
    handleEditSuggestionClick,
    handleAddSuggestionClick,
    submitDeleteToweekMenuPlanDet,
   } = useToweekMenuPlanDetRow();


  if (!toweekMenuPlanDetViewListDict) {
    return;
  };
  
  return (
    <>
      <tr className="flex justify-center gap-1.5 mt-1.5 text-base">
        <td className={`flex items-center justify-center text-slate-700 px-2 py-2 shadow-md w-28 rounded-sm ${WEEKDAY_ITEMS_DICT[weekdayCd].bgColor}`}>
          {WEEKDAY_ITEMS_DICT[weekdayCd].label.ja}
        </td>
        <td>
          {isRefreshing || toweekMenuPlanDetViewList?.length <= 0 ? 
            <>
              {isRefreshing ? 
                <div className="weekday-recipe-data-base">
                  <LoadingSpinner />
                </div>
              :
                <div>
                  <input
                    type="text"
                    id="recipeNm"
                    value={recipeNmEditing}
                    className="weekday-recipe-data-base"
                    onClick={() => setIsEditing(true)}
                    onChange={(e) => handleAddRecipeNmChange(e)}
                    placeholder="未定"
                    ref={recipeNmRef}
                    autoComplete='off'
                  />  
                  {recipeNmSuggestions && recipeNmSuggestions.length > 0 &&
                    <AutoComplete
                      suggestions={recipeNmSuggestions}
                      setCallback={(suggestions) => handleAddSuggestionClick(suggestions)}
                      contentRef={recipeNmRef}
                      suggestionsRef={recipeNmSuggestionsRef}
                    />
                  }
                </div> 
              }
            </>
          : toweekMenuPlanDetViewList?.map((row, index) => (
            <div 
              key={index} 
              className={`bg-white ${index > 0 && "mt-1.5"}`}  // １つの曜日に複数のレシピがある場合のみ、mt-1.5を指定
              onContextMenu={(e) => openContextMenu(e, row?.toweekMenuPlanDetId, DATA_TYPE.TOWEEK_MENU_PLAN_DET)}
              onTouchStart={(e) => touchStart(e, row?.toweekMenuPlanDetId, DATA_TYPE.TOWEEK_MENU_PLAN_DET)} 
              onTouchEnd={touchEnd} 
            >
              {row?.isEditing ?
                <>
                  <input
                    type="text"
                    id="recipeNm"
                    value={row?.recipeNm}
                    onChange={(e) => handleEditRecipeNmChange(e, row)}
                    className="weekday-recipe-data-base"
                    placeholder="未定"
                    ref={recipeNmRef}
                  />
                  {recipeNmSuggestions && recipeNmSuggestions.length > 0 &&
                    <AutoComplete
                      suggestions={recipeNmSuggestions}
                      setCallback={(suggestions) => handleEditSuggestionClick(suggestions, row)}
                      contentRef={recipeNmRef}
                      suggestionsRef={recipeNmSuggestionsRef}
                    />
                  }
                </>
              :
                <div
                  onClick={row?.recipeUrl ? () => window.open(row?.recipeUrl || "", '_blank') : undefined}
                  id="recipeNm"
                  className={
                    `weekday-recipe-data-base 
                    ${!row?.recipeNm ? "text-gray-400" : !row?.recipeUrl ? "text-slate-700" : "text-blue-500 underline cursor-pointer "}
                    ${row?.isAlert && "bg-red-100 "} `}
                >
                  {row?.recipeNm ? row?.recipeNm : "未定"}
                </div>
              }
              {row?.toweekMenuPlanDetId === contextMenuTargetId && <ContextMenu menuList={[
                { label: "編集", onClick: () => handleEditClick(row, index) },
                { label: "削除", onClick: () => submitDeleteToweekMenuPlanDet(row) },
              ]} />}
            </div>
          ))}
        </td>
      </tr>
    </>
  );
};