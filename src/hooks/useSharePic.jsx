import { useCallback } from "react";

export function useShareImage(apiKey) {
  return useCallback(
    async (fileId, fileName) => {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`,
      );

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();

      const file = new File([blob], fileName, {
        type: blob.type,
      });

      if (!navigator.canShare?.({ files: [file] })) {
        throw new Error("Sharing not supported");
      }

      await navigator.share({
        files: [file],
        title: fileName,
      });
    },
    [apiKey],
  );
}
