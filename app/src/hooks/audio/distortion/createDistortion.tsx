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

    const distortionGainNode = audioContext().createGain();
    const distortionWaveShaperNode = audioContext().createWaveShaper();

    const shouldDistort = createMemo(() => store().Distortion.value);

    createEffect(() => {
        if (!shouldDistort()) {
            distortionGainNode.disconnect();
            distortionWaveShaperNode.disconnect();
            microphone()
                .mediaStream.getAudioTracks()[0]
                .getConstraints().noiseSuppression = false;
            return;
        }

        // Connect microphone to distortion gain node
        microphone().connect(distortionGainNode);

        // Connect distortion gain node to distortion wave shaper node
        distortionGainNode.connect(distortionWaveShaperNode);

        // Connect distortion wave shaper node to audio context
        distortionWaveShaperNode.connect(audioContext().destination);

        // Add noise gate
        microphone()
            .mediaStream.getAudioTracks()[0]
            .getConstraints().noiseSuppression = true;
    });

    createEffect(() => {
        if (!shouldDistort()) {
            distortionWaveShaperNode.curve = null;
            return;
        }
        distortionWaveShaperNode.curve = makeDistortionCurve(25);
    });

    return { distortionWaveShaperNode, distortionGainNode };
}

export default createDistortion;
