
// Initialize Supabase Client
// Replace 'YOUR_SUPABASE_URL' and 'YOUR_SUPABASE_ANON_KEY' with actual credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase Client Initialized");

// Example Fetch Function
async function getLeaderboard() {
    const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_points', { ascending: false });

    if (error) console.error('Error fetching leaderboard:', error);
    return data;
}
