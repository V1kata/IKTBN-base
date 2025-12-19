"use client";
import { useEffect, useState } from "react";
import { AllLessons } from "@/app/ui/lessons/allLessonsComponents/AllLesson";
import { useUser } from "@/app/context/UserContext";
import { getPersonalLessons } from "@/lib/lessonRequests";

export function AllLessonsSkeleton({ lessons = [], grade }) {
    const { userData } = useUser();
    const [visibleLessons, setVisibleLessons] = useState(lessons || []);

    useEffect(() => {
        // Merge owner's private lessons into the visible list
        async function includePrivate() {
            if (!userData?.id) return;
            try {
                const personal = await getPersonalLessons(userData.id);
                const privateForGrade = (personal || []).filter(l => l.grade == grade && l.isPublic === false);
                if (!privateForGrade.length) return;
                setVisibleLessons(prev => {
                    const map = new Map(prev.map(l => [l.id, l]));
                    for (const p of privateForGrade) map.set(p.id, p);
                    return Array.from(map.values());
                });
            } catch (err) {
                console.error('Error fetching personal lessons:', err);
            }
        }
        includePrivate();
    }, [userData, grade]);

    return (
        <section className="max-w-5xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                {grade} клас — Уроци
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {visibleLessons.map((lesson) => (
                    <AllLessons lesson={lesson} key={lesson.id} />
                ))}
            </div>
        </section>
    )
}