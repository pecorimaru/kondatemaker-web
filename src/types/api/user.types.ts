export interface UserDto {
  userId: number;
  userNm: string;
  email?: string;
}

export interface GroupMemberDto {
  userNm: string;
  ownerFlg: string;
} 