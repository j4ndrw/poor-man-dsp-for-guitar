export interface IAudioAPI {
    context: AudioContext;
    analyser: AnalyserNode;
    microphone: MediaStreamAudioSourceNode;
}
