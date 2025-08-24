import '@/css/styles.css';
import '@/css/output.css';

import React from "react";
import { FaAngleDown } from 'react-icons/fa6';

import { ContextMenu, FloatingActionButton, LoadingSpinner, TableBodyLoading } from '@/components/ui';
import { IngredForm } from '@/components/features/ingred';
import { IngredUnitConvRow } from './components';

import { switchVisibleType } from '@/utils';
import { useApp, useIngredPage } from '@/hooks';
import { DATA_TYPE, VISIBLE_TYPE } from '@/constants';
import { IngredUnitConvRowProvider } from '@/providers';


export const IngredPage: React.FC = () => {
  const { 
    unitDict, 
    unitDictStat, 
    salesAreaDict, 
    salesAreaDictStat, 
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
    ingredViewList,
    isAddIngred,
    isEditIngred,
    editData,
    openAddIngredForm,
    openEditIngredForm,
    closeIngredForm,
    submitAddIngred,
    submitEditIngred,
    submitDeleteIngred,
    switchFlgIngredAcc,
    flg,
  } = useIngredPage();


  return(
    <div className="main-container">
      <div className="mt-header-mb-footer">
        <table className="mt-3">
          <thead>
            <tr className="header-table-row items-center">
              <th className="bg-blue-900 font-bold shadow-lg rounded-sm py-3.5 w-32">食材名</th>
              <th className="bg-blue-900 font-bold shadow-lg rounded-sm py-1 w-14">購入<br />単位</th>
              <th className="bg-blue-900 font-bold shadow-lg rounded-sm py-3.5 w-28">売り場</th>
              <th className="bg-blue-900 font-bold shadow-lg rounded-sm py-1 w-12">単位<br />変換</th>
            </tr>
          </thead>
          {ingredViewList ?
            <>
              {ingredViewList?.map((row, index) => (
                <tbody key={row?.ingredId}>
                  <tr  
                    onContextMenu={(e) => openContextMenu(e, row.ingredId, DATA_TYPE.INGRED)}
                    onTouchStart={(e) => touchStart(e, row.ingredId, DATA_TYPE.INGRED)} 
                    onTouchEnd={() => touchEnd()} 
                    onMouseEnter={() => hoveredRowSetting(row.ingredId)}
                    onMouseLeave={() => setApplyHighlighted(false)}
                    className={`detail-table-row ${(applyHighlighted && row.ingredId === hoveredId) && "group"}`}
                  >
                    <td className="detail-table-data bg-white w-32 group-hover:bg-blue-100">
                      {row?.ingredNm}
                      {(contextDataType === DATA_TYPE.INGRED && row.ingredId === contextMenuTargetId) && 
                        <ContextMenu menuList={[
                          {label: "編集", onClick: () => openEditIngredForm(row)},
                          {label: "削除", onClick: () => submitDeleteIngred(row)},
                        ]} />
                      }
                    </td>
                    <td className="detail-table-data bg-white w-14 group-hover:bg-blue-100">
                      {!unitDictStat.isLoading && unitDict ? unitDict[row?.buyUnitCd] : <LoadingSpinner />}
                    </td>
                    <td className="detail-table-data bg-white w-28 group-hover:bg-blue-100">
                      {!salesAreaDictStat.isLoading && salesAreaDict ? salesAreaDict[row?.salesAreaType] : <LoadingSpinner />}
                    </td>
                    <td 
                      className="detail-table-data bg-white w-12 group-hover:bg-blue-100"
                      onClick={() => switchFlgIngredAcc(index, flg.ingredUnitConvVisible, switchVisibleType(row.ingredUnitConvVisible))}
                    >
                      <FaAngleDown className={`${row.ingredUnitConvVisible !== VISIBLE_TYPE.HIDDEN && (row.ingredUnitConvVisible === VISIBLE_TYPE.OPEN ? "animate-arrowRotateIn" : "animate-arrowRotateOut")}`}/>
                    </td>
                  </tr>
                  {row.ingredUnitConvVisible !== VISIBLE_TYPE.HIDDEN && 
                    <IngredUnitConvRowProvider ingred={row}>  
                      <IngredUnitConvRow />
                    </IngredUnitConvRowProvider>
                  }
                </tbody>
              ))}
              {/* <tbody>
                <AddRowButton 
                  textContent="食材を追加"
                  onClick={openAddIngredForm}
                  cssWidth={"w-86"}
                />
              </tbody> */}
            </>
          :
            <TableBodyLoading />
          }
        </table>
      </div>
      <FloatingActionButton onClick={openAddIngredForm} />
      {isAddIngred && 
        <IngredForm 
          submitAction={submitAddIngred}
          closeIngredForm={closeIngredForm}
        />
      }
      {isEditIngred && 
        <IngredForm 
          submitAction={submitEditIngred}
          closeIngredForm={closeIngredForm}
          editData={editData}
        />
      }
    </div>
  );
};  
