import { Check, Copy } from "lucide-react";
import { getUserTheme } from "../../../../Components/Common/UserAvatar";

export interface BulkCredentialItem {
  empId: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

interface BulkSuccessRowProps {
  item: BulkCredentialItem;
  idx: number;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
}

export const BulkSuccessRow = ({
  item,
  idx,
  copiedIndex,
  onCopy,
}: BulkSuccessRowProps) => {
  const theme = getUserTheme(item.name);
  const initials = item.name
    ?.split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <tr className="border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-extrabold flex-shrink-0 tracking-tighter ${theme.tableBg} ${theme.tableText}`}
          >
            {initials}
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-800 tracking-tight m-0">
              {item.name}
            </p>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider m-0 mt-0.5">
              #{item.empId}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-[10px] font-semibold text-slate-500 align-middle">
        {item.email}
      </td>
      <td className="px-4 py-3 text-[10px] font-black text-slate-700 font-mono tracking-wider align-middle">
        {item.password}
      </td>
      <td className="px-4 py-3 text-center align-middle">
        <button
          onClick={() => onCopy(`${item.email} / ${item.password}`, idx)}
          className={`p-1 rounded text-slate-400 transition-all cursor-pointer ${
            copiedIndex === idx
              ? "bg-emerald-50 text-emerald-500"
              : "hover:bg-slate-100"
          }`}
          title="Copy Credentials"
        >
          {copiedIndex === idx ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </td>
    </tr>
  );
};
