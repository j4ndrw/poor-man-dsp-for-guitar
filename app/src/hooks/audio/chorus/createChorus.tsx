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

const grainSize = 256;

// Credit: https://github.com/cwilso/Audio-Input-Effects
function createChorus() {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const chorus = createMemo(() => store().Chorus.value);

    const chorusProcessor = microphone().context.createScriptProcessor(
        grainSize,
        1,
        1
    );

    createEffect(() => {
        if (!chorus()) {
            chorusProcessor.disconnect();
            return;
        }
        microphone().connect(chorusProcessor);
        chorusProcessor.connect(audioContext().destination);
    });

    createEffect(() => {
        if (!chorus()) {
            chorusProcessor.onaudioprocess = null;
            return;
        }

        const buffer = new Float32Array(grainSize * 2);
        const grainWindow = hanningWindow(grainSize);

        const pitchRatio = 1;
        const overlapRatio = 0.5;

        if (!chorusProcessor.onaudioprocess)
            chorusProcessor.onaudioprocess = (event) => {
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
}

export default createChorus;
