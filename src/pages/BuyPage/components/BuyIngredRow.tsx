import '@/css/styles.css';
import '@/css/output.css';

import { LoadingSpinner } from '@/components/ui';
import { useApp, useBuyIngredRow, useBuyPage } from '@/hooks';
import { ContextMenu } from '@/components/ui';
import { DATA_TYPE } from '@/constants';
import { getClsHighlightedIfHover } from '@/utils';
import { FaCartPlus } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";


// コンポーネントの定義
export const BuyIngredRow: React.FC = () => {

  const { 
    unitDict, 
    unitDictStat, 
    salesAreaDict, 
    salesAreaDictStat, 
    openContextMenu, 
    touchStart, 
    touchEnd,
    contextMenuTargetId,
    hoveredId,
    applyHighlighted,
    setApplyHighlighted,
    hoveredRowSetting,
    contextDataType,
  } = useApp();

  const { submitSwitchCompletion } = useBuyPage();

  const {
    row,
    cssColor,
    handleOpenEditIngredForm,
    handleSubmitDeleteBuyIngred,
  } = useBuyIngredRow();

  return (
    <div 
      key={row.buyIngredId} 
      onContextMenu={(e) => openContextMenu(e, row.buyIngredId, DATA_TYPE.BUY_INGRED)}
      onTouchStart={(e) => touchStart(e, row.buyIngredId, DATA_TYPE.BUY_INGRED)} 
      onTouchEnd={touchEnd} 
      onMouseEnter={() => hoveredRowSetting(row.buyIngredId)}
      onMouseLeave={() => setApplyHighlighted(false)}
      className={`detail-table-row ${getClsHighlightedIfHover(row.buyIngredId, hoveredId, applyHighlighted)}`}
    >
      <div 
        className={`${cssColor} detail-table-data w-8 cursor-pointer group-hover:bg-blue-100`} 
        onClick={() => submitSwitchCompletion(row)}
      >
        <input className="cursor-pointer"
          type="checkbox"
          checked={row.isBought}
          onChange={() => submitSwitchCompletion(row)}
        />
      </div>
      <div className="flex justify-between w-32 ">
        {row.fixBuyFlg === "T" ?
          <span className="absolute flex items-center h-10 pl-1 z-10"><FaRepeat /></span>
        :
          row.manualAddFlg === "T" &&
            <span className="absolute flex items-center h-10 pl-1 z-10"><FaCartPlus /></span>
        }
        <div className={`${cssColor} detail-table-data w-full group-hover:bg-blue-100`}>
          <span>{row.ingredNm}</span>
        </div>
      </div>
      <div className={`${cssColor} detail-table-data w-16 group-hover:bg-blue-100`}>
        {!unitDictStat.isLoading ? 
          (
            row.qty ? 
              `${Math.round(row.qty * 100) / 100} ${unitDict ? unitDict[row.unitCd] : ""}`
            :
              ""
          )
          : <LoadingSpinner />
        }
      </div>
      <div className={`${cssColor} detail-table-data w-28 group-hover:bg-blue-100`}>
        {!salesAreaDictStat.isLoading ? salesAreaDict ? salesAreaDict[row.salesAreaType] : "" : <LoadingSpinner />}

        {/* gap-1 によって間隔が作られてしまうため最後の<td>タグエリアを間借りする */}
        {(contextDataType === DATA_TYPE.BUY_INGRED && row.buyIngredId === contextMenuTargetId) &&
          <ContextMenu menuList={[
            {label: "編集", onClick: () => handleOpenEditIngredForm()},
            {label: "削除", onClick: () => handleSubmitDeleteBuyIngred()},
          ]} />
        }
      </div>
    </div>
  );
}
