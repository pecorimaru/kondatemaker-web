import { WEEKDAY_CD } from "@/constants";

export interface MenuPlanDto {
  menuPlanId: number;
  menuPlanNm: string;
  menuPlanNmK: string;
}

export interface MenuPlanDetDto {
  menuPlanDetId: number;
  menuPlanId: number;
  recipeId: number;
  weekdayCd: WEEKDAY_CD;
  weekdayNm: string;
  recipeNm: string;
  recipeTypeCd: string;
  recipeTypeNm: string;
}
