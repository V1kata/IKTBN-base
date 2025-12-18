"use client";

export default function LessonContent({ editing, content, editContent, setEditContent }) {
    return editing ? (
        <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full text-lg leading-relaxed text-gray-700 whitespace-pre-line mb-3 border p-3 rounded h-40"
        />
    ) : (
        <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line mb-8">{content}</p>
    );
}
