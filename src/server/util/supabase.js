const { createClient } = require("@supabase/supabase-js");

const getSupabaseClient = async (token) => {
  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    }
  );

  if (token) {
    const { refresh_token, access_token } = token;
    const res = await supabaseClient.auth.setSession({
      refresh_token,
      access_token,
    });

    if (res.error) {
      return null;
    }
  }

  return supabaseClient;
};

module.exports = {
  getSupabaseClient,
};
