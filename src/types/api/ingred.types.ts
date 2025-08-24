export interface IngredDto {
  ingredId: number;
  ingredNm: string;
  ingredNmK: string;
  parentIngredNm: string;
  buyUnitCd: string;
  salesAreaType: string;
  unitConvWeight: number;
}

export interface IngredUnitConvDto {
  ingredUnitConvId: number;
  ingredId: number;
  ingredNm: string;
  convUnitCd: string;
  convRate: number;
  convWeight: number;
}
