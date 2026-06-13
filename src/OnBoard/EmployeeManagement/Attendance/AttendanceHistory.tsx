import { useEffect, useState,  } from "react";
import { useParams } from "react-router-dom";

import { Api_URL } from "../../../APILINK";
import {  TrendingUp } from "lucide-react";
import { empMangeTheme } from "../../../Themes/EmpMangeTheme/empMangeConfig";

import { AH_Table, type Column } from "./AH_Table";


export const AttendanceHistory = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any[]>([]);
    const [ ,setLoading] = useState(false);

      const columns: Column[] = [
        { header: "Date", accessor: "date" },
        { header: "Check In", accessor: "checkin" },
        { header: "Check Out", accessor: "checkout" },
        { header: "Status", accessor: "status" },
        { header: "Actions", type: "action" },
      ];
    
        console.log(`${Api_URL}/attendance/record/${id}`);
useEffect(() => {
  const fetchHistory = async () => {
    if (!id) return;

    setLoading(true);

    try {
      const res = await fetch(`${Api_URL}/attendance/record/${id}`);

      if (res.ok) {
        const result = await res.json();
        console.log(result);

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

  fetchHistory(); // <-- Missing
}, [id]);

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
                <div className={empMangeTheme.section.card}>
                  <div className={empMangeTheme.section.header}>
                    <div className={empMangeTheme.section.title}>
                      <span className={empMangeTheme.section.titleDot} />
                      PersonnelList
                    </div>
                  </div>
                  <AH_Table columns={columns} data={data}  />
                </div>                    
        </div>
    );
};
