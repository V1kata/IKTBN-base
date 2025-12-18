"use client";

import AuthGuard from "@/app/ui/middlewares/AuthGuard";

export default function RequestTeacherAdminClient({ teachers }) {
  return (
    <AuthGuard access="admin">
      <>
        {teachers?.length > 0 && teachers.map((t, i) => (
          <div key={i}>
            {/* reuse existing skeleton */}
            {/* The RequestPageSkeleton is a server component; import it dynamically in the parent if needed. */}
            {/* For now, render minimal info */}
            <div className="p-4 border rounded mb-2">
              <h3 className="font-bold">{t.email}</h3>
              <p className="text-sm text-gray-600">Заявено: {t.created_at}</p>
            </div>
          </div>
        ))}
      </>
    </AuthGuard>
  );
}
