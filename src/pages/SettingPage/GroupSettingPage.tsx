// 外部ライブラリ
import { useGroupList, useGroupMemberList } from '@/hooks/useFetchData';

// 内部ライブラリ - フック
import { useApp } from '@/hooks';
import { useGroupSettingPage } from '@/hooks';

// 内部ライブラリ - コンポーネント
import { MemberInviteForm } from '@/components/features/setting';

export const GroupSettingPage = () => {
  const { currentGroup /*, currentGroupStat*/ } = useApp();
  const { groupList, groupListStat } = useGroupList();
  const { groupMemberList, groupMemberListStat } = useGroupMemberList();
  
  const {
    isMemberInvite,
    setIsMemberInvite,
    editGroupNm,
    setEditGroupNm,
    submitEditGroupNm,
    submitExitGroup,
    submitChangeGroup,
    closeMemberInviteForm,
    submitMemberInvite,
  } = useGroupSettingPage();

  return (
    <div className="main-container">
      <div className="mt-header-mb-footer">
        <div className="w-full max-w-md mt-4 py-8 bg-white shadow-lg rounded-md">
          <div className="px-8">
            <label className="block text-md text-gray-700">グループ名:</label>
            <input
                type="text"
                value={editGroupNm}
                onChange={(e) => setEditGroupNm(e.target.value)}
                onBlur={submitEditGroupNm}
                className="form-input-base"
                disabled={currentGroup?.hasOwnership !== "T" && true}
            />
          </div>
        </div>
        <div className="w-full mt-4 border bg-gray-50 shadow-lg rounded-sm">
          <span className="text-xs px-2 text-slate-700">メンバー</span>
          {!groupMemberListStat.isLoading &&
            <>
              {groupMemberList?.map((row) => (
                <div
                  key={row.userNm}
                  className="flex items-center bg-white h-10 w-full text-slate-700 border-t"
                >
                  <div className="w-8 text-center">
                    <i className={`${row.ownerFlg === "T" && "fa-solid fa-circle-user"}`}></i>
                  </div>
                  <span className="">{row.userNm}</span>
              </div>
              ))}
            </>
          }
        </div>
        <div className="w-full max-w-sm mt-4  bg-white shadow-lg rounded-md">
          {currentGroup?.hasOwnership === "T" ?
            <button
              className="w-full h-10 text-stale-700 rounded-sm border-t hover:bg-gray-100"
              onClick={() => setIsMemberInvite(true)}
            >
              <i className="fa-solid fa-envelope"></i>
              <span className="mx-2">メンバー招待</span>
            </button>
          :          
            <button
              className="w-full h-10 text-stale-700 border-y rounded-sm hover:bg-gray-100"
              onClick={submitExitGroup}
            >
              <i className="fa-solid fa-trash"></i>
              <span className="mx-2">グループ退出</span>
              
            </button>
          }
        </div>
        <div className="w-full mt-4 border bg-gray-50 shadow-lg rounded-sm">
          <span className="text-xs px-2 text-slate-700">グループ切り替え</span>
          {!groupListStat.isLoading &&
            <>
              {groupList?.map((row) => (
                <button key={row.groupId}
                  className="flex items-center bg-white h-10 w-full text-slate-700 border-t hover:bg-gray-100"
                  onClick={() => submitChangeGroup(row.groupId)}  
                >
                  <div className="w-8 text-center">
                    <i className={`${row.currentFlg === "T" && "fa-solid fa-square-check"}`}></i>
                  </div>
                  <span className="">{row.groupNm}</span>
                </button>
              ))}
            </>
          }
        </div>
        {isMemberInvite && <MemberInviteForm submitAction={submitMemberInvite} closeMemberInviteForm={closeMemberInviteForm}/>}
      </div>
    </div>
  );
};

