export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface DefaultSetsDto {
  [key: string]: any;
} 