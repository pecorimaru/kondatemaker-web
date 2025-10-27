export interface UserDto {
  userId: number;
  userNm: string;
  emailAddr: string;
}

export interface GroupMemberDto {
  userNm: string;
  ownerFlg: string;
} 