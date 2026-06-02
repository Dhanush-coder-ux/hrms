import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Table, type Column } from "../../Components/table/AttendanceTable";
import { Api_URL } from "../../../APILINK";
import StatCard from "../../../Components/Common/StatCard";
import { TrendingUp, Calendar, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";
import { CustomDatePicker } from "../../../Components/Common/CustomDatePicker";
import SearchBar from "../../../Components/Common/Searchbar";

export const AttendanceHistory = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchHistory = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await fetch(`${Api_URL}/attendance?employee_id=${id}`);
            if (res.ok) {
                const result = await res.json();
                setData(result);
            } else {
                console.error("Failed to fetch attendance history", res.status);
            }
        } catch (e) {
            console.error("Error fetching attendance history", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [id]);

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;
        return data.filter(
            (r) =>
                r.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.Emp_id?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const columns: Column[] = useMemo(
        () => [
            { header: "Employee", accessor: "employee_name" },
            { header: "Date", accessor: "date" },
            { header: "Check-In", accessor: "check_in" },
            { header: "Check-Out", accessor: "check_out" },
            { header: "Status", accessor: "status" },
            { header: "", type: "action" },
        ],
        []
    );

    return (
        <div className={empMangeTheme.layout.mainContainer + " relative"}>
            {/* Header */}
            <div className={empMangeTheme.header.wrapper}>
                <div className="flex flex-col">
                    <div className={empMangeTheme.header.pill}>
                        <TrendingUp size={12} />
                        <span>Attendance History</span>
                    </div>
                    <h1 className={empMangeTheme.header.title}>Employee Attendance</h1>
                    <p className={empMangeTheme.header.subtitle}>Complete log for employee ID: {id}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-4">
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search employee..." className="w-80" />
                <button
                    onClick={() => {
                        const csvContent = [
                            ["ID", "Employee", "Date", "In", "Out", "Status"],
                            ...filteredData.map((r) => [
                                `"${r.Emp_id}"`,
                                `"${r.employee_name}"`,
                                `"${r.date}"`,
                                `"${r.check_in ?? "—"}"`,
                                `"${r.check_out ?? "—"}"`,
                                `"${r.status}"`,
                            ].join(",")),
                        ].join("\n");
                        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `attendance_history_${id}.csv`;
                        link.click();
                    }}
                    className="h-[44px] px-5 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all"
                >
                    <Download size={16} /> Export
                </button>
                <button onClick={() => window.history.back()} className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold">
                    <ChevronLeft size={16} /> Back
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-slate-500">Loading...</div>
            ) : (
                <Table columns={columns} TB={filteredData} onEdit={function (row: any): void {
                        throw new Error("Function not implemented.");
                    } } />
            )}
        </div>
    );
};
