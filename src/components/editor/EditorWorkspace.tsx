import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { VideoPlayer } from "../VideoPlayer";
import { type Subtitle } from "../../types";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const SubtitleEditor = React.lazy(() => import("../SubtitleEditor"));

interface EditorWorkspaceProps {
  videoUrl: string;
  subtitles: Subtitle[];
  currentTime: number;
  currentSubtitleId: number | null;
  isPortrait: boolean;
  wordsPerSubtitle: number;
  isPro: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  subtitleContainerRef: React.RefObject<HTMLDivElement>;
  onTimeUpdate: (time: number) => void;
  onImportSRT: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateSubtitle: (id: number, field: keyof Subtitle, value: string) => void;
  onAddSubtitle: (afterId: number) => void;
  onSplitSubtitle: (id: number) => void;
  onMergeSubtitle: (id: number) => void;
  onSplitAllSubtitles: () => void;
  onDeleteSubtitle: (id: number) => void;
  onDownloadSRT: () => void;
  onReset: () => void;
  setWordsPerSubtitle: (value: number) => void;
}

export function EditorWorkspace({
  videoUrl,
  subtitles,
  currentTime,
  currentSubtitleId,
  isPortrait,
  wordsPerSubtitle,
  isPro,
  fileInputRef,
  videoRef,
  subtitleContainerRef,
  onTimeUpdate,
  onImportSRT,
  onUpdateSubtitle,
  onAddSubtitle,
  onSplitSubtitle,
  onMergeSubtitle,
  onSplitAllSubtitles,
  onDeleteSubtitle,
  onDownloadSRT,
  onReset,
  setWordsPerSubtitle,
}: EditorWorkspaceProps) {
  return (
    <div className="rounded-xl overflow-hidden border bg-card shadow-lg">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70} minSize={50}>
          <div className="">
            <div className="h-full flex">
              <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
                <div
                  className={`video-wrapper ${isPortrait ? "portrait" : ""} shadow-2xl rounded-lg overflow-hidden border border-border/50`}
                >
                  <VideoPlayer
                    videoUrl={videoUrl}
                    subtitles={subtitles}
                    currentTime={currentTime}
                    onTimeUpdate={onTimeUpdate}
                    videoRef={videoRef}
                  />
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-border/50" />
        <ResizablePanel defaultSize={30} minSize={25}>
          <div className="h-[calc(100vh-8rem)] bg-gradient-to-b from-background to-muted/10">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="space-y-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Loading editor...
                    </p>
                  </div>
                </div>
              }
            >
              <SubtitleEditor
                subtitles={subtitles}
                currentSubtitleId={currentSubtitleId}
                onImportSRT={onImportSRT}
                onUpdateSubtitle={onUpdateSubtitle}
                onAddSubtitle={onAddSubtitle}
                onSplitSubtitle={onSplitSubtitle}
                onMergeSubtitle={onMergeSubtitle}
                onSplitAllSubtitles={onSplitAllSubtitles}
                onDeleteSubtitle={onDeleteSubtitle}
                onDownloadSRT={onDownloadSRT}
                onReset={onReset}
                wordsPerSubtitle={wordsPerSubtitle}
                setWordsPerSubtitle={setWordsPerSubtitle}
                fileInputRef={fileInputRef}
                isPro={isPro}
              />
            </Suspense>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
