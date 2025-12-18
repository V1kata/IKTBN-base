"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialBtns } from "./customLesson/MaterialBtns";
import { useUser } from "@/app/context/UserContext";
import { deleteLesson } from "@/lib/lessonRequests";

export function LessonSkeleton({ lesson }) {
    const { userData } = useUser();
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    const handleEditClick = () => {
        alert("Функционал за редактиране ще бъде добавен скоро!");
    };

    const handleDelete = async () => {
        if (deleting) return;
        const confirmed = confirm('Сигурни ли сте, че искате да изтриете този урок? Това действие е необратимо.');
        if (!confirmed) return;
        try {
            setDeleting(true);
            const res = await deleteLesson(lesson.id, userData.id);
            if (!res.success) {
                console.error('Delete error:', res.error);
                alert('Възникна грешка при изтриване.');
                setDeleting(false);
                return;
            }
            // redirect to grade page
            router.push(`/content/class/${lesson.grade}`);
        } catch (err) {
            console.error(err);
            alert('Възникна грешка при изтриване.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <article className="max-w-4xl mx-auto py-10">
            <Link href={`/content/class/${lesson.grade}`} className="text-red-600 hover:underline">
                ← Назад към {lesson.grade} клас
            </Link>

            <h1 className="text-3xl font-bold mt-4 mb-6">{lesson.title}</h1>
            <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line mb-8">
                {lesson.content}
            </p>

            <div className="flex gap-4">
                <MaterialBtns lesson={lesson} />
                {userData?.id == lesson.teacherId && (
                    <>
                        <button
                            className="text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600"
                            onClick={handleEditClick}
                        >Редактирай урока</button>
                        <button
                            className="text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50"
                            onClick={handleDelete}
                            disabled={deleting}
                        >{deleting ? 'Изтриване...' : 'Изтрий урока'}</button>
                    </>
                )}
            </div>

        </article>
    )
}