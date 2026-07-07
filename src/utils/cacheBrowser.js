// imageCache.js
import { openDB } from "idb";

const dbPromise = openDB("image-cache", 1, {
    upgrade(db) {
        db.createObjectStore("images");
    },
});

export async function saveImage(id, blob) {
    const db = await dbPromise;
    await db.put("images", blob, id);
}

export async function getImage(id) {
    const db = await dbPromise;
    return await db.get("images", id);
}

export async function deleteImage(id) {
    const db = await dbPromise;
    return await db.delete("images", id);
}