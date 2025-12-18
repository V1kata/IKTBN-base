"use client";
import { useUser } from "@/app/context/UserContext";
import { login } from "@/lib/clientRequests";
import { useRouter } from "next/navigation";
import AuthGuard from "@/app/ui/middlewares/AuthGuard";
export default function Login() {
  const { userData, setUserData } = useUser();
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData.entries());

    try {
      const data = await login(email, password);
      setUserData(data);
      router.push("/");
    } catch (error) {
      console.error("Грешка при вход:", error);
    }
  }

  return (
    <AuthGuard access="unloged">
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Вход</h2>
          <form className="space-y-4 text-gray-800" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Имейл"
              name="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Парола"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Влез
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}