"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { deletePersonality, updatePersonality } from "@/lib/personalitiesRequests";
import { supabase } from "@/lib/supabaseClient";
import { BUCKETS } from "@/utils/constants";
import { transliterateBulgarian } from "@/utils/translateBulgarian";

export function PersonalitySkeleton({ personality }) {
    const { userData } = useUser();
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(personality?.name || "");
    const [editAchievementTitle, setEditAchievementTitle] = useState(personality?.achievement_title || "");
    const [editBirthYear, setEditBirthYear] = useState(personality?.birth_year || "");
    const [editDeathYear, setEditDeathYear] = useState(personality?.death_year || "");
    const [editCategory, setEditCategory] = useState(personality?.category || "bulgarian");
    const [editDescription, setEditDescription] = useState(personality?.description || "");
    const [editImageFile, setEditImageFile] = useState(null);
    const [saving, setSaving] = useState(false);

    const [localPersonality, setLocalPersonality] = useState(personality);

    const handleStartEdit = () => {
        setEditName(localPersonality?.name || "");
        setEditAchievementTitle(localPersonality?.achievement_title || "");
        setEditBirthYear(localPersonality?.birth_year || "");
        setEditDeathYear(localPersonality?.death_year || "");
        setEditCategory(localPersonality?.category || "bulgarian");
        setEditDescription(localPersonality?.description || "");
        setEditImageFile(null);
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditImageFile(null);
    };

    const handleImageChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setEditImageFile(e.target.files[0]);
    };

    const handleSaveEdit = async () => {
        if (saving) return;
        if (!editName || !editBirthYear || !editDeathYear) {
            alert('Моля, попълнете задължителните полета: Име, Година на раждане и Година на смърт.');
            return;
        }

        try {
            setSaving(true);
            let imagePath = localPersonality.image_path;

            // Upload image if new one is provided
            if (editImageFile) {
                const fileName = `${Date.now()}_${transliterateBulgarian(editImageFile.name).toLocaleLowerCase("bg-BG")}`;

                const { error: uploadError } = await supabase
                    .storage
                    .from(BUCKETS.HISTORICAL_FIGURES)
                    .upload(fileName, editImageFile);

                if (uploadError) {
                    console.error("Upload error:", uploadError);
                    alert('Възникна грешка при качване на изображението.');
                    setSaving(false);
                    return;
                }

                const { data: publicURL } = supabase
                    .storage
                    .from(BUCKETS.HISTORICAL_FIGURES)
                    .getPublicUrl(fileName);

                imagePath = publicURL.publicUrl;
            }

            const res = await updatePersonality(localPersonality.id, {
                name: editName,
                achievement_title: editAchievementTitle,
                birth_year: parseInt(editBirthYear),
                death_year: parseInt(editDeathYear),
                category: editCategory,
                description: editDescription,
                image_path: imagePath,
            });

            if (!res.success) {
                console.error('Update error:', res.error);
                alert('Възникна грешка при запазване.');
                setSaving(false);
                return;
            }

            setLocalPersonality(res.data);
            setEditing(false);
            setEditImageFile(null);
        } catch (err) {
            console.error(err);
            alert('Възникна грешка при запазване.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (deleting) return;
        const confirmed = confirm('Сигурни ли сте, че искате да изтриете тази личност? Това действие е необратимо.');
        if (!confirmed) return;
        try {
            setDeleting(true);
            const res = await deletePersonality(localPersonality.id);
            if (!res.success) {
                console.error('Delete error:', res.error);
                alert('Възникна грешка при изтриване.');
                setDeleting(false);
                return;
            }
            router.push('/personalities');
        } catch (err) {
            console.error(err);
            alert('Възникна грешка при изтриване.');
        } finally {
            setDeleting(false);
        }
    };

    if (!personality) {
        return (
            <div className="max-w-4xl mx-auto py-10 text-center">
                <h2 className="text-xl font-semibold">Личността не е намерена.</h2>
            </div>
        );
    }

    return (
        <article className="max-w-4xl mx-auto py-10">
            <Link href="/personalities" className="inline-block mb-6 text-blue-600 hover:text-blue-700 font-semibold">
                ← Назад към личностите
            </Link>

            {/* Header Image */}
            {editing ? (
                <div className="mb-8">
                    <label className="flex items-center justify-center w-full h-12 px-5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
                        Промени изображението
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    {editImageFile && (
                        <div className="mt-4 rounded-lg overflow-hidden shadow-lg h-96">
                            <img
                                src={URL.createObjectURL(editImageFile)}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    {!editImageFile && localPersonality.image_path && (
                        <div className="mt-4 rounded-lg overflow-hidden shadow-lg h-96">
                            <img
                                src={localPersonality.image_path}
                                alt={localPersonality.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>
            ) : (
                localPersonality.image_path && (
                    <div className="mb-8 rounded-lg overflow-hidden shadow-lg h-96">
                        <img
                            src={localPersonality.image_path}
                            alt={localPersonality.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )
            )}

            {/* Title Section */}
            <div className="mb-8">
                {editing ? (
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full text-4xl font-bold border-2 border-blue-400 rounded-lg p-3"
                            placeholder="Име"
                        />
                        <input
                            type="text"
                            value={editAchievementTitle}
                            onChange={(e) => setEditAchievementTitle(e.target.value)}
                            className="w-full text-xl text-gray-600 border-2 border-blue-400 rounded-lg p-3"
                            placeholder="Достижение / Титла"
                        />
                    </div>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{localPersonality.name}</h1>
                        {localPersonality.achievement_title && (
                            <p className="text-xl text-gray-600 mb-4">{localPersonality.achievement_title}</p>
                        )}
                    </>
                )}
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-100 p-6 rounded-lg">
                <div>
                    <p className="text-sm text-gray-600 font-semibold">ГОДИНА НА РАЖДАНЕ</p>
                    {editing ? (
                        <input
                            type="number"
                            value={editBirthYear}
                            onChange={(e) => setEditBirthYear(e.target.value)}
                            className="text-2xl font-bold border-2 border-blue-400 rounded-lg p-2 w-full"
                        />
                    ) : (
                        <p className="text-2xl font-bold text-gray-900">{localPersonality.birth_year}</p>
                    )}
                </div>
                <div>
                    <p className="text-sm text-gray-600 font-semibold">ГОДИНА НА СМЪРТ</p>
                    {editing ? (
                        <input
                            type="number"
                            value={editDeathYear}
                            onChange={(e) => setEditDeathYear(e.target.value)}
                            className="text-2xl font-bold border-2 border-blue-400 rounded-lg p-2 w-full"
                        />
                    ) : (
                        <p className="text-2xl font-bold text-gray-900">{localPersonality.death_year}</p>
                    )}
                </div>
                <div>
                    <p className="text-sm text-gray-600 font-semibold">КАТЕГОРИЯ</p>
                    {editing ? (
                        <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="text-lg font-bold border-2 border-blue-400 rounded-lg p-2 w-full"
                        >
                            <option value="bulgarian">bulgarian</option>
                            <option value="бесарабски">бесарабски</option>
                        </select>
                    ) : (
                        <p className="text-lg font-bold text-gray-900 capitalize">{localPersonality.category}</p>
                    )}
                </div>
                <div>
                    <p className="text-sm text-gray-600 font-semibold">ВЪЗРАСТ</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {localPersonality.death_year - localPersonality.birth_year}
                    </p>
                </div>
            </div>

            {/* Description */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">За личността</h2>
                {editing ? (
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full h-64 border-2 border-blue-400 rounded-lg p-4 font-base text-gray-700"
                        placeholder="Описание на личността"
                    />
                ) : (
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {localPersonality.description || 'Няма описание.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {mounted && userData && (
                <div className="flex gap-4 mt-8">
                    {!editing ? (
                        <>
                            <button
                                onClick={handleStartEdit}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                            >
                                Редактирай
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                            >
                                {deleting ? 'Изтриване...' : 'Изтрий'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                            >
                                {saving ? 'Запазване...' : 'Запази'}
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition"
                            >
                                Отмени
                            </button>
                        </>
                    )}
                </div>
            )}
        </article>
    );
}
