import { supabase } from "@/lib/supabaseClient";
import { TABLES } from "@/utils/constants";
import { ROLES } from "@/utils/roles";

export async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;

        const userId = data.user.id;
        const res = await supabase.from(TABLES.PROFILES).select().eq("id", userId);

        if (res.error) throw res.error;

        await setSession(data.session.access_token, data.session.refresh_token);

        localStorage.setItem("user", JSON.stringify(res.data[0]));

        return { ...res.data[0], accessToken: data.session.access_token };
    } catch (err) {
        console.error("Грешка при вход:", err);
    }
}

async function setSession(access_token, refresh_token) {
    try {
        const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
}

export async function getSession() {
    try {
        const { data, error } = await supabase.auth.getSession();

        const user = await getCurrentUser(data.session.user.id);

        return user;
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
}

export async function getCurrentUser(user_id) {
    try {
        const { data, error } = await supabase
            .from(TABLES.PROFILES)
            .select('*')
            .eq('id', user_id);

        return data
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
}

export async function logoutUser(setUserData) {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }

        localStorage.clear();
        sessionStorage.clear();
        setUserData(null);

        return;
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
}

export async function finalizeUserSetup(password, userId) {
    // Validate password
    if (!password || password.length < 6) {
        throw new Error("Паролата трябва да съдържа минимум 6 символа");
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) throw new Error(updateError.message);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Не е намерен активен потребител");
    }

    // Try to insert, but if profile already exists, update it instead
    let data, error;
    
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
        .from(TABLES.PROFILES)
        .select("*")
        .eq("id", userId)
        .single();

    if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 means no rows found, which is expected
        throw new Error(checkError.message);
    }

    if (existingProfile) {
        // Profile exists, update it
        const { data: updatedData, error: updateProfileError } = await supabase
            .from(TABLES.PROFILES)
            .update({
                email: user.email,
                role: ROLES.TEACHER,
                lessons: existingProfile.lessons || []
            })
            .eq("id", userId)
            .select();

        if (updateProfileError) throw new Error(updateProfileError.message);
        data = updatedData;
    } else {
        // Profile doesn't exist, insert it
        const { data: insertedData, error: insertError } = await supabase
            .from(TABLES.PROFILES)
            .insert({
                id: userId,
                email: user.email,
                role: ROLES.TEACHER,
                lessons: []
            })
            .select();

        if (insertError) throw new Error(insertError.message);
        data = insertedData;
    }

    return data[0];
}

export async function requestTeacher(email) {
    try {
        const { data, error } = await supabase
            .from(TABLES.REQUESTS)
            .insert({ email });

        return data[0];
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
}

export async function getAllRequestedTeachers() {
    try {
        const { data, error } = await supabase
            .from(TABLES.REQUESTS)
            .select("*")
            .eq("status", "pending");
        return data;
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
}

export async function acceptOrDeclineRequest(email, status) {
    try {
        const { data, error } = await supabase
            .from(TABLES.REQUESTS)
            .update({ status })
            .eq('email', email);
        return data;
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
}

export async function getMaps() {
    try {
        const { data, error } = await supabase
            .from(TABLES.MAPS)
            .select("*")
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Error fetching maps:', err);
        return [];
    }
}

export async function deleteMap(id) {
    try {
        const { error } = await supabase
            .from(TABLES.MAPS)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (err) {
        console.error('Error deleting map:', err);
        return false;
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
