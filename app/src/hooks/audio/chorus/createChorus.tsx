import { store } from "@/store/store";
import { createEffect, createMemo, onMount } from "solid-js";

const hanningWindow = (length: number) => {
    const window = new Float32Array(length);
    for (let i = 0; i < length; i++) {
        window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (length - 1)));
    }
    return window;
};
const linearInterpolation = (a: number, b: number, t: number) =>
    a + (b - a) * t;

const grainSize = 1024;

// Credit: https://github.com/urtzurd/html-audio/blob/gh-pages/static/js/pitch-shifter.js
function createChorus({ masterNode }: { masterNode: AudioNode }) {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const chorus = createMemo(() => store().Chorus.value);

    const chorusNode = microphone().context.createScriptProcessor(
        grainSize,
        1,
        1
    );

    createEffect(() => {
        if (!chorus()) {
            chorusNode.disconnect();
            return;
        }
        microphone().connect(masterNode);
        masterNode.connect(chorusNode);
        chorusNode.connect(audioContext().destination);
    });

    createEffect(() => {
        if (!chorus()) {
            chorusNode.onaudioprocess = null;
            return;
        }

        const buffer = new Float32Array(grainSize * 2);
        const grainWindow = hanningWindow(grainSize);

        const pitchRatio = 8;
        const overlapRatio = 2;

        if (!chorusNode.onaudioprocess)
            chorusNode.onaudioprocess = (event) => {
                let inputData = event.inputBuffer.getChannelData(0);
                let outputData = event.outputBuffer.getChannelData(0);

                for (let i = 0; i < inputData.length; i++) {
                    inputData[i] *= grainWindow[i];
                    buffer[i] = buffer[i + grainSize];
                    buffer[i + grainSize] = 0.0;
                }

                let grainData = new Float32Array(grainSize * 2);
                for (let i = 0, j = 0.0; i < grainSize; i++, j += pitchRatio) {
                    const index = Math.floor(j) % grainSize;
                    const a = inputData[index];
                    const b = inputData[(index + 1) % grainSize];
                    grainData[i] +=
                        linearInterpolation(a, b, j % pitchRatio) *
                        grainWindow[i];
                }

                for (
                    let i = 0;
                    i < grainSize;
                    i += Math.round(grainSize * overlapRatio)
                ) {
                    for (let j = 0; j <= grainSize; j++) {
                        buffer[i + j] += grainData[j];
                    }
                }

                for (let i = 0, j = 0.0; i < grainSize; i++, j += pitchRatio) {
                    const index = Math.floor(j) % grainSize;
                    const a = inputData[index];
                    const b = inputData[(index + 1) % grainSize];
                    grainData[i] =
                        linearInterpolation(a, b, j % pitchRatio) *
                        grainWindow[i];
                }

                outputData.set(
                    inputData.map(
                        (sample) => sample * (store().Gain.value / 7 || 1)
                    )
                );
            };
    });
    return { chorusNode };
}

export default createChorus;
