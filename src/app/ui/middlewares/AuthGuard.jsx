"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { canAccess } from "@/utils/access";
import { ROLES } from "@/utils/roles";

export default function AuthGuard({ access = "all", children }) {
  const { userData } = useUser();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // try to get role from context or localStorage synchronously
    let role = userData?.role;

    if (!role && typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("user") || "null");
        role = stored?.role;
      } catch (e) {
        role = null;
      }
    }

    const effectiveRole = role || ROLES.UNLOGED;

    if (!canAccess(effectiveRole, access)) {
      // unauthorized — decide where to redirect
      if (access === "unloged") {
        // page intended for unauthenticated users — send logged users away
        router.push("/");
        return;
      }

      // pages that require being logged should redirect to login if user is unauthenticated
      if (effectiveRole === ROLES.UNLOGED) {
        router.push("/auth/login");
        return;
      }

      // user is logged but lacks privileges
      router.push("/");
      return;
    }

    setAllowed(true);
  }, [userData, access, router]);

  if (!allowed) return null;
  return children;
}
