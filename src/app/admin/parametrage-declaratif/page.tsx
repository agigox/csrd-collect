"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Deprecated route - redirects to /admin/new
export default function DeprecatedFormEditorPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/new");
  }, [router]);

  return null;
}
