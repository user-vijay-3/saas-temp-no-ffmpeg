import React, { useState, useRef } from "react";
import { AppHeader } from "./components/layout/AppHeader";
import { WelcomeScreen } from "./components/landing/WelcomeScreen";
import { EditorWorkspace } from "./components/editor/EditorWorkspace";
import { useVideoUpload } from "./hooks/useVideoUpload";
import { useSubtitles } from "./hooks/useSubtitles";
import { useSubtitleStyles } from "./hooks/useSubtitleStyles";

function Home() {
  // State for pro mode toggle
  const [isPro, setIsPro] = useState(false);

  // Video upload and playback state
  const { videoUrl, isUploading, isPortrait, uploadVideo } = useVideoUpload();

  // Video player reference
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current video playback time
  const [currentTime, setCurrentTime] = useState(0);

  // Subtitle state and handlers
  const {
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
  } = useSubtitles(isPro);

  // Subtitle styling
  const { globalSubtitleStyle, setGlobalSubtitleStyle } = useSubtitleStyles();

  // Handle time updates from video player
  const onTimeUpdate = (time: number) => {
    setCurrentTime(time);
    handleTimeUpdate(time);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader isPro={isPro} setIsPro={setIsPro} />

      <main className="container mx-auto px-1 py-1">
        {!videoUrl ? (
          <WelcomeScreen
            isUploading={isUploading}
            isPro={isPro}
            fileInputRef={fileInputRef}
          />
        ) : (
          <EditorWorkspace
            videoUrl={videoUrl}
            subtitles={subtitles}
            currentTime={currentTime}
            currentSubtitleId={currentSubtitleId}
            isPortrait={isPortrait}
            globalSubtitleStyle={globalSubtitleStyle}
            wordsPerSubtitle={wordsPerSubtitle}
            isPro={isPro}
            fileInputRef={fileInputRef}
            videoRef={videoRef}
            subtitleContainerRef={subtitleContainerRef}
            onTimeUpdate={onTimeUpdate}
            onImportSRT={handleImportSRT}
            onUpdateSubtitle={updateSubtitle}
            onAddSubtitle={addNewSubtitle}
            onSplitSubtitle={splitSubtitle}
            onMergeSubtitle={mergeSubtitles}
            onSplitAllSubtitles={handleSplitAllSubtitles}
            onDeleteSubtitle={deleteSubtitle}
            onDownloadSRT={downloadSRT}
            onReset={handleReset}
            setWordsPerSubtitle={setWordsPerSubtitle}
            onUpdateStyle={setGlobalSubtitleStyle}
          />
        )}
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={uploadVideo}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}

export default Home;
