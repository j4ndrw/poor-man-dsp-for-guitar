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
        equalizerNode().connect(lowsFilter());
        equalizerNode().connect(midsFilter());
        equalizerNode().connect(highsFilter());
    });

    createEffect(() => {
        lowsFilter().type = "lowshelf";
        midsFilter().type = "peaking";
        highsFilter().type = "highshelf";

        lowsFilter().frequency.value = 200 * (store().Low.value / 100);
        midsFilter().frequency.value = 2200 * (store().Mid.value / 100);
        highsFilter().frequency.value = 4000 * (store().High.value / 100);

        midsFilter().Q.value = Math.SQRT1_2;

        lowsFilter().gain.setTargetAtTime(
            store().Low.value / 10,
            microphone().context.currentTime,
            0.01
        );
        midsFilter().gain.setTargetAtTime(
            store().Mid.value / 10,
            microphone().context.currentTime,
            0.01
        );
        highsFilter().gain.setTargetAtTime(
            store().High.value / 10,
            microphone().context.currentTime,
            0.01
        );

        equalizerNode().gain.value = 0.5;
    });
    return { equalizerNode };
}

export default createEqualizer;
