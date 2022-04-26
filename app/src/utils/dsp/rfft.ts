import { FourierTransform } from "@/utils/dsp/fourier-transform";

import dspConstants from "@/utils/dsp/constants";

export class RFFT extends FourierTransform {
    private trans: Float64Array;
    private reverseTable: Uint32Array;

    constructor(bufferSize: number, sampleRate: number) {
        super(bufferSize, sampleRate);

        this.trans = new Float64Array(bufferSize);
        this.reverseTable = new Uint32Array(bufferSize);
        this.generateReverseTable();
    }

    reverseBinPermute(dest: Float64Array, source: Float64Array) {
        let bufferSize = this.bufferSize;
        let halfSize = bufferSize >>> 1;
        let nm1 = bufferSize - 1;
        let i = 1;
        let r = 0;
        let h: number;

        dest[0] = source[0];

        do {
            r += halfSize;
            dest[i] = source[r];
            dest[r] = source[i];

            i++;

            h = halfSize << 1;
            while (((h = h >> 1), !((r ^= h) & h)));

            if (r >= i) {
                dest[i] = source[r];
                dest[r] = source[i];

                dest[nm1 - i] = source[nm1 - r];
                dest[nm1 - r] = source[nm1 - i];
            }
            i++;
        } while (i < halfSize);
        dest[nm1] = source[nm1];
    }

    generateReverseTable() {
        let bufferSize = this.bufferSize;
        let halfSize = bufferSize >>> 1;
        let nm1 = bufferSize - 1;
        let i = 1;
        let r = 0;
        let h: number;

        this.reverseTable[0] = 0;

        do {
            r += halfSize;

            this.reverseTable[i] = r;
            this.reverseTable[r] = i;

            i++;

            h = halfSize << 1;
            while (((h = h >> 1), !((r ^= h) & h)));

            if (r >= i) {
                this.reverseTable[i] = r;
                this.reverseTable[r] = i;

                this.reverseTable[nm1 - i] = nm1 - r;
                this.reverseTable[nm1 - r] = nm1 - i;
            }
            i++;
        } while (i < halfSize);

        this.reverseTable[nm1] = nm1;
    }

    // Ordering of output:
    //
    // trans[0]     = re[0] (==zero frequency, purely real)
    // trans[1]     = re[1]
    //             ...
    // trans[n/2-1] = re[n/2-1]
    // trans[n/2]   = re[n/2]    (==nyquist frequency, purely real)
    //
    // trans[n/2+1] = im[n/2-1]
    // trans[n/2+2] = im[n/2-2]
    //             ...
    // trans[n-1]   = im[1]

    forward(buffer: Float64Array) {
        let n = this.bufferSize;
        let spectrum = this.spectrum;
        let x = this.trans;
        let i = n >>> 1;
        let bSi = 2 / n;
        let n2: number;
        let n4: number;
        let n8: number;
        let nn: number;
        let t1: number;
        let t2: number;
        let t3: number;
        let t4: number;
        let i1: number;
        let i2: number;
        let i3: number;
        let i4: number;
        let i5: number;
        let i6: number;
        let i7: number;
        let i8: number;
        let st1: number;
        let cc1: number;
        let ss1: number;
        let cc3: number;
        let ss3: number;
        let e: number;
        let a: number;
        let rval: number;
        let ival: number;
        let mag: number;
        let ix: number;
        let id: number;
        let i0: number;

        this.reverseBinPermute(x, buffer);

        for (ix = 0, id = 4; ix < n; id *= 4) {
            for (let i0 = ix; i0 < n; i0 += id) {
                //sumdiff(x[i0], x[i0+1]); // {a, b}  <--| {a+b, a-b}
                st1 = x[i0] - x[i0 + 1];
                x[i0] += x[i0 + 1];
                x[i0 + 1] = st1;
            }
            ix = 2 * (id - 1);
        }

        n2 = 2;
        nn = n >>> 1;

        while ((nn = nn >>> 1)) {
            ix = 0;
            n2 = n2 << 1;
            id = n2 << 1;
            n4 = n2 >>> 2;
            n8 = n2 >>> 3;
            do {
                if (n4 !== 1) {
                    for (i0 = ix; i0 < n; i0 += id) {
                        i1 = i0;
                        i2 = i1 + n4;
                        i3 = i2 + n4;
                        i4 = i3 + n4;

                        //diffsum3_r(x[i3], x[i4], t1); // {a, b, s} <--| {a, b-a, a+b}
                        t1 = x[i3] + x[i4];
                        x[i4] -= x[i3];
                        //sumdiff3(x[i1], t1, x[i3]);   // {a, b, d} <--| {a+b, b, a-b}
                        x[i3] = x[i1] - t1;
                        x[i1] += t1;

                        i1 += n8;
                        i2 += n8;
                        i3 += n8;
                        i4 += n8;

                        //sumdiff(x[i3], x[i4], t1, t2); // {s, d}  <--| {a+b, a-b}
                        t1 = x[i3] + x[i4];
                        t2 = x[i3] - x[i4];

                        t1 = -t1 * Math.SQRT1_2;
                        t2 *= Math.SQRT1_2;

                        // sumdiff(t1, x[i2], x[i4], x[i3]); // {s, d}  <--| {a+b, a-b}
                        st1 = x[i2];
                        x[i4] = t1 + st1;
                        x[i3] = t1 - st1;

                        //sumdiff3(x[i1], t2, x[i2]); // {a, b, d} <--| {a+b, b, a-b}
                        x[i2] = x[i1] - t2;
                        x[i1] += t2;
                    }
                } else {
                    for (i0 = ix; i0 < n; i0 += id) {
                        i1 = i0;
                        i2 = i1 + n4;
                        i3 = i2 + n4;
                        i4 = i3 + n4;

                        //diffsum3_r(x[i3], x[i4], t1); // {a, b, s} <--| {a, b-a, a+b}
                        t1 = x[i3] + x[i4];
                        x[i4] -= x[i3];

                        //sumdiff3(x[i1], t1, x[i3]);   // {a, b, d} <--| {a+b, b, a-b}
                        x[i3] = x[i1] - t1;
                        x[i1] += t1;
                    }
                }

                ix = (id << 1) - n2;
                id = id << 2;
            } while (ix < n);

            e = dspConstants.math.TWO_PI / n2;

            for (let j = 1; j < n8; j++) {
                a = j * e;
                ss1 = Math.sin(a);
                cc1 = Math.cos(a);

                //ss3 = sin(3*a); cc3 = cos(3*a);
                cc3 = 4 * cc1 * (cc1 * cc1 - 0.75);
                ss3 = 4 * ss1 * (0.75 - ss1 * ss1);

                ix = 0;
                id = n2 << 1;
                do {
                    for (i0 = ix; i0 < n; i0 += id) {
                        i1 = i0 + j;
                        i2 = i1 + n4;
                        i3 = i2 + n4;
                        i4 = i3 + n4;

                        i5 = i0 + n4 - j;
                        i6 = i5 + n4;
                        i7 = i6 + n4;
                        i8 = i7 + n4;

                        //cmult(c, s, x, y, &u, &v)
                        //cmult(cc1, ss1, x[i7], x[i3], t2, t1); // {u,v} <--| {x*c-y*s, x*s+y*c}
                        t2 = x[i7] * cc1 - x[i3] * ss1;
                        t1 = x[i7] * ss1 + x[i3] * cc1;

                        //cmult(cc3, ss3, x[i8], x[i4], t4, t3);
                        t4 = x[i8] * cc3 - x[i4] * ss3;
                        t3 = x[i8] * ss3 + x[i4] * cc3;

                        //sumdiff(t2, t4);   // {a, b} <--| {a+b, a-b}
                        st1 = t2 - t4;
                        t2 += t4;
                        t4 = st1;

                        //sumdiff(t2, x[i6], x[i8], x[i3]); // {s, d}  <--| {a+b, a-b}
                        //st1 = x[i6]; x[i8] = t2 + st1; x[i3] = t2 - st1;
                        x[i8] = t2 + x[i6];
                        x[i3] = t2 - x[i6];

                        //sumdiff_r(t1, t3); // {a, b} <--| {a+b, b-a}
                        st1 = t3 - t1;
                        t1 += t3;
                        t3 = st1;

                        //sumdiff(t3, x[i2], x[i4], x[i7]); // {s, d}  <--| {a+b, a-b}
                        //st1 = x[i2]; x[i4] = t3 + st1; x[i7] = t3 - st1;
                        x[i4] = t3 + x[i2];
                        x[i7] = t3 - x[i2];

                        //sumdiff3(x[i1], t1, x[i6]);   // {a, b, d} <--| {a+b, b, a-b}
                        x[i6] = x[i1] - t1;
                        x[i1] += t1;

                        //diffsum3_r(t4, x[i5], x[i2]); // {a, b, s} <--| {a, b-a, a+b}
                        x[i2] = t4 + x[i5];
                        x[i5] -= t4;
                    }

                    ix = (id << 1) - n2;
                    id = id << 2;
                } while (ix < n);
            }
        }

        while (--i) {
            rval = x[i];
            ival = x[n - i - 1];
            mag = bSi * Math.sqrt(rval * rval + ival * ival);

            if (mag > this.peak) {
                this.peakBand = i;
                this.peak = mag;
            }

            spectrum[i] = mag;
        }

        spectrum[0] = bSi * x[0];

        return spectrum;
    }
}
