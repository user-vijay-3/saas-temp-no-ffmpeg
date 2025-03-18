import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useVideoUpload() {
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const handleVideoMetadata = useCallback((video: HTMLVideoElement) => {
    const aspectRatio = video.videoWidth / video.videoHeight;
    setIsPortrait(aspectRatio < 1);
  }, []);

  const uploadVideo = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 500 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a video file smaller than 500MB",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      try {
        // Create object URL immediately
        const url = URL.createObjectURL(file);

        // Create a new video element to check if the file is valid
        const video = document.createElement("video");
        video.preload = "metadata";

        const videoLoadPromise = new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            handleVideoMetadata(video);
            resolve(true);
          };
          video.onerror = () => reject(new Error("Invalid video file"));

          // Set timeout for 5 seconds
          setTimeout(() => reject(new Error("Video load timeout")), 5000);
        });

        video.src = url;

        await videoLoadPromise;
        setVideoUrl(url);

        toast({
          title: "Video uploaded successfully",
          description: "You can now start adding subtitles",
        });
      } catch (error) {
        console.error("Error uploading video:", error);
        toast({
          title: "Upload failed",
          description: "Please ensure you're uploading a valid video file",
          variant: "destructive",
        });

        // Clean up the URL if it was created
        if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
          setVideoUrl("");
        }
      } finally {
        setIsUploading(false);
        if (event.target) {
          event.target.value = "";
        }
      }
    },
    [toast, videoUrl, handleVideoMetadata],
  );

  return {
    videoUrl,
    setVideoUrl,
    isUploading,
    isPortrait,
    handleVideoMetadata,
    uploadVideo,
  };
}
