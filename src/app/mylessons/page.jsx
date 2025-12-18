"use client";
import { useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import { getPersonalLessons } from "@/lib/lessonRequests";
import { AllLessons } from "@/app/ui/lessons/allLessonsComponents/AllLesson";
import AuthGuard from "@/app/ui/middlewares/AuthGuard";

export default function MyLessonsPage() {
    const { userData } = useUser();
    const [lessonsByGrade, setLessonsByGrade] = useState({});

    useEffect(() => {
        if (!userData?.id) return; // Ако няма user, не правим fetch

        async function getLessons() {
            try {
                const data = await getPersonalLessons(userData.id);

                // Групиране по клас
                const groupedLessons = {};
                for (let lesson of data) {
                    const grade = lesson.grade;
                    if (!groupedLessons[grade]) groupedLessons[grade] = [];
                    groupedLessons[grade].push(lesson);
                }

                setLessonsByGrade(groupedLessons);
            } catch (error) {
                console.error("Unexpected error:", error);
            }
        }

        getLessons();
    }, [userData]);

    return (
        <AuthGuard access="teacher">
            <div className="flex flex-col items-center">
                {Object.keys(lessonsByGrade)?.length === 0 ? (
                    <p className="text-gray-500">Все още нямате качени уроци.</p>
                ) : (
                    Object.entries(lessonsByGrade)?.map(([grade, lessons]) => (
                        <div key={grade} className="mb-6 w-full max-w-5xl">
                            {/* Заглавие на класа */}
                            <h2 className="text-xl font-bold mb-4 text-center">Клас {grade}</h2>

                            {/* Уроците в редица */}
                            <div className="flex flex-wrap justify-center gap-4">
                                {lessons?.map((lesson) => (
                                    <AllLessons key={lesson.id} lesson={lesson} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AuthGuard>
    );
}
