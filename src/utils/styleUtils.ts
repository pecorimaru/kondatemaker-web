import { VISIBLE_TYPE } from '@/constants';

const ITEM_HEIGHT = 44;
const PADDING_HEIGHT = 48;

/**
 * 展開可能なリストの高さを計算する
 * @param isOpen - リストが開いているかどうか（VISIBLE_TYPE.OPENと比較した結果）
 * @param list - 計算対象のリスト
 * @returns 計算された高さ（px）
 */
export const getClsListHeight = <T>(
  visibleType: VISIBLE_TYPE,
  isLoading: boolean,
  list: T[] | null | undefined,
): number => {
  if (visibleType === VISIBLE_TYPE.CLOSE) return 0;
  if (isLoading) return PADDING_HEIGHT;
  return (list?.length ?? 0) * ITEM_HEIGHT + PADDING_HEIGHT;
};

/**
 * ホバー時の行ハイライトCSSクラスを取得する
 * @param rowId - 行ID
 * @param hoveredId - マウスオーバーしている行ID
 * @param isHovered - ハイライトするかどうか
 * @returns スタイルクラス
 */
export const getClsHighlightedIfHover = (
  rowId: number, 
  hoveredId: number | null, 
  isHovered: boolean
): string => {
  return isHovered && rowId === hoveredId ? "group" : "";
};

/**
 * アローの回転アニメーションを取得する
 * @param visible - 表示状態
 * @returns スタイルクラス
 */
export const getClsArrowRotation = (visible: VISIBLE_TYPE | undefined): string => {
  if (visible === undefined || visible === VISIBLE_TYPE.HIDDEN) return "";
  return visible === VISIBLE_TYPE.OPEN 
    ? "animate-arrowRotateIn" 
    : "animate-arrowRotateOut";
};