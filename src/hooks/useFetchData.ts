import { decamelizeKeys } from 'humps';
import useSWR from 'swr';

import { fetcher, hasNullOrUndefined } from '@/utils';
import { IngredDto } from '@/types/api/ingred.types';
import { IngredUnitConvDto } from '@/types/api/ingred.types';
import { UserDto, GroupDto, GroupMemberDto, DefaultSetsDto, RecipeDto, RecipeIngredDto, MenuPlanDto, MenuPlanDetDto, BuyIngredDto, ToweekMenuPlanDetDto } from '@/types';
import { WEEKDAY_CD } from '@/constants';


export function useFetchData<T = any>(key: string, params: Record<string, any>) {
  let fetchUrl: string | null;

  if (hasNullOrUndefined(params)) {
    fetchUrl = null;
  } else if (Object.keys(params).length === 0) {
    fetchUrl = `${process.env.REACT_APP_API_CLIENT}/${key}`;
  } else {
    const queryParams = new URLSearchParams(params).toString();
    fetchUrl = `${process.env.REACT_APP_API_CLIENT}/${key}/queryParams?${queryParams}`;
  }
  return useSWR<T, any>(fetchUrl, fetcher, {
    // 画面復帰時の再取得を強制
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    // エラー時の積極的なリトライ
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    // 認証エラー時の処理
    onError: (error) => {
      if (error?.response?.status === 401) {
        // 認証エラー時は全てのSWRキャッシュをクリア
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }
  });
}

export function useUnitDict() {
  const { data, error, isLoading } = useFetchData<Record<string, string>>("const/unitDict", {});
  return { unitDict: data, unitDictStat: { error, isLoading } };
}

export function useRecipeTypeDict() {
  const { data, error, isLoading } = useFetchData<Record<string, string>>("const/recipeTypeDict", {})
  return { recipeTypeDict: data, recipeTypeDictStat: { error, isLoading } };
}

export function useSalesAreaDict() {
  const { data, error, isLoading } = useFetchData<Record<string, string>>("const/salesAreaDict", {});
  return { salesAreaDict: data, salesAreaDictStat: { error, isLoading } };
}

export function useWeekdayDict() {
  const { data, error, isLoading } = useFetchData<Record<WEEKDAY_CD, string>>("const/weekdayDict", {});
  return { weekdayDict: data, weekdayDictStat: { error, isLoading } };
}

export function useLoginUser(isLoggedIn: boolean) {
  const { data, error, isLoading, mutate } = useFetchData<UserDto>("setting/loginUser", decamelizeKeys({ isLoggedIn }));
  return { loginUser: data, loginUserStat: { error, isLoading }, loginUserMutate: mutate };  
}

export function useCurrentGroup(isLoggedIn: boolean) {
  const { data, error, isLoading, mutate } = useFetchData<GroupDto>("setting/currentGroup", decamelizeKeys({ isLoggedIn }));
  return { currentGroup: data, currentGroupStat: { error, isLoading }, currentGroupMutate: mutate };  
}

export function useGroupList() {
  const { data, error, isLoading, mutate } = useFetchData<GroupDto[]>("setting/groupList", {});
  return { groupList: data, groupListStat: { error, isLoading }, groupListMutate: mutate };
}

export function useGroupMemberList() {
  const { data, error, isLoading, mutate } = useFetchData<GroupMemberDto[]>("setting/groupMemberList", {});
  return { groupMemberList: data, groupMemberListStat: { error, isLoading }, groupMemberListMutate: mutate };
}

export function useIngredList() {
  const { data, error, isLoading, mutate } = useFetchData<IngredDto[]>("ingred/ingredList", {});
  return { ingredDtoList: data, ingredDtoListStat: { error, isLoading }, ingredDtoListMutate: mutate };
}

export function useIngredUnitConvList(ingredId: number | null | undefined) {
  const { data, error, isLoading, mutate } = useFetchData<IngredUnitConvDto[]>("ingred/ingredUnitConvList", decamelizeKeys({ ingredId }));
  return { ingredUnitConvDtoList: data, ingredUnitConvDtoListStat: { error, isLoading }, ingredUnitConvDtoListMutate: mutate };
}

export function useIngredNmSuggestions(inputValue: string | null) {
  const { data, error, isLoading } = useFetchData<string[]>("ingredForm/ingredNmSuggestions", decamelizeKeys({ inputValue }));
  return { ingredNmSuggestions: data, ingredNmSuggestionsStat: { error, isLoading } };
}

export function useDefaultSetsByIngred(ingredNm: string | null) {
  const { data, error, isLoading } = useFetchData<DefaultSetsDto>("ingredForm/defaultSetsByIngred", decamelizeKeys({ ingredNm }));
  return { defaultSetsByIngred: data, defaultSetsByIngredStat: { error, isLoading } };
}

export function useUnitDictByIngred(ingredNm: string | null) {
  const { data, error, isLoading } = useFetchData<Record<string, string>>("ingredForm/unitDictByIngred", decamelizeKeys({ ingredNm }));
  return { unitDictByIngred: data, unitDictByIngredStat: { error, isLoading } };
}

export function useRecipeList() {
  const { data, error, isLoading, mutate } = useFetchData<RecipeDto[]>("recipe/recipeList", {});
  return { recipeDtoList: data, recipeDtoListStat: { error, isLoading }, recipeDtoListMutate: mutate };
}

export function useRecipeNmSuggestions(inputValue: string) {
  const { data, error, isLoading } = useFetchData<string[]>("recipeForm/recipeNmSuggestions", decamelizeKeys({ inputValue }));
  return { recipeNmSuggestions: data, recipeNmSuggestionsStat: { error, isLoading } };
}

export function useRecipeIngredList(recipeId: number | null) {
  const { data, error, isLoading, mutate } = useFetchData<RecipeIngredDto[]>("recipe/recipeIngredList", decamelizeKeys({ recipeId }));
  return { recipeIngredDtoList: data, recipeIngredDtoListStat: { error, isLoading } , recipeIngredDtoListMutate: mutate};
}

export function useMenuPlanList() {
  const { data, error, isLoading, mutate } = useFetchData<MenuPlanDto[]>("menuPlan/menuPlanList", {});
  return { menuPlanDtoList: data, menuPlanDtoListStat: { error, isLoading }, menuPlanDtoListMutate: mutate };
}

export function useMenuPlanDetList(menuPlanId: number | null) {
  const { data, error, isLoading, mutate } = useFetchData<MenuPlanDetDto[]>("menuPlan/menuPlanDetList", decamelizeKeys({ menuPlanId }));
  return { menuPlanDetDtoList: data, menuPlanDetDtoListStat: { error, isLoading }, menuPlanDetDtoListMutate: mutate };
}

export function useSelectedPlan() {
  const { data, error, isLoading, mutate } = useFetchData<MenuPlanDto>("home/selectedPlan", {});
  return { selectedPlan: data, selectedPlanStat: { error, isLoading }, selectedPlanMutate: mutate };
}

export function useToweekMenuPlanDetListDict() {
  const { data, error, isLoading, mutate } = useFetchData<Record<string, ToweekMenuPlanDetDto[]>>("home/toweekMenuPlanDetListDict", {});
  return { toweekMenuPlanDetListDict: data, toweekMenuPlanDetListDictStat: { error, isLoading }, toweekMenuPlanDetListDictMutate: mutate };
}

export function useBuyIngredList() {
  const { data, error, isLoading, mutate } = useFetchData<BuyIngredDto[]>("buy/buyIngredList", {});
  return { buyIngredList: data, buyIngredListStat: { error, isLoading }, buyIngredListMutate: mutate };
}




  

