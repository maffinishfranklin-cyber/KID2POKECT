// Supabase Client Configuration

// Initialize Supabase client
function initializeSupabase() {
    const supabaseUrl = 'SUPABASE_URL';
    const supabaseKey = 'SUPABASE_ANON_KEY';

    if (typeof supabase === 'undefined') {
        console.error('Supabase library not loaded');
        return null;
    }

    window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
    return window.supabaseClient;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSupabase();
});
