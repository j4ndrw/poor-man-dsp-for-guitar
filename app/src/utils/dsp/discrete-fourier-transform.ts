import { FourierTransform } from "@/utils/dsp/fourier-transform";
import dspConstants from "@/utils/dsp/constants";

export class DFT extends FourierTransform {
    private sinTable: Float64Array;
    private cosTable: Float64Array;

    constructor(bufferSize: number, sampleRate: number) {
        super(bufferSize, sampleRate);

        const N = (bufferSize / 2) * bufferSize;

        this.sinTable = new Float64Array(N);
        this.cosTable = new Float64Array(N);

        for (let i = 0; i < N; i++) {
            this.sinTable[i] = Math.sin(
                (i * dspConstants.math.TWO_PI) / bufferSize
            );
            this.cosTable[i] = Math.cos(
                (i * dspConstants.math.TWO_PI) / bufferSize
            );
        }
    }

    forward(buffer: Float64Array) {
        let real = this.real;
        let imag = this.imag;
        let rval: number;
        let ival: number;

        for (let k = 0; k < this.bufferSize / 2; k++) {
            rval = 0.0;
            ival = 0.0;

            for (let n = 0; n < buffer.length; n++) {
                rval += this.cosTable[k * n] * buffer[n];
                ival += this.sinTable[k * n] * buffer[n];
            }

            real[k] = rval;
            imag[k] = ival;
        }

        return this.calculateSpectrum();
    }
}
