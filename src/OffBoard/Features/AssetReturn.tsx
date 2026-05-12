import { useEffect, useState } from "react";
import { Laptop, Smartphone, CreditCard, ChevronRight } from "lucide-react";

type AssetDetail = {
  asset_name: string;
  asset_id: string;
  status: "Pending" | "Returned";
};

type EmployeeGroup = {
  emp_id: string;
  emp_name: string;
  assets: AssetDetail[];
};

export const AssetReturn = () => {
  const [data, setData] = useState<EmployeeGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        {
          emp_id: "EMP001",
          emp_name: "Arun Kumar",
          assets: [
            { asset_name: "MacBook Pro", asset_id: "LAP123", status: "Pending" },
            { asset_name: "iPhone 13", asset_id: "MOB-88", status: "Returned" },
            { asset_name: "Access Card", asset_id: "ID-001", status: "Pending" },
          ],
        },
        {
          emp_id: "EMP002",
          emp_name: "Priya Sharma",
          assets: [
            { asset_name: "Dell Monitor", asset_id: "MON-99", status: "Pending" },
          ],
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleReturn = (empId: string, assetId: string) => {
    setData((prev) =>
      prev.map((emp) => {
        if (emp.emp_id === empId) {
          return {
            ...emp,
            assets: emp.assets.map((a) =>
              a.asset_id === assetId ? { ...a, status: "Returned" } : a
            ),
          };
        }
        return emp;
      })
    );
  };

  return (
    <div className="p-6 h-full overflow-auto bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Asset Recovery
        </h1>
        <p className="text-gray-500 text-sm">
          Manage hardware returns by employee
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : (
          data.map((emp) => (
            <div
              key={emp.emp_id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm"
            >
              {/* Employee Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {emp.emp_name}
                  </h3>
                  <p className="text-xs text-blue-600 font-mono">
                    {emp.emp_id}
                  </p>
                </div>

                <div className="text-right text-xs text-gray-500">
                  {emp.assets.filter((a) => a.status === "Returned").length} /{" "}
                  {emp.assets.length} Items Returned
                </div>
              </div>

              {/* Assets */}
              <div className="p-2 space-y-2">
                {emp.assets.map((asset) => (
                  <div
                    key={asset.asset_id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          asset.status === "Returned"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {asset.asset_name.toLowerCase().includes("laptop") && (
                          <Laptop size={18} />
                        )}
                        {asset.asset_name.toLowerCase().includes("mobile") ||
                        asset.asset_name.toLowerCase().includes("iphone") ? (
                          <Smartphone size={18} />
                        ) : null}
                        {asset.asset_name.toLowerCase().includes("card") && (
                          <CreditCard size={18} />
                        )}
                        {!asset.asset_name
                          .toLowerCase()
                          .match(/laptop|mobile|iphone|card/) && (
                          <ChevronRight size={18} />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {asset.asset_name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {asset.asset_id}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                      {asset.status === "Returned" ? (
                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                          CLEARED
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            handleReturn(emp.emp_id, asset.asset_id)
                          }
                          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg transition"
                        >
                          Mark as Returned
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};