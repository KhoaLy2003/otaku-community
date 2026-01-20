import { useEffect, useState } from "react";

export function useObjectUrl(file?: File) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return url;
}
