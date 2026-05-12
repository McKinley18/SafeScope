import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL;

export function useOrganization() {
  const [org, setOrg] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!API) {
      console.error('API URL missing');
      setLoading(false);
      return;
    }

    fetch(`${API}/organization`)
      .then((res) => {
        if (!res.ok) throw new Error('Bad response');
        return res.json();
      })
      .then((data) => setOrg(data || {}))
      .catch((err) => {
        console.warn('⚠️ Fetch failed, using fallback:', err);
        setOrg({});
      })
      .finally(() => setLoading(false));
  }, []);

  return { org, loading };
}
