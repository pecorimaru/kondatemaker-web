import '@/css/styles.css';
import '@/css/output.css';

import { FaAngleDown } from "react-icons/fa6";

import { useApp } from '@/hooks';
import { useRecipePage } from '@/hooks/useRecipePage';

import { RecipeForm } from '@/components/features/recipe';
import { ContextMenu, FloatingActionButton, LoadingSpinner, TableBodyLoading } from '@/components/ui';
import { getClsArrowRotation, switchVisibleType } from '@/utils';
import { DATA_TYPE, VISIBLE_TYPE } from '@/constants';
import { RecipeIngredRow } from './components/RecipeIngredRow';
import { RecipeIngredRowProvider } from '@/providers';


export const RecipePage = () => {

  const {
    recipeTypeDict,
    recipeTypeDictStat,
    touchStart,
    touchEnd,
    openContextMenu,
    contextMenuTargetId,
    hoveredId,
    applyHighlighted,
    setApplyHighlighted,
    hoveredRowSetting,
    contextDataType,
  } = useApp();

  // useRecipePageカスタムフックから値・関数を取得
  const {
    recipeDtoListStat,
    recipeViewList,
    isAddRecipe,
    isEditRecipe,
    editData,
    openAddRecipeForm,
    openEditRecipeForm,
    closeRecipeForm,
    submitAddRecipe,
    submitEditRecipe,
    submitDeleteRecipe,
    switchFlgRecipeAcc,
  } = useRecipePage();


  return(
    <div className="main-container">
      <div className="mt-header-mb-footer">
        <table className="mt-3">
          <thead>
            <tr className="header-table-row">
              <th className="header-table-data w-56">レシピ</th>
              <th className="header-table-data w-16">分類</th>
              <th className="header-table-data w-12">食材</th>
            </tr>
          </thead>
          {!recipeDtoListStat.isLoading ? 
            <>
              {recipeViewList?.map((row, index) => (
                // フラグメントで返却するとスマホで[row?.recipeIngredVisible]を非表示に切り替えた際に
                // レイアウトが崩れるため、<tbody>で返却する
                <tbody key={row?.recipeId}>
                  <tr  
                    onContextMenu={(e) => openContextMenu(e, row?.recipeId, DATA_TYPE.RECIPE)}
                    onTouchStart={(e) => touchStart(e, row?.recipeId, DATA_TYPE.RECIPE)} 
                    onTouchEnd={() => touchEnd()} 
                    onMouseEnter={() => hoveredRowSetting(row?.recipeId)}
                    onMouseLeave={() => setApplyHighlighted(false)}
                    className={`detail-table-row ${(applyHighlighted && row?.recipeId === hoveredId) && "group"}`}
                  >
                    <td 
                      className="detail-table-data bg-white w-56 group-hover:bg-blue-100"
                    >
                      <span 
                        onClick={row?.recipeUrl ? () => window.open(row?.recipeUrl || undefined, '_blank') : undefined}
                        className={`${!row?.recipeUrl ? "text-slate-700" : "text-blue-500 underline cursor-pointer"}`}
                      >
                        {row.recipeNm}
                      </span>
                    </td>
                    <td className="detail-table-data bg-white w-16 group-hover:bg-blue-100">
                      {!recipeTypeDictStat.isLoading ? recipeTypeDict?.[row?.recipeType ?? ''] : <LoadingSpinner />}
                      {/* 個別にtdタグで配置すると[detail-table-row]定義した[gap-1]によって余分な間隔が発生するため
                          onClickイベントが無いtdタグに混在させることで回避。 */}
                      {(contextDataType === DATA_TYPE.RECIPE && row?.recipeId === contextMenuTargetId) &&
                        <ContextMenu menuList={[
                          {label: "編集", onClick: () => openEditRecipeForm(row)},
                          {label: "削除", onClick: () => submitDeleteRecipe(row)},
                        ]} />
                      }
                    </td>
                    <td 
                      className="detail-table-data bg-white w-12 group-hover:bg-blue-100"
                      onClick={() => switchFlgRecipeAcc(index, "recipeIngredVisible", switchVisibleType(row.recipeIngredVisible))}
                    >
                      <FaAngleDown className={`${getClsArrowRotation(row.recipeIngredVisible)}`}/>
                    </td>
                  </tr>
                  {row.recipeIngredVisible !== VISIBLE_TYPE.HIDDEN && 
                    <RecipeIngredRowProvider recipe={row}>
                      <RecipeIngredRow />
                    </RecipeIngredRowProvider>
                  }
                </tbody>
              ))}
              {/* <tbody>
                <AddRowButton textContent="レシピを追加" onClick={openAddRecipeForm} cssWidth="w-full" />
              </tbody> */}
            </>
          :
            <TableBodyLoading />
          }
        </table>
        <FloatingActionButton onClick={openAddRecipeForm} />
        {isAddRecipe && <RecipeForm submitAction={submitAddRecipe} closeRecipeForm={closeRecipeForm} />}
        {isEditRecipe && <RecipeForm submitAction={submitEditRecipe} closeRecipeForm={closeRecipeForm} editData={editData} />}
      </div>    
    </div>
  );
};  
