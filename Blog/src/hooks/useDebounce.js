import { useEffect, useState } from "react";

const useDebounce = (value, delay) => {
  const [debusername, setDebuserName] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => {
      setDebuserName(value);
    }, delay);
    return () => clearInterval(id);
  }, [delay, value]);

  return debusername;
};

export default useDebounce;
