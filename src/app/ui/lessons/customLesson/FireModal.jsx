import { ModalFilesShow } from "@/app/ui/lessons/customLesson/ModalFilesShow";
import { parseFile } from "@/utils/fileUtils";

export function FileModal({ title, isOpen, onClose, files }) {
    if (!isOpen) return null;

    // Подготвяме данните за ModalFilesShow в единен формат
    const formattedFiles = (files || []).map(f => {
        const p = parseFile(f);
        return { name: p.name, url: p.url };
    });

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-5 rounded-xl w-80 shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-xl px-2"
                        type="button"
                    >
                        ✖
                    </button>
                </div>
                <ModalFilesShow files={formattedFiles} />
            </div>
        </div>
    );
};

const getFileName = (url) => {
    if (!url) return "";
    const alias = url.split("/").pop();
    // Проверка дали има timestamp (търсим долна черта)
    const parts = alias.split('_');
    if (parts.length > 1) {
        // Махаме първата част (timestamp-а) и събираме останалото, ако има още долни черти
        return decodeURIComponent(parts.slice(1).join('_'));
    }
    
    return decodeURIComponent(alias);
};