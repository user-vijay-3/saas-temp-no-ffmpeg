export interface Subtitle {
    id: number;
    startTime: string;
    endTime: string;
    text: string;
}

export function parseSRT(srtContent: string): Subtitle[] {
    return srtContent
        .trim()
        .split(/\n\n+/)
        .filter(block => block.trim())
        .map((block, index) => {
            const [, timeString, ...textLines] = block.split('\n');
            const [startTime, endTime] = timeString.split(' --> ');
            return {
                id: index + 1,
                startTime: startTime.trim(),
                endTime: endTime.trim(),
                text: textLines.join('\n').trim()
            };
        });
}

export function formatSRT(subtitles: Subtitle[]): string {
    return subtitles
        .map((sub, index) => {
            return `${index + 1}\n${sub.startTime} --> ${sub.endTime}\n${sub.text}\n`;
        })
        .join('\n');
}
