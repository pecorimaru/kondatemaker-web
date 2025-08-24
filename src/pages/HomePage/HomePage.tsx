import '@/css/styles.css';
import '@/css/output.css';

import { LoadingSpinner, FloatingActionButton } from '@/components/ui';
import { ToweekMenuPlanDetRow } from './components';
import { useHomePage } from '@/hooks';
import { DICT_IDX, WEEKDAY_CD } from '@/constants';
import { useApp } from '@/hooks';
import { ToweekMenuPlanDetRowProvider } from '@/providers';
import { MenuPlanDetForm } from '@/components/features';


export const HomePage = () => {

  const {
    weekdayDict,
    weekdayDictStat,
  } = useApp();

  // useHomePageカスタムフックから値・関数を取得
  const {
    selectedPlan,
    selectedPlanStat,
    menuPlanDtoList,
    menuPlanDtoListStat,
    isMenuPlanComboBoxOpen,
    setIsMenuPlanComboBoxOpen,
    menuPlanComboBoxRef,
    handleMenuPlanComboBoxClick,
    isAddMenuPlanDet,
    submitAddToweekMenuPlanDet,
    openAddMenuPlanDetForm,
    closeMenuPlanDetForm,
  } = useHomePage();


  return(
      <div className="flex items-center justify-center h-screen w-full" style={{height: "calc(100vh - 80px)"}}>
        <table>
          <tbody>
            <tr className="flex justify-center gap-1.5">
              <td className="text-center py-2.5 w-28 text-base text-white bg-blue-900 shadow-lg rounded-sm">
                今週の献立
              </td>
              <td 
                className="w-48 bg-white shadow-md rounded-sm"
                onClick={() => setIsMenuPlanComboBoxOpen(!isMenuPlanComboBoxOpen)}
                ref={menuPlanComboBoxRef}
              >
                <div className="flex justify-between h-full w-full">
                  <button className="h-full w-full">
                    {selectedPlanStat && !selectedPlanStat.isLoading ? selectedPlan?.menuPlanNm : <LoadingSpinner /> }
                  </button>
                  <div className="flex items-center w-6 cursor-pointer">
                      <i className="fa-solid fa-caret-down" />
                  </div>
                </div>
                <div className="absolute">
                  {isMenuPlanComboBoxOpen && (
                    <ul className="mt-0.5 w-48 bg-white border rounded-sm shadow-lg">
                      {!menuPlanDtoListStat.isLoading && !menuPlanDtoListStat.error ? menuPlanDtoList?.map((menuPlan, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleMenuPlanComboBoxClick(menuPlan)}
                      >
                        {menuPlan?.menuPlanNm}
                      </li>
                      )): <li className="flex justify-center items-center h-10"><LoadingSpinner /></li>}
                    </ul>
                  )}
                </div>
              </td>
            </tr>
            {!weekdayDictStat?.isLoading && weekdayDict && Object.entries(weekdayDict)?.map((weekday) => (
              <ToweekMenuPlanDetRowProvider weekdayCd={weekday[DICT_IDX.KEY] as WEEKDAY_CD} >
                <ToweekMenuPlanDetRow />
              </ToweekMenuPlanDetRowProvider>
            ))}
          </tbody>
        </table>
        <FloatingActionButton onClick={openAddMenuPlanDetForm} />
        {isAddMenuPlanDet && <MenuPlanDetForm submitAction={submitAddToweekMenuPlanDet} closeMenuPlanDetForm={closeMenuPlanDetForm} />}
      </div>
  );
};

