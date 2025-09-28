import { useState, useEffect, useCallback } from "react";

export default function useProjectInfo(projectId) {
  const [projectInfo, setProjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectInfo = useCallback(() => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    fetch(`${process.env.API_URL}/api/projects/${projectId}/info`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project info");
        return res.json();
      })
      .then((data) => setProjectInfo(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    fetchProjectInfo();
  }, [fetchProjectInfo]);

  return { projectInfo, loading, error, refresh: fetchProjectInfo };
}
