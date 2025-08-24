import { GroupDto } from "../api";

export interface GroupView extends GroupDto {
    [key: string]: any;
}