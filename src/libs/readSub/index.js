import DT from 'duration-time-conversion';

import Sub from '../Sub';

export function url2sub(url) {
    return new Promise((resolve) => {
        const $video = document.createElement('video');
        const $track = document.createElement('track');
        $track.default = true;
        $track.kind = 'metadata';
        $video.appendChild($track);
        $track.onload = () => {
            resolve(
                Array.from($track.track.cues).map((item) => {
                    const start = DT.d2t(item.startTime);
                    const end = DT.d2t(item.endTime);
                    const text = item.text;
                    return new Sub({ start, end, text });
                }),
            );
        };
        $track.src = url;
    });
}

export function vtt2url(vtt) {
    return URL.createObjectURL(
        new Blob([vtt], {
            type: 'text/vtt',
        }),
    );
}

export function sub2vtt(sub) {
    return (
        'WEBVTT\n\n' +
        sub
            .map((item, index) => {
                return (
                    index +
                    1 +
                    '\n' +
                    item.start +
                    ' --> ' +
                    item.end +
                    ' ' +
                    'line:13 position:50% align:center size:80%' +
                    '\n' +
                    item.text
                );
            })
            .join('\n\n')
    );
}

export function sub2srt(sub) {
    return sub
        .map((item, index) => {
            return `${index + 1}\n${item.start.replace('.', ',')} --> ${item.end.replace('.', ',')}\n${item.text}`;
        })
        .join('\n\n');
}

export function sub2txt(sub) {
    return sub.map((item) => item.text).join('\n\n');
}
