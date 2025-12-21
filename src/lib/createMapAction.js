import { supabase } from "@/lib/supabaseClient";
import { TABLES, BUCKETS } from "@/utils/constants";
import { transliterateBulgarian } from "@/utils/translateBulgarian";

export async function createMap({ title, imageFile, userId }) {
    try {
        if (!title) return { success: false, error: "Title is required" };
        if (!imageFile) return { success: false, error: "Image file is required" };

        const fileName = `${Date.now()}_${transliterateBulgarian(imageFile.name).toLocaleLowerCase("bg-BG")}`;

        const { error: uploadError } = await supabase
            .storage
            .from(BUCKETS.MAPS_MATERIALS)
            .upload(fileName, imageFile);

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return { success: false, error: uploadError };
        }

        const { data: publicURL } = supabase
            .storage
            .from(BUCKETS.MAPS_MATERIALS)
            .getPublicUrl(fileName);

        const imageUrl = publicURL.publicUrl;

        const { data, error } = await supabase
            .from(TABLES.MAPS)
            .insert([
                {
                    title,
                    imageUrl,
                    user_id: userId,
                },
            ])
            .select()
            .single();

        if (error) return { success: false, error };

        return { success: true, data };
    } catch (err) {
        console.error("Error creating map:", err);
        return { success: false, error: err };
    }
}
