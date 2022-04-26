import { FourierTransform } from "@/utils/dsp/fourier-transform";

export class FFT extends FourierTransform {
    private reverseTable: Uint32Array;
    private sinTable: Float64Array;
    private cosTable: Float64Array;

    constructor(bufferSize: number, sampleRate: number) {
        super(bufferSize, sampleRate);

        this.reverseTable = new Uint32Array(bufferSize);

        let limit = 1;
        let bit = bufferSize >> 1;

        let i: number;
        while (limit < bufferSize) {
            for (i = 0; i < limit; i++) {
                this.reverseTable[i + limit] = this.reverseTable[i] + bit;
            }

            limit = limit << 1;
            bit = bit >> 1;
        }

        this.sinTable = new Float64Array(bufferSize);
        this.cosTable = new Float64Array(bufferSize);

        for (i = 0; i < bufferSize; i++) {
            this.sinTable[i] = Math.sin(-Math.PI / i);
            this.cosTable[i] = Math.cos(-Math.PI / i);
        }
    }

    forward(buffer: Float64Array) {
        // Locally scope letiables for speed up
        let bufferSize = this.bufferSize;
        let cosTable = this.cosTable;
        let sinTable = this.sinTable;
        let reverseTable = this.reverseTable;
        let real = this.real;
        let imag = this.imag;

        let k = Math.floor(Math.log(bufferSize) / Math.LN2);

        if (Math.pow(2, k) !== bufferSize) {
            throw "Invalid buffer size, must be a power of 2.";
        }
        if (bufferSize !== buffer.length) {
            throw (
                "Supplied buffer is not the same size as defined FFT. FFT Size: " +
                bufferSize +
                " Buffer Size: " +
                buffer.length
            );
        }

        let halfSize = 1;
        let phaseShiftStepReal: number;
        let phaseShiftStepImag: number;
        let currentPhaseShiftReal: number;
        let currentPhaseShiftImag: number;
        let off;
        let tr;
        let ti;
        let tmpReal;
        let i;

        for (i = 0; i < bufferSize; i++) {
            real[i] = buffer[reverseTable[i]];
            imag[i] = 0;
        }

        while (halfSize < bufferSize) {
            phaseShiftStepReal = cosTable[halfSize];
            phaseShiftStepImag = sinTable[halfSize];

            currentPhaseShiftReal = 1;
            currentPhaseShiftImag = 0;

            for (let fftStep = 0; fftStep < halfSize; fftStep++) {
                i = fftStep;

                while (i < bufferSize) {
                    off = i + halfSize;
                    tr =
                        currentPhaseShiftReal * real[off] -
                        currentPhaseShiftImag * imag[off];
                    ti =
                        currentPhaseShiftReal * imag[off] +
                        currentPhaseShiftImag * real[off];

                    real[off] = real[i] - tr;
                    imag[off] = imag[i] - ti;
                    real[i] += tr;
                    imag[i] += ti;

                    i += halfSize << 1;
                }

                tmpReal = currentPhaseShiftReal;
                currentPhaseShiftReal =
                    tmpReal * phaseShiftStepReal -
                    currentPhaseShiftImag * phaseShiftStepImag;
                currentPhaseShiftImag =
                    tmpReal * phaseShiftStepImag +
                    currentPhaseShiftImag * phaseShiftStepReal;
            }

            halfSize = halfSize << 1;
        }

        return this.calculateSpectrum();
    }

    inverse(real: Float64Array, imag: Float64Array) {
        // Locally scope letiables for speed up
        let bufferSize = this.bufferSize;
        let cosTable = this.cosTable;
        let sinTable = this.sinTable;
        let reverseTable = this.reverseTable;

        real = real || this.real;
        imag = imag || this.imag;

        let halfSize = 1;
        let phaseShiftStepReal: number;
        let phaseShiftStepImag: number;
        let currentPhaseShiftReal: number;
        let currentPhaseShiftImag: number;
        let off;
        let tr;
        let ti;
        let tmpReal;
        let i;

        for (i = 0; i < bufferSize; i++) {
            imag[i] *= -1;
        }

        let revReal = new Float64Array(bufferSize);
        let revImag = new Float64Array(bufferSize);

        for (i = 0; i < real.length; i++) {
            revReal[i] = real[reverseTable[i]];
            revImag[i] = imag[reverseTable[i]];
        }

        real = revReal;
        imag = revImag;

        while (halfSize < bufferSize) {
            phaseShiftStepReal = cosTable[halfSize];
            phaseShiftStepImag = sinTable[halfSize];
            currentPhaseShiftReal = 1;
            currentPhaseShiftImag = 0;

            for (let fftStep = 0; fftStep < halfSize; fftStep++) {
                i = fftStep;

                while (i < bufferSize) {
                    off = i + halfSize;
                    tr =
                        currentPhaseShiftReal * real[off] -
                        currentPhaseShiftImag * imag[off];
                    ti =
                        currentPhaseShiftReal * imag[off] +
                        currentPhaseShiftImag * real[off];

                    real[off] = real[i] - tr;
                    imag[off] = imag[i] - ti;
                    real[i] += tr;
                    imag[i] += ti;

                    i += halfSize << 1;
                }

                tmpReal = currentPhaseShiftReal;
                currentPhaseShiftReal =
                    tmpReal * phaseShiftStepReal -
                    currentPhaseShiftImag * phaseShiftStepImag;
                currentPhaseShiftImag =
                    tmpReal * phaseShiftStepImag +
                    currentPhaseShiftImag * phaseShiftStepReal;
            }

            halfSize = halfSize << 1;
        }

        let buffer = new Float64Array(bufferSize); // this should be reused instead
        for (i = 0; i < bufferSize; i++) {
            buffer[i] = real[i] / bufferSize;
        }

        return buffer;
    }
}
