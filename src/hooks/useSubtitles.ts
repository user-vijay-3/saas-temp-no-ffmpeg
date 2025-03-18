import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { parseSRT, formatSRT } from "../utils/srtParser";
import {
  timeToMs,
  msToTime,
  calculateMidTime,
  incrementTime,
} from "../utils/timeUtils";
import { type Subtitle } from "../types";

export function useSubtitles(isPro: boolean) {
  const { toast } = useToast();
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitleId, setCurrentSubtitleId] = useState<number | null>(
    null,
  );
  const [wordsPerSubtitle, setWordsPerSubtitle] = useState<number>(1);
  const subtitleContainerRef = useRef<HTMLDivElement>(null);

  const handleImportSRT = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          try {
            const parsedSubtitles = parseSRT(content);
            setSubtitles(parsedSubtitles);
            toast({
              title: "SRT file imported successfully",
              description: `Loaded ${parsedSubtitles.length} subtitles`,
            });
          } catch (error) {
            toast({
              title: "Import failed",
              description: "Invalid SRT file format",
              variant: "destructive",
            });
          }
        }
      };
      reader.readAsText(file);
    },
    [toast],
  );

  const updateSubtitle = useCallback(
    (id: number, field: keyof Subtitle, value: string) => {
      setSubtitles((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub)),
      );
    },
    [],
  );

  const deleteSubtitle = useCallback(
    (id: number) => {
      setSubtitles((prev) => prev.filter((sub) => sub.id !== id));
      toast({
        title: "Subtitle deleted",
        description: "The subtitle has been removed",
      });
    },
    [toast],
  );

  const downloadSRT = useCallback(() => {
    const content = formatSRT(subtitles);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitles.srt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "SRT file downloaded",
      description: "Your subtitles have been exported successfully",
    });
  }, [subtitles, toast]);

  const addNewSubtitle = useCallback(
    (afterId: number) => {
      if (!isPro && subtitles.length >= 10) {
        toast({
          title: "Free plan limit reached",
          description: "Upgrade to Pro to add unlimited subtitles",
          variant: "destructive",
        });
        return;
      }

      setSubtitles((prev) => {
        const currentSubtitle = prev.find((s) => s.id === afterId);
        const newId = Math.max(...prev.map((s) => s.id), 0) + 1;
        const index = currentSubtitle
          ? prev.findIndex((s) => s.id === afterId) + 1
          : prev.length;

        const newSubtitle: Subtitle = {
          id: newId,
          startTime: currentSubtitle ? currentSubtitle.endTime : "00:00:00,000",
          endTime: currentSubtitle
            ? incrementTime(currentSubtitle.endTime, 2)
            : "00:00:02,000",
          text: "",
        };

        return [...prev.slice(0, index), newSubtitle, ...prev.slice(index)];
      });
    },
    [isPro, subtitles.length, toast],
  );

  const mergeSubtitles = useCallback(
    (id: number) => {
      if (!isPro) {
        toast({
          title: "Pro feature",
          description: "Upgrade to Pro to use advanced editing features",
          variant: "destructive",
        });
        return;
      }

      const currentSubtitle = subtitles.find((s) => s.id === id);
      if (!currentSubtitle) return;

      const index = subtitles.findIndex((s) => s.id === id);
      const prevSubtitle = index > 0 ? subtitles[index - 1] : null;
      const nextSubtitle =
        index < subtitles.length - 1 ? subtitles[index + 1] : null;

      const prevTimeDiff = prevSubtitle
        ? Math.abs(
            timeToMs(currentSubtitle.startTime) -
              timeToMs(prevSubtitle.endTime),
          )
        : Infinity;
      const nextTimeDiff = nextSubtitle
        ? Math.abs(
            timeToMs(nextSubtitle.startTime) -
              timeToMs(currentSubtitle.endTime),
          )
        : Infinity;

      if (prevTimeDiff < nextTimeDiff && prevSubtitle) {
        const mergedSubtitle: Subtitle = {
          id: prevSubtitle.id,
          startTime: prevSubtitle.startTime,
          endTime: currentSubtitle.endTime,
          text: `${prevSubtitle.text}\n${currentSubtitle.text}`,
        };
        setSubtitles((prev) => [
          ...prev.slice(0, index - 1),
          mergedSubtitle,
          ...prev.slice(index + 1),
        ]);
        toast({
          title: "Subtitles merged",
          description: "The selected subtitles have been combined",
        });
      } else if (nextSubtitle) {
        const mergedSubtitle: Subtitle = {
          id: currentSubtitle.id,
          startTime: currentSubtitle.startTime,
          endTime: nextSubtitle.endTime,
          text: `${currentSubtitle.text}\n${nextSubtitle.text}`,
        };
        setSubtitles((prev) => [
          ...prev.slice(0, index),
          mergedSubtitle,
          ...prev.slice(index + 2),
        ]);
        toast({
          title: "Subtitles merged",
          description: "The selected subtitles have been combined",
        });
      }
    },
    [isPro, subtitles, toast],
  );

  const splitSubtitle = useCallback(
    (id: number) => {
      if (!isPro) {
        toast({
          title: "Pro feature",
          description: "Upgrade to Pro to use advanced editing features",
          variant: "destructive",
        });
        return;
      }

      const subtitle = subtitles.find((s) => s.id === id);
      if (!subtitle) return;

      const midTime = calculateMidTime(subtitle.startTime, subtitle.endTime);
      const newId = Math.max(...subtitles.map((s) => s.id)) + 1;

      const textParts = subtitle.text.split(" ");
      const midIndex = Math.floor(textParts.length / 2);
      const firstText = textParts.slice(0, midIndex).join(" ");
      const secondText = textParts.slice(midIndex).join(" ");

      const firstHalf: Subtitle = {
        ...subtitle,
        endTime: midTime,
        text: firstText,
      };

      const secondHalf: Subtitle = {
        id: newId,
        startTime: midTime,
        endTime: subtitle.endTime,
        text: secondText,
      };

      const index = subtitles.findIndex((s) => s.id === id);

      setSubtitles((prev) => [
        ...prev.slice(0, index),
        firstHalf,
        secondHalf,
        ...prev.slice(index + 1),
      ]);

      toast({
        title: "Subtitle split",
        description: "The subtitle has been split into two parts",
      });
    },
    [isPro, subtitles, toast],
  );

  const handleTimeUpdate = useCallback(
    (time: number) => {
      const activeSubId =
        subtitles.find((sub) => {
          const startMs = timeToMs(sub.startTime) / 1000;
          const endMs = timeToMs(sub.endTime) / 1000;
          return time >= startMs && time <= endMs;
        })?.id || null;
      setCurrentSubtitleId(activeSubId);
    },
    [subtitles],
  );

  const handleReset = useCallback(() => {
    setSubtitles([]);
    toast({
      title: "Project reset",
      description: "All subtitles have been cleared",
    });
  }, [toast]);

  const handleSplitAllSubtitles = useCallback(() => {
    if (!isPro) {
      toast({
        title: "Pro feature",
        description: "Upgrade to Pro to use advanced editing features",
        variant: "destructive",
      });
      return;
    }

    setSubtitles((prev) => {
      const newSubtitles: Subtitle[] = [];
      let nextId = Math.max(...prev.map((s) => s.id)) + 1;

      prev.forEach((subtitle) => {
        const words = subtitle.text.trim().split(/\s+/);

        if (words.length <= wordsPerSubtitle) {
          // If subtitle has fewer words than the target, keep it as is
          newSubtitles.push(subtitle);
          return;
        }

        // Calculate time per word for even distribution
        const startTimeMs = timeToMs(subtitle.startTime);
        const endTimeMs = timeToMs(subtitle.endTime);
        const duration = endTimeMs - startTimeMs;

        // Split words into chunks of the specified size
        const chunks: string[] = [];
        for (let i = 0; i < words.length; i += wordsPerSubtitle) {
          chunks.push(
            words
              .slice(i, Math.min(i + wordsPerSubtitle, words.length))
              .join(" "),
          );
        }

        const timePerChunk = duration / chunks.length;

        // Create new subtitle for each chunk
        chunks.forEach((chunk, index) => {
          const chunkStartTime = startTimeMs + timePerChunk * index;
          const chunkEndTime = chunkStartTime + timePerChunk;

          newSubtitles.push({
            id: index === 0 ? subtitle.id : nextId++,
            text: chunk,
            startTime: msToTime(chunkStartTime),
            endTime: msToTime(chunkEndTime),
            style: subtitle.style, // Preserve any custom styles
          });
        });
      });

      toast({
        title: "Subtitles split successfully",
        description: `Split into ${wordsPerSubtitle} ${wordsPerSubtitle === 1 ? "word" : "words"} per subtitle`,
      });

      return newSubtitles;
    });
  }, [isPro, wordsPerSubtitle, toast]);

  return {
    subtitles,
    currentSubtitleId,
    wordsPerSubtitle,
    subtitleContainerRef,
    handleImportSRT,
    updateSubtitle,
    deleteSubtitle,
    downloadSRT,
    addNewSubtitle,
    mergeSubtitles,
    splitSubtitle,
    handleTimeUpdate,
    handleReset,
    handleSplitAllSubtitles,
    setWordsPerSubtitle,
  };
}
