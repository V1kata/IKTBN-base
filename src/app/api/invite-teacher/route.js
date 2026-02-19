"use server";

import { supabaseAdmin } from "@/lib/supabaseAdminClient";
import { TABLES } from "@/utils/constants";

const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL || "https://iktbn.vercel.app/auth/set-password";

export async function POST(req) {
    try {
        const { email, action } = await req.json();

        if (!email || !action) {
            return new Response(
                JSON.stringify({ error: "Email и action са задължителни" }),
                { status: 400 }
            );
        }

        // Update the request status in the database
        const { data: updateData, error: updateError } = await supabaseAdmin
            .from(TABLES.REQUESTS)
            .update({ status: action === "accepted" ? "accepted" : "declined" })
            .eq("email", email)
            .select();

        if (updateError) {
            console.error("Database update error:", updateError);
            return new Response(
                JSON.stringify({ error: "Грешка при обновяване на базата" }),
                { status: 500 }
            );
        }

        if (!updateData || updateData.length === 0) {
            return new Response(
                JSON.stringify({ error: "Заявката не е намерена" }),
                { status: 404 }
            );
        }

        if (action === "accepted") {
            // Send invitation email via Supabase Auth
            const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                redirectTo: REDIRECT_URL
            });

            if (inviteError) {
                // Revert the status update if email sending fails
                await supabaseAdmin
                    .from(TABLES.REQUESTS)
                    .update({ status: "pending" })
                    .eq("email", email);

                console.error("Invite email error:", inviteError);
                return new Response(
                    JSON.stringify({ error: `Грешка при изпращане на имейл: ${inviteError.message}` }),
                    { status: 500 }
                );
            }

            return new Response(
                JSON.stringify({ 
                    success: true, 
                    message: `Покана изпратена на ${email}`,
                    userId: inviteData?.user?.id 
                }),
                { status: 200 }
            );
        }

        // For declined requests
        return new Response(
            JSON.stringify({ 
                success: true, 
                message: `Заявката на ${email} е отхвърлена` 
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Unexpected error:", error);
        return new Response(
            JSON.stringify({ error: "Неочаквана грешка" }),
            { status: 500 }
        );
    }
}
