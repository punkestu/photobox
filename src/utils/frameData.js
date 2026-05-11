// import { createClient } from '@supabase/supabase-js';

export async function GetFrames() {
    const result = await fetch("https://raw.githubusercontent.com/punkestu/photobox-frames/refs/heads/main/frames-config", {
        cache: "no-cache"
    });
    const data = await result.text();
    const rows = data.split("\r\n").slice(1);

    const dataJson = rows.map((row) => {
        const columns = row.split(";");
        if (columns.length < 4) return null;
        return {
            id: columns[0],
            frame_url: columns[1],
            image_count: parseInt(columns[2]),
            positions: JSON.parse(columns[3]),
        }
    });

    return { data: dataJson.filter(data => data) };
}

// function useSupabase() {
// const supabase = createClient(import.meta.env.VITE_SUPABASE_FRAMES_URL, import.meta.env.VITE_SUPABASE_FRAMES_ANON_KEY);
// const { data, error } = await supabase.functions.invoke('get-frames', {
//     body: { name: 'Functions' },
// });

// if (error) {
//     alert("Failed to load frames");
// }

// return data;
// }