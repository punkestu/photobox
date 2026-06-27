import imageCompression from "browser-image-compression";

export async function compressDataUrl(
    dataUrl,
    maxSizeMB = 3,
    maxWidthOrHeight = 1920
) {
    // Convert Data URL -> File
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const file = new File([blob], "image", {
        type: blob.type || "image/jpeg",
    });

    // Compress
    const compressedFile = await imageCompression(file, {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
        initialQuality: 1,
    });

    // Convert back to Data URL
    return imageCompression.getDataUrlFromFile(compressedFile);
}