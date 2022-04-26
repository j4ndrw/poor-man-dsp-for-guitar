import Amp from "@/components/amp/Amp";
import { Component, Match, onMount, Switch } from "solid-js";
import Status from "@/components/status/Status";
import { setStore, store } from "@/store/store";
import MicrophonePlayback from "@/components/audio/MicrophonePlayback";

const App: Component = () => {
    onMount(() => {
        navigator.mediaDevices.getUserMedia =
            navigator.mediaDevices.getUserMedia ||
            // @ts-ignore
            navigator.mediaDevices.webkitGetUserMedia ||
            // @ts-ignore
            navigator.mediaDevices.mozGetUserMedia ||
            // @ts-ignore
            navigator.mediaDevices.msGetUserMedia;
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            window.AudioContext =
                // @ts-ignore
                window.AudioContext || window.webkitAudioContext;

            const audioContext = new window.AudioContext();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            analyser.connect(audioContext.destination);
            setStore((state) => ({
                ...state,
                audio: {
                    analyser,
                    context: audioContext,
                    microphone,
                },
            }));
        });
    });

    return (
        <div class="flex flex-col justify-center items-center">
            <h1 class="m-16 text-center text-6xl select-none">
                Poor Man's DSP
            </h1>
            <Switch
                fallback={
                    <h1 class="text-4xl text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        Please connect your input (e.g. Microphone) and output
                        (e.g. Speaker) devices.
                    </h1>
                }
            >
                <Match when={store().audio !== null}>
                    <MicrophonePlayback />
                    <Amp />
                    <Status />
                </Match>
            </Switch>
        </div>
    );
};

export default App;
