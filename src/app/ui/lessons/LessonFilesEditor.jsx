"use client";

import { parseFile } from "@/utils/fileUtils";

export default function LessonFilesEditor({ files = [], newFiles, setNewFiles, removedFiles, setRemovedFiles, setLocalLesson }) {
    const handleRemoveExisting = (f) => {
        const parsed = parseFile(f);
        const storageKey = parsed.storageKey || parsed.name;
        setRemovedFiles(prev => [...prev, storageKey]);
        setLocalLesson(prev => ({ ...prev, files: prev.files.filter(x => parseFile(x).storageKey !== storageKey) }));
    };

    return (
        <div className="mb-4">
            <label className="block font-medium mb-2">Материали:</label>

            <ul className="space-y-2 mb-3">
                {(files || []).map((f, idx) => {
                    const p = parseFile(f);
                    if (removedFiles.includes(p.storageKey || p.name)) return null;
                    return (
                        <li key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="truncate">{p.name}</span>
                            <div className="flex items-center gap-2">
                                <a href={p.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Отвори</a>
                                <button
                                    type="button"
                                    className="text-red-600"
                                    onClick={() => handleRemoveExisting(f)}
                                >Изтрий</button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <label className="block text-sm text-gray-600 mb-2">Добави файлове</label>
            <input
                type="file"
                multiple
                onChange={(e) => {
                    const filesArr = Array.from(e.target.files || []);
                    setNewFiles(prev => [...prev, ...filesArr]);
                    e.currentTarget.value = null;
                }}
                className="mb-2"
            />

            {newFiles.length > 0 && (
                <ul className="space-y-2 mb-3">
                    {newFiles.map((f, i) => (
                        <li key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="truncate">{f.name}</span>
                            <button type="button" className="text-red-600" onClick={() => setNewFiles(prev => prev.filter((_, idx) => idx !== i))}>Премахни</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
