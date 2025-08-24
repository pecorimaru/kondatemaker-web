import '@/css/styles.css';
import '@/css/output.css';

import { DATA_TYPE, VISIBLE_TYPE } from '@/constants';
import { MenuPlanDetRow } from './components';
import { FaAngleDown } from 'react-icons/fa6';
import { getClsArrowRotation, getClsHighlightedIfHover, switchVisibleType } from '@/utils';
import { ContextMenu, FloatingActionButton, TableBodyLoading } from '@/components/ui';
import { MenuPlanForm } from '@/components/features';
import { MenuPlanDetRowProvider } from '@/providers';
import { useApp, useMenuPlanPage } from '@/hooks';

export const MenuPlanPage = () => {

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
    menuPlanViewList,
    isAddMenuPlan,
    isEditMenuPlan,
    editData,
    updateMenuPlanViewList,
    openAddMenuPlanForm,
    openEditMenuPlanForm,
    closeMenuPlanForm,
    submitAddMenuPlan,
    submitEditMenuPlan,
    submitDeleteMenuPlan,
  } = useMenuPlanPage();

  return (
    <div className="main-container">
      <div className="mt-header-mb-footer">
        <table className="mt-3">
          <thead>
            <tr className="header-table-row">
              <th className="header-table-data w-52">献立プラン</th>
              <th className="header-table-data w-12">詳細</th>
            </tr>
          </thead>
          {menuPlanViewList ?
            <>
              {menuPlanViewList.map((row, index) => (
                <tbody key={row.menuPlanId}>
                  <tr 
                    onContextMenu={(e) => openContextMenu(e, row.menuPlanId, DATA_TYPE.MENU_PLAN)}
                    onTouchStart={(e) => touchStart(e, row.menuPlanId, DATA_TYPE.MENU_PLAN)} 
                    onTouchEnd={() => touchEnd()} 
                    onMouseEnter={() => hoveredRowSetting(row.menuPlanId)}
                    onMouseLeave={() => setApplyHighlighted(false)}
                    className={`detail-table-row ${getClsHighlightedIfHover(row.menuPlanId, hoveredId, applyHighlighted)}`}
                  >
                    <td className="detail-table-data bg-white w-52 group-hover:bg-blue-100">
                      {row?.menuPlanNm}
                      {(contextDataType === DATA_TYPE.MENU_PLAN && row.menuPlanId === contextMenuTargetId) && 
                        <ContextMenu menuList={[
                          {label: "編集", onClick: () => openEditMenuPlanForm(row)},
                          {label: "削除", onClick: () => submitDeleteMenuPlan(row)},
                        ]} />
                      }
                    </td>
                    <td 
                      className="detail-table-data bg-white w-12 group-hover:bg-blue-100" 
                      onClick={() => updateMenuPlanViewList(index, "menuPlanDetVisible", switchVisibleType(row.menuPlanDetVisible))}
                    >
                      <FaAngleDown className={`${getClsArrowRotation(row.menuPlanDetVisible)}`}/>
                    </td>
                  </tr>
                  {row.menuPlanDetVisible !== VISIBLE_TYPE.HIDDEN && 
                    <MenuPlanDetRowProvider menuPlan={row}>
                      <MenuPlanDetRow />
                    </MenuPlanDetRowProvider>
                  }
                </tbody>
              ))}
              {/* <tbody>
                <AddRowButton textContent="献立プランを追加" onClick={openAddMenuPlanForm} cssWidth="w-full"/>
              </tbody> */}
            </>
          :
            <TableBodyLoading />
          }
        </table>
        <FloatingActionButton onClick={openAddMenuPlanForm} />
        {isAddMenuPlan && 
          <MenuPlanForm 
            submitAction={submitAddMenuPlan}
            closeMenuPlanForm={closeMenuPlanForm}
          />
        }
        {isEditMenuPlan && 
          <MenuPlanForm 
            submitAction={submitEditMenuPlan}
            closeMenuPlanForm={closeMenuPlanForm}
            editData={editData}
          />
        }
      </div>    
    </div>
  );
};    
