import { apiClient } from './axiosClient';

export async function fetcher(key: string) {
  try {
    const response = await apiClient.get(key);
    return response.data
  } catch(error) {
    console.log("error", error)
  }
}
  
export function hasNullOrUndefined(obj: Record<string, any>) {
    return Object.values(obj).some(value => value === null || value === undefined);
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

