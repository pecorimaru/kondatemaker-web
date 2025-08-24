import { VISIBLE_TYPE } from "@/constants";
import { MenuPlanDetDto, MenuPlanDto } from "../api";

export interface MenuPlanView extends MenuPlanDto {
  menuPlanDetVisible: VISIBLE_TYPE;
  [key: string]: any;
}

export interface MenuPlanDetView extends MenuPlanDetDto {
  // isHighlighted?: boolean;
  // displayOrder?: number;
}

export interface MenuPlanFormData {
  menuPlanNm: string;
  menuPlanNmK?: string;
}

export interface MenuPlanDetFormData {
  weekdayCd: string;
  recipeNm: string;
}
