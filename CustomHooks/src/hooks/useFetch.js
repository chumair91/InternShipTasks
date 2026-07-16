import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) return;
    const fetchGitUser = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("User not found");
        }
        const data = await res.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }finally {
        setLoading(false);
      }
    };

    fetchGitUser();
  }, [url]);
  return { data, loading, error };
};

export default useFetch;
