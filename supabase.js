
// Initialize Supabase Client
// Replace 'YOUR_SUPABASE_URL' and 'YOUR_SUPABASE_ANON_KEY' with actual credentials
const supabaseUrl = 'https://qcolaumpcswhasimahpx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjb2xhdW1wY3N3aGFzaW1haHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDUzMDEsImV4cCI6MjA4Njg4MTMwMX0.w2w2QjGfjhwBzMMYWzZoiAvTPRyo2XKDjEU9G82Bt4I';
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
