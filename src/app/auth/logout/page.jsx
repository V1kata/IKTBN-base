"use client";

import { useUser } from "@/app/context/UserContext";
import { logoutUser } from "@/lib/clientRequests";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/app/ui/middlewares/AuthGuard";

export default function LogoutPage() {
    const router = useRouter();
    const { setUserData } = useUser()

    useEffect(() => {
        async function performLogout() {
            await logoutUser(setUserData);
            router.push("/");
        }

        performLogout();
    }, [setUserData]);

    return (
        <AuthGuard access="loged">
            <div className="flex justify-center items-center min-h-[70vh]">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Изход...</h2>
            </div>
        </AuthGuard>
    );
}