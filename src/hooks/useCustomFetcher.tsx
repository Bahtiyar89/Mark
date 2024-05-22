import { useState } from "react";

export default function useCustomFetcher() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const onFetch = (onLoad: any, url: any, options: any) => {
    setIsLoading(true);

    fetch(url, options)
      .then((res: any) => {
        res.json().then((data: any) => {
          onLoad(data);
        });
        setError(res.status);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  return [error, isLoading, onFetch] as const;
}
