"use client";

import { requestTeacher } from "@/lib/clientRequests";
import { useRouter } from "next/navigation";
import { Mail, Send } from "lucide-react";
import AuthGuard from "@/app/ui/middlewares/AuthGuard";

export default function InvitePage() {
  const router = useRouter();
  async function inviteTeacher(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email")
    await requestTeacher(email);

    router.push("/");
  }

  return (
    <AuthGuard access="unloged">
      <form
        onSubmit={inviteTeacher}
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-5"
      >
      <label className="flex flex-col text-gray-700 font-medium">
        <span>Email на учител</span>
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="example@domain.com"
            required
            className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
        <span className="text-xs text-gray-400 mt-1">
          Въведи валиден email, на който ще изпратим поканата.
        </span>
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
      >
        <Send size={18} />
        Покани учител
      </button>
      </form>
    </AuthGuard>
  );
}