import React from "react";
import { Upload, Loader2, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  isUploading: boolean;
  isPro: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function WelcomeScreen({
  isUploading,
  isPro,
  fileInputRef,
}: WelcomeScreenProps) {
  return (
    <div className="text-center space-y-8 mb-16 py-16">
      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full text-amber-700 text-sm font-medium mb-4 shadow-sm">
        <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
        Professional Subtitle Editor
      </div>
      <div className="space-y-4 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text leading-tight">
          Create Perfect Subtitles
        </h1>
        <p className="text-xl text-muted-foreground">
          Professional-grade subtitle editing for your videos.
          <br />
          Start by uploading your video.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
        <Button
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              <span>Upload Video</span>
            </>
          )}
        </Button>
        {!isPro && (
          <Button
            variant="outline"
            size="lg"
            className="border-orange-200 hover:bg-orange-50 min-w-[200px]"
          >
            <Crown className="mr-2 h-5 w-5 text-amber-500" />
            View Pro Features
          </Button>
        )}
      </div>
    </div>
  );
}
