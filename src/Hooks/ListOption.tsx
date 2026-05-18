import { useEffect, useState } from "react";

interface OptionType {
  label: string;
  value: string;
}

export const useListOptions = (url: string) => {
  const [options, setOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        const formatted = list.map((item: any) => ({
          label:
            item.label ||
            item.Dep_name ||
            item.providername ||
            item.name ||
            "Unknown",

          // ✅ FIXED: value-லயும் Dep_name / label போகுது
          value:
            item.label ||
            item.provider_id ||    // ✅ Added provider_id
            item.Dep_name ||      
            item.providername ||
            item.name ||
            "",
        }));

        setOptions(formatted);
      } catch (err) {
        console.error("Error fetching options:", err);
        setOptions([]);
      }
    };

    fetchData();
  }, [url]);

  return options;
};