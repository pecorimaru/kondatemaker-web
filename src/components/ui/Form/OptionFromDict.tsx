import { EMPTY_CD } from "@/constants";

interface OptionFromDictProps {
  dict?: Record<string, string>;
  emptyOption?: boolean;
  emptyLabel?: string;
}

export const OptionFromDict: React.FC<OptionFromDictProps> = ({ 
  dict,
  emptyOption = false,
  emptyLabel = "選択してください"
}) => {
  if (!dict) {
    return null;
  }

  return (
    <>
      {emptyOption && <option key={EMPTY_CD} value={EMPTY_CD}>{emptyLabel}</option>}
      {Object.entries(dict).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </>
  );
};