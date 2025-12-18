"use client";

export default function LessonActions({ mounted, isOwner, editing, onStartEdit, onCancelEdit, onSaveEdit, saving, deleting, onDelete }) {
    if (!mounted) return null;

    return (
        <div className="flex gap-4">
            {isOwner && (
                <>
                    <button
                        className="text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600"
                        onClick={editing ? onCancelEdit : onStartEdit}
                    >{editing ? 'Откажи редакция' : 'Редактирай урока'}</button>
                    {editing ? (
                        <button
                            className="text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 bg-green-600 hover:bg-green-700"
                            onClick={onSaveEdit}
                            disabled={saving}
                        >{saving ? 'Запазване...' : 'Запази'}</button>
                    ) : null}
                    <button
                        className="text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50"
                        onClick={onDelete}
                        disabled={deleting}
                    >{deleting ? 'Изтриване...' : 'Изтрий урока'}</button>
                </>
            )}
        </div>
    );
}
