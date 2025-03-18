import React, { useRef, useState, useEffect } from "react";
import { AlertCircle, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { type Subtitle } from "../types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  videoUrl: string;
  subtitles: Subtitle[];
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const aspectRatios = {
  "16:9": { width: 16, height: 9 },
  "9:16": { width: 9, height: 16 },
  "4:3": { width: 4, height: 3 },
};

export const VideoPlayer = React.memo(function VideoPlayer({
  videoUrl,
  subtitles,
  currentTime,
  onTimeUpdate,
  videoRef,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [error, setError] = useState<string | null>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  // Removed videoRect state as it's no longer needed for subtitle positioning

  // Handle video metadata loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const videoAspect = video.videoWidth / video.videoHeight;
      setDuration(video.duration);
      setError(null);

      // Set initial aspect ratio based on video dimensions
      if (videoAspect < 1) {
        setAspectRatio("9:16");
      } else if (videoAspect > 1.5) {
        setAspectRatio("16:9");
      } else {
        setAspectRatio("4:3");
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () =>
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, []);

  // Removed video dimensions resize effect as it's no longer needed for subtitle positioning

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onTimeUpdate(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => setError("Error playing video");

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("error", handleError);
    };
  }, [onTimeUpdate]);

  // Update current subtitle based on time
  useEffect(() => {
    const active = subtitles.find((sub) => {
      const start = timeToSeconds(sub.startTime);
      const end = timeToSeconds(sub.endTime);
      return currentTime >= start && currentTime <= end;
    });
    setCurrentSubtitle(active || null);
  }, [currentTime, subtitles]);

  const timeToSeconds = (timeStr: string): number => {
    const [time, ms] = timeStr.split(",");
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds + Number(ms) / 1000;
  };

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value[0];
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = value[0];
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Video Player</h2>
        <div className="flex items-center gap-2">
          {/* <span className="text-sm text-muted-foreground">Display Ratio:</span>  */}
          {Object.keys(aspectRatios).map((ratio) => (
            <Button
              key={ratio}
              variant={aspectRatio === ratio ? "default" : "outline"}
              size="sm"
              onClick={() => setAspectRatio(ratio)}
            >
              {ratio}
            </Button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative bg-black rounded-lg overflow-hidden"
        style={{
          aspectRatio: `${aspectRatios[aspectRatio].width}/${aspectRatios[aspectRatio].height}`,
          maxHeight: aspectRatio === "9:16" ? "72vh" : "none",
          margin: "0 auto",
          width: aspectRatio === "9:16" ? "auto" : "100%",
        }}
      >
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div ref={videoContainerRef} className="relative w-full h-full">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            crossOrigin="anonymous"
          />

          {currentSubtitle && (
            <div
              className="absolute left-1/2 bottom-[10%] -translate-x-1/2 max-w-[80%] text-xl leading-relaxed p-2 text-center text-white whitespace-pre-line break-words pointer-events-none"
              style={{ textShadow: "1px 1px 1px #000000" }}
            >
              {currentSubtitle.text}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    {isMuted ? (
                      <VolumeX className="h-3 w-3" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-16"
                  />
                </div>
              </div>
              <div className="text-xs text-white font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
