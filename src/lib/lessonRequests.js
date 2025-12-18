import { supabase } from "@/lib/supabaseClient";
import { TABLES, BUCKETS } from "@/utils/constants";
import { slugifyBulgarian } from "@/utils/translateBulgarian";

export async function getLessonsByGrade(grade) {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('grade', grade);

        return data;
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
}

export async function getLessonById(id) {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('id', id);

        return data[0];
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
}

export async function getPersonalLessons(userId) {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('teacherId', userId);

        return data;
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
}

export async function deleteLesson(id, userId) {
    try {
        // fetch lesson to get files and owner
        const { data: lesson, error: fetchErr } = await supabase
            .from(TABLES.LESSONS)
            .select('*')
            .eq('id', id)
            .single();

        if (fetchErr) return { success: false, error: fetchErr };

        if (lesson.teacherId !== userId) return { success: false, error: 'not_authorized' };

        const files = lesson.files || [];

        // attempt to remove associated files from storage
        for (const f of files) {
            let storageKey = null;
            if (!f) continue;
            if (typeof f === 'object') {
                storageKey = f.storageKey || null;
                if (!storageKey && f.url) {
                    const alias = decodeURIComponent(String(f.url).split('/').pop().split('?')[0]);
                    storageKey = alias;
                }
            } else if (typeof f === 'string') {
                const alias = decodeURIComponent(String(f).split('/').pop().split('?')[0]);
                storageKey = alias;
            }

            if (storageKey) {
                const { error: removeErr } = await supabase.storage.from(BUCKETS.LESSON_FILES).remove([storageKey]);
                if (removeErr && removeErr.status !== 404) {
                    console.error('Error removing file', storageKey, removeErr);
                }
            }
        }

        // delete lesson row
        const { data, error } = await supabase
            .from(TABLES.LESSONS)
            .delete()
            .eq('id', id);

        if (error) return { success: false, error };

        return { success: true, data };
    } catch (err) {
        console.error('Unexpected error deleting lesson:', err);
        return { success: false, error: err };
    }
}

export async function updateLesson(id, userId, updates = {}, options = {}) {
    // options: { filesToAdd: File[], filesToRemove: [storageKey|string] }
    try {
        // fetch lesson to confirm ownership
        const { data: lesson, error: fetchErr } = await supabase
            .from(TABLES.LESSONS)
            .select('*')
            .eq('id', id)
            .single();

        if (fetchErr) return { success: false, error: fetchErr };

        if (lesson.teacherId !== userId) return { success: false, error: 'not_authorized' };

        // Normalize existing files to objects {url, name, storageKey}
        const existingFiles = Array.isArray(lesson.files) ? lesson.files.map(f => {
            if (!f) return null;
            if (typeof f === 'string') {
                const alias = decodeURIComponent(String(f).split('/').pop().split('?')[0]);
                return { url: f, name: alias, storageKey: alias };
            }
            return f;
        }).filter(Boolean) : [];

        // Handle removals
        const filesToRemove = (options.filesToRemove || []).slice();
        let remainingFiles = existingFiles.filter(f => !filesToRemove.includes(f.storageKey));

        for (const key of filesToRemove) {
            try {
                const { error: removeErr } = await supabase.storage.from(BUCKETS.LESSON_FILES).remove([key]);
                if (removeErr && removeErr.status !== 404) {
                    console.error('Error removing file', key, removeErr);
                }
            } catch (e) {
                console.error('Remove file exception', key, e);
            }
        }

        // Handle additions
        const addedFiles = [];
        const filesToAdd = options.filesToAdd || [];
        for (const file of filesToAdd) {
            if (!file) continue;
            const originalName = file.name || 'file';
            const ext = originalName.includes('.') ? originalName.split('.').pop() : '';
            const safe = slugifyBulgarian(originalName.replace(/\.[^/.]+$/, ''));
            const storageKey = ext ? `${safe}-${Date.now()}.${ext}` : `${safe}-${Date.now()}`;

            const { error: uploadError } = await supabase
                .storage
                .from(BUCKETS.LESSON_FILES)
                .upload(storageKey, file);

            if (uploadError) {
                console.error('Upload error for', originalName, uploadError);
                return { success: false, error: uploadError };
            }

            const { data: publicURL } = supabase
                .storage
                .from(BUCKETS.LESSON_FILES)
                .getPublicUrl(storageKey);

            addedFiles.push({ url: publicURL.publicUrl, name: originalName, storageKey });
        }

        const finalFiles = [...remainingFiles, ...addedFiles];

        const payload = { ...updates, files: finalFiles };

        const { data, error } = await supabase
            .from(TABLES.LESSONS)
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) return { success: false, error };

        return { success: true, data };
    } catch (err) {
        console.error('Unexpected error updating lesson:', err);
        return { success: false, error: err };
    }
}