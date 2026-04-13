import { useEffect, useState } from "react";

export const useListOptions = (url: string) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();

        // ✅ Extract only name + id
        const formatted = data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));

        setOptions(formatted);
      } catch (err) {
        console.error("Error  names:", err);
        setOptions([]);
      }
    };

    fetchData();
  }, [url]);

  return options;
};