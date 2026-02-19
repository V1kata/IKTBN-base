"use client";

import { useState } from "react";
import AuthGuard from "@/app/ui/middlewares/AuthGuard";
import { Check, X, Loader } from "lucide-react";

export default function RequestTeacherAdminClient({ teachers }) {
  const [loadingId, setLoadingId] = useState(null);
  const [teachersList, setTeachersList] = useState(teachers || []);
  const [message, setMessage] = useState("");

  async function handleAccept(email) {
    try {
      setLoadingId(email);
      setMessage("");

      const response = await fetch("/api/invite-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "accepted" })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Грешка при приемане на заявката");
      }

      setTeachersList(teachersList.filter(t => t.email !== email));
      setMessage(`✅ Покана изпратена на ${email}`);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDecline(email) {
    try {
      setLoadingId(email);
      setMessage("");

      const response = await fetch("/api/invite-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "declined" })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Грешка при отхвърляне на заявката");
      }

      setTeachersList(teachersList.filter(t => t.email !== email));
      setMessage(`✅ Заявката на ${email} е отхвърлена`);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <AuthGuard access="admin">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Заявки за учители</h1>

        {message && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-gray-700">
            {message}
          </div>
        )}

        {teachersList?.length > 0 ? (
          <div className="space-y-3">
            {teachersList.map((t, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{t.email}</h3>
                    <p className="text-sm text-gray-500">
                      Заявено: {new Date(t.created_at).toLocaleString("bg-BG")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(t.email)}
                      disabled={loadingId === t.email}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
                    >
                      {loadingId === t.email ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
                      Приеми
                    </button>
                    <button
                      onClick={() => handleDecline(t.email)}
                      disabled={loadingId === t.email}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
                    >
                      {loadingId === t.email ? <Loader size={16} className="animate-spin" /> : <X size={16} />}
                      Отхвърли
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">Няма нови заявки за учители</p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
