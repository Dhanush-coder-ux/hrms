import { pageTheme } from "../../../Themes/PageThems/pageConfig";
interface ConfigTableProps {
    headers: string[];
    emptyMessage: string;
    isEmpty: boolean;
    children: React.ReactNode;
}

export const ConfigTable = ({ headers, emptyMessage, isEmpty, children }: ConfigTableProps) => (
    <div className={pageTheme.table.wrapper} style={{ maxHeight: '300px' }}>
        <table className="w-full text-sm text-left">
            <thead className={pageTheme.table.head}>
                <tr className={pageTheme.table.headRow}>
                    {headers.map((h, i) => (
                        <th key={i} className={pageTheme.table.headCell}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {children}
                {isEmpty && (
                    <tr>
                        <td colSpan={headers.length} className="px-6 py-8 text-center text-slate-400 italic text-sm">
                            {emptyMessage}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);
