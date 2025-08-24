import { ToweekMenuPlanDetDto } from "../api";

export interface ToweekMenuPlanDetView extends ToweekMenuPlanDetDto {
  isEditing?: boolean;
  isSelected?: boolean;
  [key: string]: any;
}
