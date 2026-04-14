import { useEffect, useState } from "react";

export const useListOptions = (url: string) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();

        console.log("API Response:", data);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        const formatted = list.map((item: any) => ({
          label: item.providername || item.name,   // flexible
          value: item.provider_id || item.id,      // flexible
        }));

        setOptions(formatted);
      } catch (err) {
        console.error("Error names:", err);
        setOptions([]);
      }
    };

    fetchData();
  }, [url]);

  return options;
};