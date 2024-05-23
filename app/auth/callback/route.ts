// pages/api/auth/callback.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { data: session, error } = await supabase.auth.exchangeCodeForSession(code);
    if (session.session) {
      const { user } = session;

      // Check if the user exists in the database
      const { data, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('uuid', user.id)
        .single();

      if (userError || !data) {
        // Redirect to setup component if user not found
        return NextResponse.redirect(`${requestUrl.origin}/setup`);
      }

      // Redirect to main app if user exists
      return NextResponse.redirect(`${requestUrl.origin}/`);
    }

    if (error) {
      return NextResponse.redirect(`${requestUrl.origin}/login?message=Authentication+failed`);
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
