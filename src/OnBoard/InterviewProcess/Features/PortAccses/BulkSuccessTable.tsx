import { BulkSuccessRow } from "./BulkSuccessRow";
import type { BulkCredentialItem } from "./BulkSuccessRow";

interface BulkSuccessTableProps {
  bulkSuccessSheet: BulkCredentialItem[];
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
}

export const BulkSuccessTable = ({
  bulkSuccessSheet,
  copiedIndex,
  onCopy,
}: BulkSuccessTableProps) => {
  return (
    <div className="max-h-[300px] overflow-y-auto border border-slate-100 rounded-2xl custom-scrollbar mb-6 bg-slate-50/50">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-white shadow-sm border-b border-slate-100">
          <tr>
            <th className="px-4 py-2.5 text-left text-[9px] font-black tracking-widest text-slate-400 uppercase">
              Employee
            </th>
            <th className="px-4 py-2.5 text-left text-[9px] font-black tracking-widest text-slate-400 uppercase">
              Portal Username
            </th>
            <th className="px-4 py-2.5 text-left text-[9px] font-black tracking-widest text-slate-400 uppercase">
              Password Key
            </th>
            <th className="px-4 py-2.5 text-center text-[9px] font-black tracking-widest text-slate-400 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {bulkSuccessSheet.map((item, idx) => (
            <BulkSuccessRow
              key={item.empId}
              item={item}
              idx={idx}
              copiedIndex={copiedIndex}
              onCopy={onCopy}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
