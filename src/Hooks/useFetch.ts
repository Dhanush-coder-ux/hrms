import { useState, useEffect } from "react";

/**
 * A highly resilient, type-safe generic custom fetch hook.
 * Fetches full datasets from the local JSON-server database,
 * and seamlessly falls back to local high-fidelity presets if the server is offline.
 */
export function useFetch<T>(url: string, fallbackData?: T): T | undefined {
    const [data, setData] = useState<T | undefined>(fallbackData);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const res = await fetch(url);
                if (res.ok) {
                    const result = await res.json();
                    if (isMounted && result && (!Array.isArray(result) || result.length > 0)) {
                        setData(result);
                    }
                }
            } catch (err) {
                console.warn(`Database unreachable at ${url}.`, err);
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [url]);

    return data;
}
