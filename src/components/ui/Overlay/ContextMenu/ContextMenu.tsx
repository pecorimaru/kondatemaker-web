import { ContextMenuItem } from "@/types";
import { ContextMenuRow } from "./ContextMenuRow";
import { useApp } from "@/hooks";

interface ContextMenuProps {
    menuList: ContextMenuItem[];
}
  
export const ContextMenu: React.FC<ContextMenuProps> = ({ menuList }) => {

const { menuPosition } = useApp();

  return (
  <div className="fixed z-10"
      style={{ top: menuPosition.y, left: menuPosition.x}}
  >
    <ul className="border-x border-t border-gray-200 shadow-lg rounded-sm">
      {menuList.map((row) => 
        <ContextMenuRow 
          key={row.label}
          contextMenu={row} 
        />
      )}
    </ul>
  </div>
  );
};