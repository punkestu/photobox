const anchor_scale = 1040;
const anchor_frame_width = 1040;

export function renderImagesWithFrame(canvas, images, frame, positions, scaledown = true) {
    const ctx = canvas.getContext("2d");

    const frameRatio = frame.height / frame.width;
    const frameW = scaledown ? anchor_frame_width : frame.width;
    const frameH = frameW * frameRatio;

    const scale = scaledown ? canvas.width / frameW : 1;
    canvas.width = frameW * scale;
    canvas.height = frameH * scale;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    images.forEach((img, i) => {
        if (!positions[i]) return;
        const x = (positions[i].x ?? 0) / anchor_scale * frameW;
        const y = (positions[i].y ?? i * 720) / anchor_scale * frameH;
        const w = (positions[i].w ?? 720) / anchor_scale * frameW;
        const h = (positions[i].h ?? 720) / anchor_scale * frameH;
        drawImageCover(ctx, img, x * scale, y * scale, w * scale, h * scale);
    });
    drawImageCover(ctx, frame, 0 * scale, 0 * scale, frameW * scale, frameH * scale);
}

function drawImageCover(ctx, img, x, y, width, height) {
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let sx, sy, sWidth, sHeight;

    if (imgRatio > canvasRatio) {
        // gambar lebih lebar → crop kiri kanan
        sHeight = img.height;
        sWidth = img.height * canvasRatio;
        sx = (img.width - sWidth) / 2;
        sy = 0;
    } else {
        // gambar lebih tinggi → crop atas bawah
        sWidth = img.width;
        sHeight = img.width / canvasRatio;
        sx = 0;
        sy = (img.height - sHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);
}