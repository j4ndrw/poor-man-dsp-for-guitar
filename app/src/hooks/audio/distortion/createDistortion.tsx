import { store } from "@/store/store";
import { createEffect, createMemo, onMount } from "solid-js";

// Credit: https://alexanderleon.medium.com/web-audio-series-part-2-designing-distortion-using-javascript-and-the-web-audio-api-446301565541
const makeDistortionCurve = (amount: number) => {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    let x;
    for (let i = 0; i < n_samples; ++i) {
        x = (i * 2) / n_samples - 1;
        curve[i] =
            ((3 + k) * Math.atan(Math.sinh(x * 0.25) * 5)) /
            (Math.PI + k * Math.abs(x));
    }
    return curve;
};

function createDistortion() {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const gainNode = createMemo(() => audioContext().createGain());
    const waveShaperNode = createMemo(() => audioContext().createWaveShaper());

    const distortion = createMemo(() => store().Distortion.value / 10);

    createEffect(() => {
        // Add noise gate
        microphone()
            .mediaStream.getAudioTracks()[0]
            .getConstraints().noiseSuppression = true;

        gainNode().connect(waveShaperNode());
    });

    createEffect(() => {
        if (distortion() === 0) {
            waveShaperNode().curve = null;
            gainNode().gain.value = 0;
            return;
        }
        gainNode().gain.value = 2;
        waveShaperNode().curve = makeDistortionCurve(500);
    });

    return { distortionNode: gainNode };
}

export default createDistortion;
