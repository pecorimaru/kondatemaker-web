import { IngredDto, IngredUnitConvDto } from "../api";
import { VISIBLE_TYPE } from "@/constants";

export interface IngredView extends IngredDto {
  isEditing?: boolean;
  isSelected?: boolean;
  ingredUnitConvVisible: VISIBLE_TYPE;
  [key: string]: any;
}

export interface IngredUnitConvView extends IngredUnitConvDto {
  isEditing?: boolean;
  isSelected?: boolean;
}

export interface IngredFormData {
  ingredId?: number;
  ingredNm: string;
  ingredNmK: string;
  parentIngredNm: string;
  buyUnitCd: string;
  salesAreaType: string;
  isRegisterContinue?: boolean;
} 

export interface IngredSelectFormData {
  ingredId?: number;
  ingredNm: string;
  salesAreaType: string;
  unitCd: string;
  qty: number;
  isBuyEveryWeek?: boolean;
  isRegisterContinue?: boolean;
} 

export interface IngredUnitConvFormData {
  ingredId: number;
  convUnitCd: string;
  convRate: number;
  convWeight?: number | null;
}