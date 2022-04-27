export const createAudioSource = (stream: MediaStream) => {
    window.AudioContext =
        // @ts-ignore
        window.AudioContext || window.webkitAudioContext;

    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    // @ts-ignore
    microphone.buffer = stream;

    microphone.connect(analyser);
    analyser.connect(audioContext.destination);

    return { audioContext, analyser, microphone };
};
