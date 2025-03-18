import React, { useState, useRef } from "react";
import {
  Clock,
  Download,
  Plus,
  GitMerge,
  Scissors,
  Upload,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { type Subtitle } from "../types";
import { formatSRT } from "../utils/srtParser";
import { getWordCount } from "../utils/timeUtils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SubtitleEditorProps {
  subtitles: Subtitle[];
  currentSubtitleId: number | null;
  onImportSRT: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateSubtitle: (id: number, field: keyof Subtitle, value: string) => void;
  onAddSubtitle: (afterId: number) => void;
  onSplitSubtitle: (id: number) => void;
  onMergeSubtitle: (id: number) => void;
  onSplitAllSubtitles: () => void;
  onDeleteSubtitle: (id: number) => void;
  onDownloadSRT: () => void;
  onReset: () => void;
  wordsPerSubtitle: number;
  setWordsPerSubtitle: (value: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isPro: boolean;
}

export default function SubtitleEditor({
  subtitles,
  currentSubtitleId,
  onImportSRT,
  onUpdateSubtitle,
  onAddSubtitle,
  onSplitSubtitle,
  onMergeSubtitle,
  onSplitAllSubtitles,
  onDeleteSubtitle,
  onDownloadSRT,
  onReset,
  wordsPerSubtitle,
  setWordsPerSubtitle,
  fileInputRef,
  isPro,
}: SubtitleEditorProps) {
  const [selectedSubtitles, setSelectedSubtitles] = useState<number[]>([]);
  const subtitleContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (currentSubtitleId !== null && isPro) {
      const subtitleElement = document.getElementById(
        `subtitle-${currentSubtitleId}`,
      );
      const container = subtitleContainerRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]",
      );

      if (subtitleElement && container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = subtitleElement.getBoundingClientRect();

        const scrollTop =
          subtitleElement.offsetTop -
          container.offsetTop -
          containerRect.height / 2 +
          elementRect.height / 2;

        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    }
  }, [currentSubtitleId, isPro]);

  const canSplitSubtitle = (text: string) => {
    return getWordCount(text) > 1;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-4">
          <input
            type="file"
            accept=".srt"
            onChange={(e) => {
              onImportSRT(e);
              setSelectedSubtitles([]);
            }}
            ref={fileInputRef}
            className="hidden"
          />
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Import SRT
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                onReset();
                setSelectedSubtitles([]);
              }}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>

            {subtitles.length > 0 && (
              <Button
                variant="outline"
                onClick={onDownloadSRT}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export SRT
              </Button>
            )}
          </div>
          {subtitles.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={wordsPerSubtitle.toString()}
                onValueChange={(value) => setWordsPerSubtitle(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Words per subtitle" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "word" : "words"} per subtitle
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={onSplitAllSubtitles}
                className="gap-2"
                disabled={!isPro}
              >
                <Scissors className="h-4 w-4" />
                Split All
                {!isPro && <span className="ml-1 text-xs">(Pro)</span>}
              </Button>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={subtitleContainerRef}>
        <div className="space-y-4">
          {subtitles.map((subtitle) => (
            <Card
              id={`subtitle-${subtitle.id}`}
              key={subtitle.id}
              className={cn(
                "p-4 transition-all duration-200 hover:shadow-md",
                currentSubtitleId === subtitle.id && "ring-2 ring-primary",
                selectedSubtitles.includes(subtitle.id) &&
                  "ring-2 ring-primary/50",
              )}
              onClick={() => {
                setSelectedSubtitles((prev) =>
                  prev.includes(subtitle.id)
                    ? prev.filter((id) => id !== subtitle.id)
                    : [...prev, subtitle.id],
                );
              }}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium">In</span>
                    <input
                      type="text"
                      value={subtitle.startTime}
                      onChange={(e) =>
                        onUpdateSubtitle(
                          subtitle.id,
                          "startTime",
                          e.target.value,
                        )
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span className="text-sm font-medium">Out</span>
                    <input
                      type="text"
                      value={subtitle.endTime}
                      onChange={(e) =>
                        onUpdateSubtitle(subtitle.id, "endTime", e.target.value)
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      {subtitle.endTime}
                    </span>
                  </div>
                </div>

                <textarea
                  value={subtitle.text}
                  onChange={(e) =>
                    onUpdateSubtitle(subtitle.id, "text", e.target.value)
                  }
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  rows={2}
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSubtitle(subtitle.id);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMergeSubtitle(subtitle.id);
                    }}
                    className="gap-2"
                    disabled={!isPro}
                  >
                    <GitMerge className="h-4 w-4" />
                    Merge
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSplitSubtitle(subtitle.id);
                    }}
                    disabled={!canSplitSubtitle(subtitle.text) || !isPro}
                    className="gap-2"
                  >
                    <Scissors className="h-4 w-4" />
                    Split
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSubtitle(subtitle.id);
                    }}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {selectedSubtitles.length >= 2 && (
        <div className="fixed bottom-4 right-4">
          <Button
            variant="default"
            size="lg"
            onClick={() => onMergeSubtitle(selectedSubtitles[0])}
            className="shadow-lg"
            disabled={!isPro}
          >
            <GitMerge className="mr-2 h-4 w-4" />
            Merge Selected
          </Button>
        </div>
      )}
    </div>
  );
}
