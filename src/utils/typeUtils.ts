import { VISIBLE_TYPE } from "@/constants";


export function switchVisibleType(currentVisibleType: VISIBLE_TYPE): VISIBLE_TYPE {

  if (currentVisibleType === VISIBLE_TYPE.OPEN) {
    return VISIBLE_TYPE.CLOSE;
  };
  
  if (currentVisibleType === VISIBLE_TYPE.CLOSE || currentVisibleType === VISIBLE_TYPE.HIDDEN) {
    return VISIBLE_TYPE.OPEN;
  };

  return VISIBLE_TYPE.HIDDEN;

}