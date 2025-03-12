import { useState, useEffect, useCallback } from 'react';

const useApiCall = (url, { method = 'GET', body = null, headers = {}, immediate = true } = {}) => {
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const callApi = useCallback(async (overrideUrl, overrideConfig = {}) => {
    const finalUrl = overrideUrl || url;
    const finalMethod = overrideConfig.method || method;
    const finalBody = overrideConfig.body !== undefined ? overrideConfig.body : body;
    const finalHeaders = { 'Content-Type': 'application/json', ...headers, ...overrideConfig.headers };
    setLoading(true);
    setError(null);
    try {
      const options = { method: finalMethod, headers: finalHeaders };
      if (finalBody) {
        options.body = JSON.stringify(finalBody);
      }
      const response = await fetch(finalUrl, options);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, body, headers]);

  useEffect(() => {
    if (immediate && url) {
      callApi();
    }
  }, [url, immediate, callApi]);

  return { loading, error, data, callApi };
};

export default useApiCall;
