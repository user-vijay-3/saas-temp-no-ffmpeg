export function timeToMs(time: string): number {
    const [hours, minutes, seconds] = time.split(':');
    const [secs, ms] = seconds.split(',');
    return (
        parseInt(hours, 10) * 3600000 +
        parseInt(minutes, 10) * 60000 +
        parseInt(secs, 10) * 1000 +
        parseInt(ms, 10)
    );
}

export function msToTime(ms: number): string {
    const date = new Date(ms);
    const hh = date.getUTCHours().toString().padStart(2, '0');
    const mm = date.getUTCMinutes().toString().padStart(2, '0');
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    const mss = date.getUTCMilliseconds().toString().padStart(3, '0');
    return `${hh}:${mm}:${ss},${mss}`;
}

export function calculateMidTime(startTime: string, endTime: string): string {
    const startMs = timeToMs(startTime);
    const endMs = timeToMs(endTime);
    const midMs = (startMs + endMs) / 2;
    return msToTime(midMs);
}

export function incrementTime(time: string, seconds: number): string {
    const ms = timeToMs(time) + seconds * 1000;
    return msToTime(ms);
}

export function getWordCount(text: string): number {
    return text.trim().split(/\s+/).length;
}
