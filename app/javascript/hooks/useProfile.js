import { useEffect, useState } from "react";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/profile").then(async (r) => {
      if (r.ok) setProfile(await r.json());
      setIsLoading(false);
    });
  }, []);

  return { profile, setProfile, isLoading };
}
