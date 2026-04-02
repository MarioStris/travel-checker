import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function AddTab() {
  const router = useRouter();

  useEffect(() => {
    router.push("/add-trip");
  }, [router]);

  return null;
}
