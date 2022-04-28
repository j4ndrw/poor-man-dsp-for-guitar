import { store } from "@/store/store";
import { Accessor, createEffect, createMemo, onMount } from "solid-js";

// Credit:
//      https://stackoverflow.com/questions/30065093/web-audio-api-equalizer
//      https://stackoverflow.com/questions/29110380/web-audio-api-setting-treble-and-bass
//      https://github.com/cwilso/wubwubwub/blob/MixTrack/js/tracks.js#L189-L207

function createEqualizer() {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const equalizerNode = createMemo(() => audioContext().createGain());
    const lowsFilter = createMemo(() => audioContext().createBiquadFilter());
    const midsFilter = createMemo(() => audioContext().createBiquadFilter());
    const highsFilter = createMemo(() => audioContext().createBiquadFilter());

    onMount(() => {
        highsFilter().connect(midsFilter()).connect(lowsFilter());
        microphone().connect(lowsFilter()).connect(equalizerNode());
        microphone().connect(midsFilter()).connect(equalizerNode());
        microphone().connect(highsFilter()).connect(equalizerNode());
    });

    createEffect(() => {
        lowsFilter().type = "lowshelf";
        midsFilter().type = "peaking";
        highsFilter().type = "highshelf";

        lowsFilter().frequency.value = 320 + store().Low.value;
        midsFilter().frequency.value = 1000 + store().Mid.value;
        highsFilter().frequency.value = 3200 + store().High.value;

        midsFilter().Q.value = 0.5;

        lowsFilter().gain.value = store().Low.value - 50;
        midsFilter().gain.value = store().Mid.value - 50;
        highsFilter().gain.value = store().High.value - 50;

        equalizerNode().gain.value = 0.01 + store().Distortion.value / 50;
    });
    return { equalizerNode };
}

export default createEqualizer;
