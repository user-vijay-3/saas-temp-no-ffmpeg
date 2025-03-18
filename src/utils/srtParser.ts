import { Subtitle } from "../types";

export function parseSRT(srtContent: string): Subtitle[] {
  try {
    return srtContent
      .trim()
      .split(/\n\n+/)
      .filter((block) => block.trim())
      .map((block, index) => {
        // Handle different SRT formats by checking for subtitle number
        const lines = block.split("\n");
        let timeString;
        let textLines;

        // Check if the first line is a number (subtitle index)
        if (/^\d+$/.test(lines[0].trim())) {
          timeString = lines[1];
          textLines = lines.slice(2);
        } else {
          // If no subtitle number, assume first line is the time
          timeString = lines[0];
          textLines = lines.slice(1);
        }

        // Extract start and end times
        const timeMatch = timeString.match(
          /(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/,
        );
        if (!timeMatch) {
          throw new Error(`Invalid time format in block: ${block}`);
        }

        const [, startTime, endTime] = timeMatch;

        return {
          id: index + 1,
          startTime: startTime.trim(),
          endTime: endTime.trim(),
          text: textLines.join("\n").trim(),
        };
      });
  } catch (error) {
    console.error("Error parsing SRT file:", error);
    throw error;
  }
}

export function formatSRT(subtitles: Subtitle[]): string {
  return subtitles
    .map((sub, index) => {
      return `${index + 1}\n${sub.startTime} --> ${sub.endTime}\n${sub.text}\n`;
    })
    .join("\n");
}
