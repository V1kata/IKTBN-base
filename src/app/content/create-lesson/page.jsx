"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LessonFormComponent from "@/app/ui/createForm/LessonFormComponent";
import { createLesson } from "@/lib/createFormAction";
import { useUser } from "@/app/context/UserContext";
import AuthGuard from "@/app/ui/middlewares/AuthGuard";

export default function LessonForm() {
    const router = useRouter();
    const { userData } = useUser();

    const [lessonData, setLessonData] = useState({
        grade: "",
        title: "",
        content: "",
        files: [],
        isPublic: true,
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);

        try {
            if (!lessonData.title || !lessonData.grade) {
                alert("Моля, попълнете задължителните полета!");
                return;
            }

            const res = await createLesson({
                ...lessonData,
                userId: userData.id,
            });

            if (!res?.success) {
                alert("Грешка при създаване на урок.");
                console.error(res?.error);
                return;
            }

            router.push("/");
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthGuard access="teacher">
            <LessonFormComponent
                lessonData={lessonData}
                setLessonData={setLessonData}
                handleSubmit={handleSubmit}
                loading={loading}
            />
        </AuthGuard>
    );
}
