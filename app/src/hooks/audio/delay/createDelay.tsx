import { store } from "@/store/store";
import { createEffect, createMemo, onMount } from "solid-js";

// Credit: https://github.com/Sambego/audio-effects/blob/master/src/audio-nodes/effects/Delay.ts

function createDelay() {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const delayGainNode = createMemo(() => audioContext().createGain());
    const wetGainNode = createMemo(() => audioContext().createGain());
    const durationGainNode = createMemo(() => audioContext().createGain());
    const delayNode = createMemo(() => audioContext().createDelay());

    const shouldDelay = createMemo(() => store().Delay.value);

    const wet = 1;
    const speed = createMemo(() => store().Delay.value / 100);
    const duration = 0.4;

    onMount(() => {
        microphone().connect(wetGainNode());
        microphone().connect(delayNode());

        durationGainNode().connect(delayNode());

        delayNode().connect(durationGainNode());

        delayNode().connect(delayGainNode());
        wetGainNode().connect(delayGainNode());
    });

    createEffect(() => {
        if (!shouldDelay()) {
            delayGainNode().gain.value = 0;
            wetGainNode().gain.value = 0;
            return;
        }

        delayGainNode().gain.value = wet;
        wetGainNode().gain.value = wet;
        delayNode().delayTime.value = speed();
        durationGainNode().gain.value = duration;
    });

    return { delayNode: delayGainNode };
}

export default createDelay;
