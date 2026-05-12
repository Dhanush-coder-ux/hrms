import { useEffect, useState } from "react";

type OffboardRequest = {
  id: string;
  emp_id: string;
  emp_name: string;
  reason?: string;
  status: "Pending" | "Approved";
};

export const ExitRequests = () => {
  const [data, setData] = useState<OffboardRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved">("All");

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          id: "1",
          emp_id: "EMP001",
          emp_name: "Arun Kumar",
          reason: "Personal reasons",
          status: "Pending",
        },
        {
          id: "2",
          emp_id: "EMP002",
          emp_name: "Priya Sharma",
          reason: "Career growth",
          status: "Approved",
        },
        {
          id: "3",
          emp_id: "EMP003",
          emp_name: "Vijay Raj",
          reason: "Relocation",
          status: "Pending",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleApprove = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Approved" } : item
      )
    );
  };

  const filteredData =
    filter === "All" ? data : data.filter((d) => d.status === filter);

  const pendingCount = data.filter((d) => d.status === "Pending").length;
  const approvedCount = data.filter((d) => d.status === "Approved").length;

  const StatusBadge = ({ status }: { status: string }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        status === "Approved"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="p-6 bg-gray-50 h-full overflow-auto">
      {/* 🔹 Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Exit Requests</h1>
        <p className="text-gray-500 text-sm">
          Manage employee resignation workflow
        </p>
      </div>

      {/* 🔹 Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total</p>
          <h2 className="text-xl font-bold">{data.length}</h2>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl shadow">
          <p className="text-sm text-yellow-600">Pending</p>
          <h2 className="text-xl font-bold">{pendingCount}</h2>
        </div>

        <div className="bg-green-50 p-4 rounded-xl shadow">
          <p className="text-sm text-green-600">Approved</p>
          <h2 className="text-xl font-bold">{approvedCount}</h2>
        </div>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex gap-3 mb-4">
        {["All", "Pending", "Approved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-1.5 rounded-full text-sm ${
              filter === tab
                ? "bg-blue-500 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔹 List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : filteredData.length === 0 ? (
          <p className="text-center text-gray-500">No requests</p>
        ) : (
          filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center hover:shadow-md transition"
            >
              {/* Employee Info */}
              <div>
                <h3 className="font-semibold">{item.emp_name}</h3>
                <p className="text-xs text-gray-500">{item.emp_id}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {item.reason}
                </p>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4">
                <StatusBadge status={item.status} />

                {item.status === "Pending" ? (
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600"
                  >
                    Approve
                  </button>
                ) : (
                  <span className="text-green-600 font-medium text-sm">
                    Completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};