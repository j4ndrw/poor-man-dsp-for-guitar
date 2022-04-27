import { store } from "@/store/store";
import { createEffect, createMemo, onMount } from "solid-js";

// Credit:
//      https://stackoverflow.com/questions/30065093/web-audio-api-equalizer
//      https://stackoverflow.com/questions/29110380/web-audio-api-setting-treble-and-bass
//      https://github.com/cwilso/wubwubwub/blob/MixTrack/js/tracks.js#L189-L207

function createEqualizer({
    masterNode,
    otherNodes,
}: {
    masterNode: AudioNode;
    otherNodes: AudioNode[];
}) {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const filterGain = audioContext().createBiquadFilter();
    const lowsFilter = audioContext().createBiquadFilter();
    const midsFilter = audioContext().createBiquadFilter();
    const highsFilter = audioContext().createBiquadFilter();

    onMount(() => {
        // Connect microphone to the filters
        microphone().connect(lowsFilter);
        microphone().connect(midsFilter);
        microphone().connect(highsFilter);
        microphone().connect(filterGain);

        // Connect the master node and the other nodes to the filters
        [masterNode, ...otherNodes].forEach((node) => {
            node.connect(lowsFilter);
            node.connect(midsFilter);
            node.connect(highsFilter);
        });

        // Connect the filters to main audio context
        lowsFilter.connect(audioContext().destination);
        midsFilter.connect(audioContext().destination);
        highsFilter.connect(audioContext().destination);

        // Chain the filters:
        highsFilter.connect(midsFilter);
        midsFilter.connect(lowsFilter);
        lowsFilter.connect(filterGain);
    });

    createEffect(() => {
        lowsFilter.type = "lowshelf";
        midsFilter.type = "peaking";
        highsFilter.type = "highshelf";

        lowsFilter.frequency.value = 320.0 + store().Low.value;
        midsFilter.frequency.value = 1000.0 + store().Mid.value;
        highsFilter.frequency.value = 3200.0 + store().High.value;

        midsFilter.Q.value = 0.5;

        lowsFilter.gain.value = store().Low.value - 50;
        midsFilter.gain.value = store().Mid.value - 50;
        highsFilter.gain.value = store().High.value - 50;

        filterGain.gain.value = 0.5;
    });
}

export default createEqualizer;
