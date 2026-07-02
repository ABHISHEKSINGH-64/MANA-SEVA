import { useEffect, useState } from 'react';
import { api, apiMessage } from '../services/api';

export function useFetch(url, initialValue) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api.get(url)
      .then((response) => {
        if (active) setData(response.data);
      })
      .catch((err) => active && setError(apiMessage(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [url]);

  return { data, setData, loading, error };
}
