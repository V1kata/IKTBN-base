"use client";

import Link from "next/link";

export default function LessonHeader({ grade, title, editing, editTitle, setEditTitle }) {
    return (
        <div className="mb-6">
            <Link href={`/content/class/${grade}`} className="text-red-600 hover:underline">
                ← Назад към {grade} клас
            </Link>

            {editing ? (
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-3xl font-bold mt-4 mb-3 border p-2 rounded"
                />
            ) : (
                <h1 className="text-3xl font-bold mt-4 mb-6">{title}</h1>
            )}
        </div>
    );
}
