"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MaterialBtns } from "./customLesson/MaterialBtns";
import { useUser } from "@/app/context/UserContext";
import { deleteLesson, updateLesson } from "@/lib/lessonRequests";

import LessonHeader from "@/app/ui/lessons/LessonHeader";
import LessonContent from "@/app/ui/lessons/LessonContent";
import LessonFilesEditor from "@/app/ui/lessons/LessonFilesEditor";
import LessonActions from "@/app/ui/lessons/LessonActions";

export function LessonSkeleton({ lesson }) {
    const { userData } = useUser();
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Prevent non-owners from viewing private lessons (only after client mount to avoid hydration mismatch)
    if (lesson?.isPublic === false && mounted && userData?.id !== lesson?.teacherId) {
        return (
            <div className="max-w-4xl mx-auto py-10 text-center">
                <h2 className="text-xl font-semibold">Този урок е личен и не е достъпен.</h2>
            </div>
        );
    }

    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(lesson.title || "");
    const [editContent, setEditContent] = useState(lesson.content || "");
    const [saving, setSaving] = useState(false);

    // File management
    const [newFiles, setNewFiles] = useState([]); // File objects to upload
    const [removedFiles, setRemovedFiles] = useState([]); // storageKeys to remove

    // local copy to show updated values without requiring parent refresh
    const [localLesson, setLocalLesson] = useState(lesson);

    // Visibility toggle state for immediate owner updates
    const [togglingVisibility, setTogglingVisibility] = useState(false);

    // Pending visibility when editing (does not apply until save)
    const [pendingIsPublic, setPendingIsPublic] = useState(null);

    const handleSetVisibility = async (value) => {
        if (togglingVisibility) return;
        try {
            setTogglingVisibility(true);
            const res = await updateLesson(localLesson.id, userData.id, { isPublic: !!value }, { filesToAdd: [], filesToRemove: [] });
            if (!res.success) {
                console.error('Visibility update error:', res.error);
                alert('Възникна грешка при промяна на видимостта.');
                setTogglingVisibility(false);
                return;
            }
            setLocalLesson(res.data);
            // Keep pending editor visibility in sync if user is currently editing
            if (editing) setPendingIsPublic(res.data.isPublic);
        } catch (err) {
            console.error(err);
            alert('Възникна грешка при промяна на видимостта.');
        } finally {
            setTogglingVisibility(false);
        }
    };

    const handleStartEdit = () => {
        setEditTitle(localLesson.title || "");
        setEditContent(localLesson.content || "");
        setPendingIsPublic(!!localLesson.isPublic);
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditTitle("");
        setEditContent("");
        setPendingIsPublic(null);
    };

    const handleSaveEdit = async () => {
        if (saving) return;
        if (!editTitle) {
            alert('Моля, въведете заглавие.');
            return;
        }

        try {
            setSaving(true);
            const res = await updateLesson(localLesson.id, userData.id, {
                title: editTitle,
                content: editContent,
                isPublic: pendingIsPublic !== null ? !!pendingIsPublic : !!localLesson.isPublic,
            }, {
                filesToAdd: newFiles,
                filesToRemove: removedFiles,
            });

            if (!res.success) {
                console.error('Update error:', res.error);
                alert('Възникна грешка при запазване.');
                setSaving(false);
                return;
            }

            setLocalLesson(res.data);
            setNewFiles([]);
            setRemovedFiles([]);
            setEditing(false);
            setPendingIsPublic(null);
        } catch (err) {
            console.error(err);
            alert('Възникна грешка при запазване.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (deleting) return;
        const confirmed = confirm('Сигурни ли сте, че искате да изтриете този урок? Това действие е необратимо.');
        if (!confirmed) return;
        try {
            setDeleting(true);
            const res = await deleteLesson(localLesson.id, userData.id);
            if (!res.success) {
                console.error('Delete error:', res.error);
                alert('Възникна грешка при изтриване.');
                setDeleting(false);
                return;
            }
            // redirect to grade page
            router.push(`/content/class/${localLesson.grade}`);
        } catch (err) {
            console.error(err);
            alert('Възникна грешка при изтриване.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <article className="max-w-4xl mx-auto py-10">
            <LessonHeader
                grade={localLesson.grade}
                title={localLesson.title}
                editing={editing}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
            />

            <LessonContent
                editing={editing}
                content={localLesson.content}
                editContent={editContent}
                setEditContent={setEditContent}
            />

            {editing && (
                <div className="mb-6">
                    <LessonFilesEditor
                        files={localLesson.files}
                        newFiles={newFiles}
                        setNewFiles={setNewFiles}
                        removedFiles={removedFiles}
                        setRemovedFiles={setRemovedFiles}
                        setLocalLesson={setLocalLesson}
                    />

                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => setPendingIsPublic(prev => prev === null ? !localLesson.isPublic : !prev)}
                            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${(pendingIsPublic ?? localLesson.isPublic) ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}
                        >
                            {(pendingIsPublic ?? localLesson.isPublic) ? 'Публичен урок (видим за всички)' : 'Личен урок (видим само за мен)'}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex gap-4 items-center">
                <MaterialBtns lesson={localLesson} />
                <LessonActions
                    mounted={mounted}
                    isOwner={userData?.id == localLesson.teacherId}
                    editing={editing}
                    onStartEdit={handleStartEdit}
                    onCancelEdit={handleCancelEdit}
                    onSaveEdit={handleSaveEdit}
                    saving={saving}
                    deleting={deleting}
                    onDelete={handleDelete}
                />
                {userData?.id == localLesson.teacherId && (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => handleSetVisibility(!localLesson.isPublic)}
                            disabled={togglingVisibility}
                            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${localLesson.isPublic ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'} ${togglingVisibility ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95'}`}
                        >
                            {localLesson.isPublic ? 'Публичен' : 'Личен'}
                        </button>
                    </div>
                )}
            </div>

        </article>
    )
}