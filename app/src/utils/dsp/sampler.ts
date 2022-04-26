import dspConstants from "@/utils/dsp/constants";
import { getChannel } from "@/utils/dsp/helpers";

export class Sampler {
    private audioRef: HTMLAudioElement;
    private bufferSize: number;
    private sampleRate: number;
    private playStart: number;
    private playEnd: number;
    private loopStart: number;
    private loopEnd: number;
    private loopMode: number;

    private loaded: boolean = false;
    private samples: number[] | Float64Array = [];

    private signal: Float64Array;
    private frameCount: number;
    private envelope: any;
    private amplitude: number;
    private rootFrequency: number;
    private frequency: number;
    private step: number;
    private duration: number;
    private samplesProcessed: number;
    private playhead: number;

    constructor(
        audioRef: HTMLAudioElement,
        bufferSize: number,
        sampleRate: number,
        playStart: number = 0,
        playEnd: number = 1,
        loopStart: number = 0,
        loopEnd: number = 1,
        loopMode: number = dspConstants.loopModes.OFF,
        rootFrequency: number = 110,
        frequency: number = 550
    ) {
        this.audioRef = audioRef;
        this.bufferSize = bufferSize;
        this.sampleRate = sampleRate;
        this.playStart = playStart;
        this.playEnd = playEnd;
        this.loopStart = loopStart;
        this.loopEnd = loopEnd;
        this.loopMode = loopMode;

        this.signal = new Float64Array(bufferSize);
        this.frameCount = 0;
        this.envelope = null;
        this.amplitude = 1;
        this.rootFrequency = rootFrequency; // A2 110
        this.frequency = frequency;
        this.step = frequency / rootFrequency;
        this.duration = 0;
        this.samplesProcessed = 0;
        this.playhead = 0;

        audioRef.addEventListener(
            "loadedmetadata",
            (event) => {
                this.loadSamples(event);
                this.loadMetadata();
                audioRef.play();
            },
            false
        );
        audioRef.addEventListener("ended", this.loadComplete, false);
    }

    loadSamples(event: any) {
        let buffer = getChannel(dspConstants.channels.MIX, event.frameBuffer);
        for (let i = 0; i < buffer.length; i++) {
            (this.samples as number[]).push(buffer[i]);
        }
    }

    loadComplete() {
        this.samples = new Float64Array(this.samplesProcessed);
        this.loaded = true;
    }

    loadMetadata() {
        this.duration = this.audioRef.duration;
    }

    applyEnvelope() {
        this.envelope.process(this.signal);
        return this.signal;
    }

    generate() {
        let loopWidth =
            this.playEnd * this.samples.length -
            this.playStart * this.samples.length;
        let playStartSamples = this.playStart * this.samples.length; // ie 0.5 -> 50% of the length
        let playEndSamples = this.playEnd * this.samples.length; // ie 0.5 -> 50% of the length

        for (let i = 0; i < this.bufferSize; i++) {
            switch (this.loopMode) {
                case dspConstants.loopModes.OFF:
                    this.playhead = Math.round(
                        this.samplesProcessed * this.step + playStartSamples
                    );
                    if (this.playhead < this.playEnd * this.samples.length) {
                        this.signal[i] =
                            this.samples[this.playhead] * this.amplitude;
                    } else {
                        this.signal[i] = 0;
                    }
                    break;

                case dspConstants.loopModes.FW:
                    this.playhead = Math.round(
                        ((this.samplesProcessed * this.step) % loopWidth) +
                            playStartSamples
                    );
                    if (this.playhead < this.playEnd * this.samples.length) {
                        this.signal[i] =
                            this.samples[this.playhead] * this.amplitude;
                    }
                    break;

                case dspConstants.loopModes.BW:
                    this.playhead =
                        playEndSamples -
                        Math.round(
                            (this.samplesProcessed * this.step) % loopWidth
                        );
                    if (this.playhead < this.playEnd * this.samples.length) {
                        this.signal[i] =
                            this.samples[this.playhead] * this.amplitude;
                    }
                    break;

                case dspConstants.loopModes.FWBW:
                    if (
                        Math.floor(
                            (this.samplesProcessed * this.step) / loopWidth
                        ) %
                            2 ===
                        0
                    ) {
                        this.playhead = Math.round(
                            ((this.samplesProcessed * this.step) % loopWidth) +
                                playStartSamples
                        );
                    } else {
                        this.playhead =
                            playEndSamples -
                            Math.round(
                                (this.samplesProcessed * this.step) % loopWidth
                            );
                    }
                    if (this.playhead < this.playEnd * this.samples.length) {
                        this.signal[i] =
                            this.samples[this.playhead] * this.amplitude;
                    }
                    break;
            }
            this.samplesProcessed++;
        }

        this.frameCount++;

        return this.signal;
    }

    setFreq(frequency: number) {
        let totalProcessed = this.samplesProcessed * this.step;
        this.frequency = frequency;
        this.step = this.frequency / this.rootFrequency;
        this.samplesProcessed = Math.round(totalProcessed / this.step);
    }

    reset() {
        this.samplesProcessed = 0;
        this.playhead = 0;
    }
}
