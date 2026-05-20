import { useEffect, useState } from "react";

export const useOptions = (
  url: string,
  key: string,
  labelKey: string,
  valueKey?: string
) => {
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${url}${key}`); // 🔥 IMPORTANT
        const data = await res.json();

        const list = data.options || []; // ✅ FIX

        const formatted = list.map((item: any) => ({
          label: item[labelKey],
          value: valueKey ? item[valueKey] : item[labelKey],
          symbol: item.symbol,
        }));

        setOptions(formatted);
      } catch (err) {
        console.error("Options fetch error:", err);
      }
    };

    fetchData();
  }, [url, key, labelKey, valueKey]);

  return options;
};