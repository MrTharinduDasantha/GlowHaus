// Standard debounce hook — used by search inputs.

import { useEffect, useState } from "react";

export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // cleanup on every change / unmount
  }, [value, delay]);

  return debounced;
};
