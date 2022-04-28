export const createAudioSource = (stream: MediaStream) => {
    window.AudioContext =
        // @ts-ignore
        window.AudioContext || window.webkitAudioContext;

    const audioContext = new window.AudioContext({
        latencyHint: 0.0001,
        sampleRate: 44100,
    });
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    return { audioContext, analyser, microphone };
};
