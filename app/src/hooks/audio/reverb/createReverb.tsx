import { store } from "@/store/store";
import Reverb from "@logue/reverb";
import { createEffect, createMemo, onMount } from "solid-js";

// Credit:
//      https://github.com/logue/js/blob/master/src/ts
//      https://www.npmjs.com/package/@logue/reverb

const options = {
    noise: "brown", // Inpulse Response Noise algorithm (0: White noise, 1: Pink noise, 2: Brown noise)
    decay: 5, // Amount of IR (Inpulse Response) decay. 0~100
    delay: 0, // Delay time o IR. (NOT delay effect) 0~100 [sec]
    filterFreq: 2200, // Filter frequency. 20~5000 [Hz]
    filterQ: 1, // Filter quality. 0~10
    filterType: "lowpass", // Filter type. 'bandpass' etc. See https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type .
    mix: 0.5, // Dry (Original Sound) and Wet (Effected sound) raito. 0~1
    reverse: false, // Reverse IR.
    time: 3, // Time length of IR. 0~50 [sec]
};

const whiteNoise = () => Math.random() * 2 - 1;

function createReverb() {
    const audioContext = createMemo(() => store().audio!.context);
    const microphone = createMemo(() => store().audio!.microphone);

    const shouldReverb = createMemo(() => store().Reverb.value);

    const wetGainNode = createMemo(() => audioContext().createGain());
    const dryGainNode = createMemo(() => audioContext().createGain());
    const filterNode = createMemo(() => audioContext().createBiquadFilter());
    const convolverNode = createMemo(() => audioContext().createConvolver());
    const reverbNode = createMemo(() => audioContext().createGain());

    const rate = createMemo(() => audioContext().sampleRate);
    const duration = createMemo(() => Math.max(rate() * options.time, 1));
    const delayDuration = createMemo(() => rate() * options.delay);

    const impulseBufferNode = createMemo(() =>
        audioContext().createBuffer(2, duration(), rate())
    );

    createEffect(() => {
        if (!shouldReverb()) {
            reverbNode().gain.value = 0;
            return;
        }

        convolverNode().connect(filterNode()).connect(wetGainNode());
        microphone().connect(convolverNode()).connect(reverbNode());
        microphone().connect(dryGainNode()).connect(reverbNode());
        microphone().connect(wetGainNode()).connect(reverbNode());
    });

    createEffect(() => {
        if (!shouldReverb()) return;
        filterNode().frequency.value = options.filterFreq;
        filterNode().Q.value = options.filterQ;

        const impulseL: Float32Array = new Float32Array(duration());
        const impulseR: Float32Array = new Float32Array(duration());

        const b = [0, 0, 0, 0, 0, 0, 0];

        for (let i = 0; i < duration(); i++) {
            let n: number = 0;

            if (i < delayDuration()) {
                impulseL[i] = 0;
                impulseR[i] = 0;
                n = options.reverse
                    ? duration() - (i - delayDuration())
                    : i - delayDuration();
            } else {
                n = options.reverse ? duration() - i : i;
            }

            switch (options.noise) {
                case "pink":
                    b[0] = 0.99886 * b[0] + whiteNoise() * 0.0555179;
                    b[1] = 0.99332 * b[1] + whiteNoise() * 0.0750759;
                    b[2] = 0.969 * b[2] + whiteNoise() * 0.153852;
                    b[3] = 0.8665 * b[3] + whiteNoise() * 0.3104856;
                    b[4] = 0.55 * b[4] + whiteNoise() * 0.5329522;
                    b[5] = -0.7616 * b[5] - whiteNoise() * 0.016898;

                    impulseL[i] =
                        b[0] +
                        b[1] +
                        b[2] +
                        b[3] +
                        b[4] +
                        b[5] +
                        b[6] +
                        whiteNoise() * 0.5362;

                    impulseR[i] =
                        b[0] +
                        b[1] +
                        b[2] +
                        b[3] +
                        b[4] +
                        b[5] +
                        b[6] +
                        whiteNoise() * 0.5362;

                    impulseL[i] *= 0.11;
                    impulseR[i] *= 0.11;

                    b[6] = whiteNoise() * 0.115926;
                    break;
                case "brown":
                    impulseL[i] = (b[0] + 0.02 * whiteNoise()) / 1.02;
                    b[0] = impulseL[i];
                    impulseR[i] = (b[1] + 0.02 * whiteNoise()) / 1.02;
                    b[1] = impulseR[i];

                    impulseL[i] *= 3.5;
                    impulseR[i] *= 3.5;
                    break;
                case "white":
                default:
                    impulseL[i] = whiteNoise();
                    impulseR[i] = whiteNoise();
                    break;
            }
            impulseL[i] *= (1 - n / duration()) ** options.decay;
            impulseR[i] *= (1 - n / duration()) ** options.decay;
        }

        impulseBufferNode().getChannelData(0).set(impulseL);
        impulseBufferNode().getChannelData(1).set(impulseR);

        convolverNode().buffer = impulseBufferNode();

        dryGainNode().gain.value = (1 - options.mix) / 2;
        wetGainNode().gain.value = options.mix / 2;

        reverbNode().gain.value = 1;
    });

    return { reverbNode };
}

export default createReverb;
