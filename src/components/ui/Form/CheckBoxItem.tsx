export interface CheckBoxItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const CheckBoxItem: React.FC<CheckBoxItemProps> = ({ label, checked, onChange }) => {

return (  
  <div className="mt-4">
  <label className="text-md text-gray-700">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />
    <span className="ml-2">{label}</span>
  </label>
</div>
)
}; 