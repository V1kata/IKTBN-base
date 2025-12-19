import Link from "next/link"

export function AllLessons({ lesson }) {
    return (
        <Link
            href={`/content/lesson/${lesson.id}`}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition"
        >
            <div className="p-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-800">
                    {lesson.title}
                </h2>
                {!lesson.isPublic && (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        🔒 <span>Личен</span>
                    </span>
                )}
            </div>
        </Link>
    )
}