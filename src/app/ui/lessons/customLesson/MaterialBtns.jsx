import { useState } from "react";
import { FileModal } from "@/app/ui/lessons/customLesson/FireModal";
import { parseFile } from "@/utils/fileUtils";

export function MaterialBtns({ lesson }) {
    const [openMoreFiles, setOpenMoreFiles] = useState(false);
    const [openPresentation, setOpenPresentation] = useState(false);

    const presentations = [];
    const extra = [];

    if (lesson.files)
        for (const fRaw of lesson.files) {
            const f = parseFile(fRaw);
            (f.url?.toLowerCase().endsWith(".pptx") ? presentations : extra).push(f);
        }

    return (
        <>
            <div className="flex gap-2 flex-wrap">
                {/* --- Логика за Презентации --- */}
                {presentations.length > 0 && (
                    presentations.length === 1 ? (
                        // Ако е само 1 презентация -> директен линк
                        <a
                            href={presentations[0].url}
                            download={presentations[0].name}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            📘 Презентация
                        </a>
                    ) : (
                        // Ако са повече -> бутон за модал
                        <button
                            onClick={() => setOpenPresentation(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                            type="button"
                        >
                            📘 Презентации
                        </button>
                    )
                )}

                {/* --- Логика за Допълнителни материали --- */}
                {extra.length > 0 && (
                    <button
                        onClick={() => setOpenMoreFiles(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        type="button"
                    >
                        📎 Допълнителни материали
                    </button>
                )}

                {/* --- Модални прозорци --- */}
                <FileModal
                    title="Презентации"
                    files={presentations}
                    isOpen={openPresentation}
                    onClose={() => setOpenPresentation(false)}
                />

                <FileModal
                    title="Файлове"
                    files={extra}
                    isOpen={openMoreFiles}
                    onClose={() => setOpenMoreFiles(false)}
                />
            </div>
        </>
    )
}