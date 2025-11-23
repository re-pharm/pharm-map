export const sbHeader = {
    headers: {
        "apikey": `${process.env.SUPABASE_ANON_PUBLIC_KEY}`,
        "Authorization": `Bearer ${process.env.SUPABASE_ANON_PUBLIC_KEY}`
    }
}