import dspConstants from "@/utils/dsp/constants";

export class Oscillator {
    private type: string;
    private frequency: number;
    private amplitude: number;
    private bufferSize: number;
    private sampleRate: number;
    private frameCount: number;

    private waveTableLength: number;

    private cyclesPerSample: number;

    private signal: Float64Array;
    private envelope: any;

    private waveFunc: (step: number) => number;

    private waveTable: Map<typeof this.waveFunc, Float64Array> = new Map<
        typeof this.waveFunc,
        Float64Array
    >();

    constructor(
        type: string,
        frequency: number,
        amplitude: number,
        bufferSize: number,
        sampleRate: number
    ) {
        this.type = type;
        this.frequency = frequency;
        this.amplitude = amplitude;
        this.bufferSize = bufferSize;
        this.sampleRate = sampleRate;
        this.frameCount = 0;

        this.waveTableLength = 2048;

        this.cyclesPerSample = frequency / sampleRate;

        this.signal = new Float64Array(bufferSize);
        this.envelope = null;

        switch (parseInt(type, 10)) {
            case dspConstants.waveforms.TRIANGLE:
                this.waveFunc = this.triangle;
                break;

            case dspConstants.waveforms.SAW:
                this.waveFunc = this.saw;
                break;

            case dspConstants.waveforms.SQUARE:
                this.waveFunc = this.square;
                break;

            default:
            case dspConstants.waveforms.SINE:
                this.waveFunc = this.sine;
                break;
        }

        this.generateWaveTable();
    }

    sine(step: number) {
        return Math.sin(dspConstants.math.TWO_PI * step);
    }
    square(step: number) {
        return step < 0.5 ? 1 : -1;
    }
    saw(step: number) {
        return 2 * (step - Math.round(step));
    }
    triangle(step: number) {
        return 1 - 4 * Math.abs(Math.round(step) - step);
    }

    generateWaveTable() {
        this.waveTable.set(
            this.waveFunc,
            new Float64Array(this.waveTableLength)
        );
        let waveTableTime = this.waveTableLength / this.sampleRate;
        let waveTableHz = 1 / waveTableTime;

        for (let i = 0; i < this.waveTableLength; i++) {
            this.waveTable.get(this.waveFunc)![i] = this.waveFunc(
                (i * waveTableHz) / this.sampleRate
            );
        }
    }

    setAmp(amplitude: number) {
        if (amplitude >= 0 && amplitude <= 1) {
            this.amplitude = amplitude;
        } else {
            throw "Amplitude out of range (0..1).";
        }
    }

    setFreq(frequency: number) {
        this.frequency = frequency;
        this.cyclesPerSample = frequency / this.sampleRate;
    }

    add(oscillator: Oscillator) {
        for (let i = 0; i < this.bufferSize; i++) {
            this.signal[i] += oscillator.signal[i];
        }

        return this.signal;
    }

    addSignal(signal: Float64Array) {
        for (let i = 0; i < signal.length; i++) {
            if (i >= this.bufferSize) {
                break;
            }
            this.signal[i] += signal[i];
        }
        return this.signal;
    }

    addEnvelope(envelope: any) {
        this.envelope = envelope;
    }

    applyEnvelope() {
        this.envelope.process(this.signal);
    }

    generate() {
        let frameOffset = this.frameCount * this.bufferSize;
        let step = (this.waveTableLength * this.frequency) / this.sampleRate;
        let offset;

        const waveform = this.waveTable.get(this.waveFunc);

        if (!waveform) return;

        for (let i = 0; i < this.bufferSize; i++) {
            offset = Math.round((frameOffset + i) * step);
            if (waveform) {
                this.signal[i] =
                    waveform[offset % this.waveTableLength] * this.amplitude;
            }
        }

        this.frameCount++;

        return this.signal;
    }
}
