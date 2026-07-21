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
        const response = await fetch("http://127.0.0.1:8000/api/currency");
        if (!response.ok) throw new Error("Network error");

        const json = await response.json();
        const countries = json.data.objects; // actual array of country objects

        const uniqueCurrencies: Record<string, { name: string; symbol: string }> = {};
        const symbolMap: Record<string, string> = {};

        countries.forEach((country: any) => {
          if (Array.isArray(country.currencies)) {
            country.currencies.forEach((currency: any) => {
              const code = currency.code;
              if (code && !uniqueCurrencies[code]) {
                const symbol = currency.symbol ?? code;
                uniqueCurrencies[code] = { name: currency.name ?? code, symbol };
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