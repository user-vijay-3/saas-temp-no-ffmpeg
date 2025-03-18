import { useState } from "react";
import { SubtitleStyle } from "../types";

export function useSubtitleStyles() {
  const [subtitleStyles, setSubtitleStyles] = useState<
    Record<number, SubtitleStyle>
  >({});
  const [globalSubtitleStyle, setGlobalSubtitleStyle] = useState<SubtitleStyle>(
    {
      positionX: 50,
      positionY: 90,
      fontName: "Arial",
      fontSize: 24,
      primaryColor: "#FFFFFF",
      secondaryColor: "#000000",
      outlineColor: "#000000",
      backColor: "#000000",
      bold: false,
      italic: false,
      underline: false,
      strikeOut: false,
      scaleX: 100,
      scaleY: 100,
      spacing: 0,
      angle: 0,
      borderStyle: 1,
      outline: 2,
      shadow: 2,
      alignment: 2,
      marginL: 0,
      marginR: 0,
      marginV: 0,
      encoding: 1,
      primaryAlpha: 100,
      secondaryAlpha: 100,
      useBackColor: false,
    },
  );

  return {
    subtitleStyles,
    globalSubtitleStyle,
    setGlobalSubtitleStyle,
  };
}
