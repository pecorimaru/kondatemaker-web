import '@/css/styles.css';
import '@/css/output.css';

import { LoadingSpinner, ContextMenu, AddRowButton } from '@/components/ui';
import { IngredUnitConvForm } from '@/components/features/ingred';
import { getClsHighlightedIfHover, getClsListHeight } from '@/utils';
import { useApp, useIngredUnitConvRow } from '@/hooks';
import { DATA_TYPE, VISIBLE_TYPE } from '@/constants';


export const IngredUnitConvRow: React.FC = () => {
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
    ingred,
    ingredUnitConvDtoList,
    ingredUnitConvDtoListStat,
    isAddIngredUnitConv,
    isEditIngredUnitConv,
    editData,
    openAddIngredForm,
    openEditIngredForm,
    closeIngredUnitConvForm,
    submitAddIngredUnitConv,
    submitEditIngredUnitConv,
    submitDeleteIngredUnitConv,
  } = useIngredUnitConvRow();


  if (ingredUnitConvDtoListStat.isLoading) {
    return (
      <>
        {ingred.ingredUnitConvVisible === VISIBLE_TYPE.OPEN &&
          <tr className="flex justify-end">
            <td className="w-54 py-2"><LoadingSpinner /></td>
          </tr>
        }
      </>
    );
  }

  return (
    <tr>
      <td>
        <table className="flex justify-end overflow-hidden">
          <tbody
            style={{
              height: `${getClsListHeight(ingred.ingredUnitConvVisible, ingredUnitConvDtoListStat.isLoading, ingredUnitConvDtoList)}px`,
              transition: 'height 0.3s ease',
            }}
          >
            {ingredUnitConvDtoListStat.isLoading ?
              <tr>
                <td className="flex justify-end">
                  <div className="w-61 py-2"><LoadingSpinner /></div>
                </td>
              </tr>
            :
              <>
                {ingredUnitConvDtoList?.map((row) => 
                  <tr 
                    key={row.ingredUnitConvId} 
                    onContextMenu={(e) => openContextMenu(e, row.ingredUnitConvId, DATA_TYPE.INGRED_UNIT_CONV)}
                    onTouchStart={(e) => touchStart(e, row.ingredUnitConvId, DATA_TYPE.INGRED_UNIT_CONV)} 
                    onTouchEnd={() => touchEnd()} 
                    onMouseEnter={() => hoveredRowSetting(row.ingredUnitConvId)}
                    onMouseLeave={() => setApplyHighlighted(false)}
                    className={`detail-table-row ${getClsHighlightedIfHover(row.ingredUnitConvId, hoveredId, applyHighlighted)}`}
                  >
                    <td className="detail-table-data bg-white w-20 group-hover:bg-blue-100">
                      {!unitDictStat.isLoading ? `${ingred.unitConvWeight} ${unitDict?.[ingred.buyUnitCd]}` : <LoadingSpinner /> }
                    </td>
                    <td className="detail-table-data bg-white w-12 group-hover:bg-blue-100">
                      ＝
                    </td>
                    <td className="detail-table-data bg-white w-20 group-hover:bg-blue-100">
                      {!unitDictStat.isLoading ? `${Math.round((row.convRate * (ingred.unitConvWeight || 1)) * 100) / 100} ${unitDict?.[row.convUnitCd]}` : <LoadingSpinner /> }

                      {(contextDataType === DATA_TYPE.INGRED_UNIT_CONV && row.ingredUnitConvId === contextMenuTargetId) && 
                        <ContextMenu menuList={[
                          {label: "編集", onClick: () => openEditIngredForm(row)},
                          {label: "削除", onClick: () => submitDeleteIngredUnitConv(row)}
                        ]}/> 
                      }
                    </td>
                  </tr>
                )}
                <AddRowButton textContent="単位変換を追加" onClick={openAddIngredForm} cssWidth={"w-54"} />
              </>
          }
          </tbody>
        </table>
        {isAddIngredUnitConv && 
          <IngredUnitConvForm 
            ingred={ingred} 
            submitAction={submitAddIngredUnitConv} 
            closeIngredUnitConvForm={closeIngredUnitConvForm} 
          />
        }
        {isEditIngredUnitConv && 
          <IngredUnitConvForm 
            ingred={ingred} 
            submitAction={submitEditIngredUnitConv} 
            closeIngredUnitConvForm={closeIngredUnitConvForm}
            editData={editData}
          />
        }
      </td>
    </tr>
  );
};
