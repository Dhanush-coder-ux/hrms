

interface Column<T> {
  header: string;
  accessor?: keyof T;
}

interface ExportButtonProps<T> {
  data: T[];
  columns: Column<T>[];
  filename?: string;
}

export const ExportCSVButton = <T,>({ data, columns, filename = "export.csv" }: ExportButtonProps<T>) => {
  const exportToCSV = () => {
    if (!data.length) return;

    // Create CSV header
    const headers = columns.map(col => col.header);
    // Create CSV rows
    const rows = data.map(row =>
      columns.map(col => {
        const value = col.accessor ? row[col.accessor] : "";
        return `"${value}"`; // wrap in quotes to handle commas
      }).join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="flex justify-end bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
    >
      Export CSV
    </button>
  );
};
