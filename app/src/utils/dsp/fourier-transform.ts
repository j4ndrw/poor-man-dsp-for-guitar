export class FourierTransform {
    protected bufferSize: number;
    protected sampleRate: number;
    protected bandwidth: number;

    protected spectrum: Float64Array;
    protected real: Float64Array;
    protected imag: Float64Array;

    protected peakBand: number = 0;
    protected peak: number = 0;

    constructor(bufferSize: number, sampleRate: number) {
        this.bufferSize = bufferSize;
        this.sampleRate = sampleRate;
        this.bandwidth = ((2 / bufferSize) * sampleRate) / 2;

        this.spectrum = new Float64Array(bufferSize / 2);
        this.real = new Float64Array(bufferSize);
        this.imag = new Float64Array(bufferSize);
    }

    getBandFrequency(index: number) {
        return this.bandwidth * index + this.bandwidth / 2;
    }

    calculateSpectrum() {
        const spectrum = this.spectrum;
        const real = this.real;
        const imag = this.imag;
        const bSi = 2 / this.bufferSize;
        let rval: number;
        let ival: number;
        let mag: number;

        for (let i = 0, N = this.bufferSize / 2; i < N; i++) {
            rval = real[i];
            ival = imag[i];
            mag = bSi * Math.sqrt(rval * rval + ival * ival);

            if (mag > this.peak) {
                this.peakBand = i;
                this.peak = mag;
            }

            spectrum[i] = mag;
        }
    }
}
