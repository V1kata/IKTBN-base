import { supabase } from "@/lib/supabaseClient";
import { TABLES, BUCKETS } from "@/utils/constants";

export async function getAllPersonalities() {
    try {
        const { data, error } = await supabase
            .from(TABLES.HISTORICAL_FIGURES)
            .select('*')
            .order('birth_year', { ascending: true });

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Error fetching personalities:', err);
        return [];
    }
}

export async function getPersonalityById(id) {
    try {
        const { data, error } = await supabase
            .from(TABLES.HISTORICAL_FIGURES)
            .select('*')
            .eq('id', id);

        if (error) throw error;
        return data[0];
    } catch (err) {
        console.error('Error fetching personality:', err);
        return null;
    }
}

export async function createPersonality(personalityData) {
    try {
        const { data, error } = await supabase
            .from(TABLES.HISTORICAL_FIGURES)
            .insert([personalityData])
            .select();

        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (err) {
        console.error('Error creating personality:', err);
        return { success: false, error: err.message };
    }
}

export async function updatePersonality(id, updates) {
    try {
        const { data, error } = await supabase
            .from(TABLES.HISTORICAL_FIGURES)
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (err) {
        console.error('Error updating personality:', err);
        return { success: false, error: err.message };
    }
}

export async function deletePersonality(id) {
    try {
        const { error } = await supabase
            .from(TABLES.HISTORICAL_FIGURES)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (err) {
        console.error('Error deleting personality:', err);
        return { success: false, error: err.message };
    }
}
