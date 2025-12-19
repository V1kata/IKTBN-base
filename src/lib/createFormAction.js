import { supabase } from "@/lib/supabaseClient";
import { TABLES, BUCKETS } from "@/utils/constants";
import { transliterateBulgarian } from "@/utils/translateBulgarian";

export async function createLesson({ grade, title, content, files, userId, isPublic = true }) {
    try {
        const fileUrls = [];

        for (const file of files) {
            const fileName = `${Date.now()}_${transliterateBulgarian(file.name).toLocaleLowerCase("bg-BG")}`;

            const { error: uploadError } = await supabase
                .storage
                .from(BUCKETS.LESSON_FILES)
                .upload(fileName, file);

            if (uploadError) {
                return { success: false, error: uploadError };
            }

            const { data: publicURL } = supabase
                .storage
                .from(BUCKETS.LESSON_FILES)
                .getPublicUrl(fileName);

            fileUrls.push(publicURL.publicUrl);
        }

        const { data, error } = await supabase
            .from(TABLES.LESSONS)
            .insert([
                {
                    grade,
                    title,
                    content,
                    files: fileUrls,
                    teacherId: userId,
                    isPublic,
                },
            ])
            .select()
            .single();

        if (error) return { success: false, error };

        return { success: true, data };
    } catch (err) {
        console.error("Error creating lesson:", err);
        return { success: false, error: err };
    }
}
