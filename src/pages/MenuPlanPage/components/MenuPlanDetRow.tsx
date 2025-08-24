import '@/css/styles.css';
import '@/css/output.css';

import { AddRowButton, ContextMenu, LoadingSpinner } from '@/components/ui';
import { MenuPlanDetForm } from '@/components/features/menuPlan';
import { useApp, useMenuPlanDetRow } from '@/hooks';

import { DATA_TYPE, WEEKDAY_ITEMS_DICT } from '@/constants';
import { getClsListHeight, getClsHighlightedIfHover } from '@/utils';


export const MenuPlanDetRow: React.FC = () => {

  const {
    contextDataType,
    contextMenuTargetId,
    hoveredId,
    applyHighlighted,
    openContextMenu,
    touchStart,
    touchEnd,
    hoveredRowSetting,
    setApplyHighlighted,
  } = useApp();

  const {
    menuPlan,
    weekdayDict,
    weekdayDictStat,
    menuPlanDetDtoListStat,
    menuPlanDetViewList,
    isAddMenuPlanDet,
    isEditMenuPlanDet,
    editData,
    submitAddMenuPlanDet,
    openAddMenuPlanDetForm,
    openEditMenuPlanDetForm,
    closeMenuPlanDetForm,
    submitEditMenuPlanDet,
    submitDeleteMenuPlanDet,
  } = useMenuPlanDetRow();

  return (
    <tr>
      <td>
        <table className="flex justify-end overflow-hidden">
          <tbody
            style={{
              height: `${getClsListHeight(menuPlan.menuPlanDetVisible, menuPlanDetDtoListStat.isLoading, menuPlanDetViewList)}px`,
              transition: 'height 0.3s ease',
            }}
          >
            {menuPlanDetDtoListStat.isLoading ?
              <tr>
                <td className="flex justify-end">
                  <div className="w-61 py-2"><LoadingSpinner /></div>
                </td>
              </tr>
            :
              <>
                {menuPlanDetViewList?.map((row) =>             
                  <tr 
                    key={row.menuPlanDetId} 
                    onContextMenu={(e) => openContextMenu(e, row.menuPlanDetId, DATA_TYPE.MENU_PLAN_DET)}
                    onTouchStart={(e) => touchStart(e, row.menuPlanDetId, DATA_TYPE.MENU_PLAN_DET)} 
                    onTouchEnd={() => touchEnd()} 
                    onMouseEnter={() => hoveredRowSetting(row.menuPlanDetId)}
                    onMouseLeave={() => setApplyHighlighted(false)}
                    className={`detail-table-row ${getClsHighlightedIfHover(row.menuPlanDetId, hoveredId, applyHighlighted)}`}
                  >
                    <td className={`detail-table-data w-16 ${WEEKDAY_ITEMS_DICT[row.weekdayCd].bgColor}`}>
                      {!weekdayDictStat.isLoading && weekdayDict ? weekdayDict[row.weekdayCd] : <LoadingSpinner />}
                    </td>
                    <td className="detail-table-data bg-white w-44 group-hover:bg-blue-100">
                      {`${row.recipeNm}`}

                      {(contextDataType === DATA_TYPE.MENU_PLAN_DET && row.menuPlanDetId === contextMenuTargetId) &&
                        <ContextMenu menuList={[
                          {label: "編集", onClick: () => openEditMenuPlanDetForm(row)},
                          {label: "削除", onClick: () => submitDeleteMenuPlanDet(row)},
                        ]} />
                      }
                    </td>
                  </tr>
                )}
              </>
            }
            <AddRowButton textContent="献立を追加" onClick={openAddMenuPlanDetForm} cssWidth="w-61" />
          </tbody>
        </table>
        {isAddMenuPlanDet && <MenuPlanDetForm submitAction={submitAddMenuPlanDet} closeMenuPlanDetForm={closeMenuPlanDetForm} />}
        {isEditMenuPlanDet && <MenuPlanDetForm submitAction={submitEditMenuPlanDet} closeMenuPlanDetForm={closeMenuPlanDetForm} editData={editData} />}
      </td>
    </tr>
  );
};
  