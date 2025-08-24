import '@/css/styles.css';
import '@/css/output.css';

import { useBuyPage } from '@/hooks';
import { IngredSelectForm } from '@/components/features/ingred';
import { BuyIngredRow } from './components/BuyIngredRow';
import { FloatingActionButton, TableBodyLoading } from '@/components/ui';
import { DATA_TYPE } from '@/constants';
import { BuyIngredRowProvider } from '@/providers';

export const BuyPage = () => {
  const {
    incompleteList,
    completeList = [],
    isAddIngred,
    isEditIngred,
    editData,
    buyIngredListStat,
    openAddIngredForm,
    closeIngredForm,
    submitAddBuyIngred,
    submitEditBuyIngred,
  } = useBuyPage();

  return(
    <div className="main-container">
      <div className="mt-header-mb-footer">
        <table className="mt-3">
          <thead>
            <tr className="header-table-row">
              <th className="header-table-data w-8"><i className="fa-solid fa-check"></i></th>
              <th className="header-table-data w-32">食材</th>
              <th className="header-table-data w-16">数量</th>
              <th className="header-table-data w-28">売り場</th>
            </tr>
          </thead>
          {!buyIngredListStat.isLoading ?
            <tbody>
              {incompleteList
                ?.sort((a, b) => {
                  if (a?.salesAreaSeq !== b?.salesAreaSeq) {
                    return (a?.salesAreaSeq || 0) - (b?.salesAreaSeq || 0)
                  }
                  return (a?.num || 0) - (b?.num || 0)
                })?.map((row, index) => (
                  <tr key={row.buyIngredId}>
                    <td>
                      <BuyIngredRowProvider key={row.buyIngredId} row={row} index={index}>
                        <BuyIngredRow />
                      </BuyIngredRowProvider>
                    </td>
                  </tr>
                ))
              }
              {/* <AddRowButton textContent="食材を追加" onClick={openAddIngredForm} cssWidth="w-full" /> */}
              {completeList.length > 0 && 
                <tr className="mt-1">
                  <td className="text-sm text-slate-400 px-3 pt-2"><i className="fa-solid fa-check"></i>　完了済の項目</td>
                </tr>
              }
              {completeList
                ?.sort((a, b) => {
                  if (a?.salesAreaSeq !== b?.salesAreaSeq) {
                    return (a?.salesAreaSeq || 0) - (b?.salesAreaSeq || 0)
                  }
                  return (a?.num || 0) - (b?.num || 0)
                })?.map((row, index) => (
                  <tr key={row.buyIngredId}>
                    <td>
                      <BuyIngredRowProvider key={row.buyIngredId} row={row} index={index}> {/* key:警告対策＠コンポーネントでは使用しない */}
                        <BuyIngredRow />
                      </BuyIngredRowProvider>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          : 
            <TableBodyLoading />
          }
        </table>
        <FloatingActionButton onClick={openAddIngredForm} />
        {isAddIngred && 
          <IngredSelectForm 
            dataType={DATA_TYPE.BUY_INGRED} 
            submitAction={submitAddBuyIngred} 
            closeIngredForm={closeIngredForm} 
          />
        }
        {isEditIngred && 
          <IngredSelectForm 
            dataType={DATA_TYPE.BUY_INGRED} 
            submitAction={submitEditBuyIngred} 
            closeIngredForm={closeIngredForm} 
            editData={editData} 
          />
        }
      </div>    
    </div>
  );
}    
