import { supabase } from "@/lib/supabaseClient";
import { TABLES, BUCKETS } from "@/utils/constants";
import { transliterateBulgarian } from "@/utils/translateBulgarian";

export async function createPersonality({ name, achievement_title, birth_year, death_year, category, description, imageFile }) {
    try {
        if (!name || !birth_year || !death_year) {
            return { success: false, error: "Name, birth year, and death year are required" };
        }

        let imagePath = null;

        // Upload image if provided
        if (imageFile) {
            const fileName = `${Date.now()}_${transliterateBulgarian(imageFile.name).toLocaleLowerCase("bg-BG")}`;

            const { error: uploadError } = await supabase
                .storage
                .from(BUCKETS.HISTORICAL_FIGURES)
                .upload(fileName, imageFile);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                return { success: false, error: uploadError };
            }

            const { data: publicURL } = supabase
                .storage
                .from(BUCKETS.HISTORICAL_FIGURES)
                .getPublicUrl(fileName);

            imagePath = publicURL.publicUrl;
        }

        const { data, error } = await supabase
            .from(TABLES.HISTORICAL_FIGURES)
            .insert([
                {
                    name,
                    achievement_title: achievement_title || null,
                    birth_year: parseInt(birth_year),
                    death_year: parseInt(death_year),
                    category,
                    description: description || null,
                    image_path: imagePath,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Insert error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Error creating personality:", err);
        return { success: false, error: err };
    }
}
