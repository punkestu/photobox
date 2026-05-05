import { createClient } from '@supabase/supabase-js';

export async function GetFrames() {
    const supabase = createClient(import.meta.env.VITE_SUPABASE_FRAMES_URL, import.meta.env.VITE_SUPABASE_FRAMES_ANON_KEY);
    const { data, error } = await supabase.functions.invoke('get-frames', {
        body: { name: 'Functions' },
    });

    if (error) {
        alert("Failed to load frames");
    }

    return data;
}