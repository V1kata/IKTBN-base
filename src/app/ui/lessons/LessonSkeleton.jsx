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

    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(lesson.title || "");
    const [editContent, setEditContent] = useState(lesson.content || "");
    const [saving, setSaving] = useState(false);

    // File management
    const [newFiles, setNewFiles] = useState([]); // File objects to upload
    const [removedFiles, setRemovedFiles] = useState([]); // storageKeys to remove

    // local copy to show updated values without requiring parent refresh
    const [localLesson, setLocalLesson] = useState(lesson);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const handleStartEdit = () => {
        setEditTitle(localLesson.title || "");
        setEditContent(localLesson.content || "");
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditTitle("");
        setEditContent("");
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
                </div>
            )}

            <div className="flex gap-4">
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
            </div>

        </article>
    )
}