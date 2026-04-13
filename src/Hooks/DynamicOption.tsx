import { useEffect, useState } from "react";

export const useOptions = (
  url: string,
  key: string,        // 👈 NEW (gender / payType / etc)
  labelKey: string,
  valueKey?: string
) => {
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(url);
      const data = await res.json();

      const list = data[key]; // 👈 get specific array

      const formatted = list.map((item: any) => ({
        label: item[labelKey],
        value: valueKey ? item[valueKey] : item[labelKey],
      }));

      setOptions(formatted);
    };

    fetchData();
  }, [url, key, labelKey, valueKey]);

  return options;
};