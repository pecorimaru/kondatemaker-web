import '@/css/styles.css';
import '@/css/output.css';

import { useApp, useRecipeIngredRow } from '@/hooks';
import { LoadingSpinner, AddRowButton, ContextMenu } from '@/components/ui';
import { IngredSelectForm } from '@/components/features/ingred';
import { getClsHighlightedIfHover, getClsListHeight } from '@/utils';

import { DATA_TYPE } from '@/constants';


export const RecipeIngredRow: React.FC = () => {

  const { 
    unitDict, 
    unitDictStat, 
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

  const {
    recipe,
    recipeIngredViewList,
    recipeIngredDtoListStat,
    isAddIngred,
    isEditIngred,
    editData,
    openAddIngredForm,
    openEditIngredForm,
    closeIngredForm,
    submitAddRecipeIngred,
    submitEditRecipeIngred,
    submitDeleteRecipeIngred,
  } = useRecipeIngredRow();


  return (
    <tr>
      <td>
        <table className="flex justify-end overflow-hidden">
          <tbody
            style={{
              height: `${getClsListHeight(recipe.recipeIngredVisible, recipeIngredDtoListStat.isLoading, recipeIngredViewList)}px`,
              transition: 'height 0.3s ease',
            }}
          >
            {recipeIngredDtoListStat.isLoading ?
              <tr>
                <td className="flex justify-end">
                  <div className="w-61 py-2"><LoadingSpinner /></div>
                </td>
              </tr>
            :
              <>
                {recipeIngredViewList?.map((row) => 
                  <tr 
                    key={row.recipeIngredId} 
                    onContextMenu={(e) => openContextMenu(e, row.recipeIngredId, DATA_TYPE.RECIPE_INGRED)}
                    onTouchStart={(e) => touchStart(e, row.recipeIngredId, DATA_TYPE.RECIPE_INGRED)} 
                    onTouchEnd={() => touchEnd()} 
                    onMouseEnter={() => hoveredRowSetting(row.recipeIngredId)}
                    onMouseLeave={() => setApplyHighlighted(false)}
                    className={`detail-table-row ${getClsHighlightedIfHover(row.recipeIngredId, hoveredId, applyHighlighted)}`}
                  >
                    <td className="detail-table-data bg-white w-36 group-hover:bg-blue-100">
                      {row.ingredNm}
                    </td>
                    <td className="detail-table-data bg-white w-16 group-hover:bg-blue-100">
                      {!unitDictStat.isLoading && unitDict ? `${row.qty} ${unitDict[row?.unitCd ?? '']}` : <LoadingSpinner />}

                      {/* gap-1 によって間隔が作られてしまうため最後の<td>タグエリアを間借りする */}
                      {(contextDataType === DATA_TYPE.RECIPE_INGRED && row.recipeIngredId === contextMenuTargetId) && 
                        <ContextMenu menuList={[
                          {label: "編集", onClick: () => openEditIngredForm(row)},
                          {label: "削除", onClick: () => submitDeleteRecipeIngred(row)}
                        ]}/> 
                      }
                    </td>
                  </tr>
                )}
                <AddRowButton textContent="食材を追加" onClick={openAddIngredForm} cssWidth="w-53" />
              </>
            }
          </tbody>
        </table>
        {isAddIngred && 
          <IngredSelectForm 
            dataType={DATA_TYPE.RECIPE_INGRED} 
            submitAction={submitAddRecipeIngred} 
            closeIngredForm={closeIngredForm} 
          />
        }
        {isEditIngred && 
          <IngredSelectForm 
            dataType={DATA_TYPE.RECIPE_INGRED} 
            submitAction={submitEditRecipeIngred} 
            closeIngredForm={closeIngredForm} 
            editData={editData} 
          />
        }
      </td>
    </tr>
  );
};
