import { useState, useEffect } from "react";

export const useCurrencies = () => {
  const [currencyOptions, setCurrencyOptions] = useState<{ value: string; label: string }[]>([]);
  const [currencySymbolMap, setCurrencySymbolMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=currencies");
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();

        const uniqueCurrencies: Record<string, { name: string; symbol: string }> = {};
        const symbolMap: Record<string, string> = {};

        data.forEach((country: any) => {
          if (country.currencies) {
            Object.entries(country.currencies).forEach(([code, details]: [string, any]) => {
              if (code && !uniqueCurrencies[code]) {
                const symbol = details.symbol ?? code;
                uniqueCurrencies[code] = { name: details.name ?? code, symbol };
                symbolMap[code] = symbol;
              }
            });
          }
        });

        const options = Object.entries(uniqueCurrencies)
          .map(([code, { name, symbol }]) => ({
            value: code,
            label: `${code} - ${name} (${symbol})`,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCurrencyOptions(options);
        setCurrencySymbolMap(symbolMap);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  return { currencyOptions, currencySymbolMap, currencyLoading: loading, currencyError: error };
};